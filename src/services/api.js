/**
 * api.js — THE single API layer for the DigitallyDefined dashboard.
 *
 * This module absorbs the three previously competing layers:
 *   - services/api.js      (domain methods)
 *   - lib/api-client.js    (retry / timeout / ApiError transport)
 *   - lib/supabase-edge.js (re-export wrapper)
 *
 * RULES:
 * - No component may call fetch() directly.
 * - No component may reference import.meta.env.VITE_API_URL.
 * - No component may contain a hardcoded backend URL.
 * - All requests flow through this module.
 *
 * Default export: ApiService (domain methods + raw helpers)
 * Named exports:  apiRequest, postAction, rest, getBaseUrl, resolveBaseUrl,
 *                 getApiKey, buildHeaders, ApiError, callSupabaseEdge,
 *                 getSupabaseEdgeUrl, getSupabaseEdgeHeaders
 */

export const DEFAULT_BASE_URL = 'https://digitallydefined-os-backend.vercel.app';
export const CANONICAL_BASE_URL = 'https://digitallydefined-os-backend.vercel.app';
export const DEFAULT_TIMEOUT_MS = 30000;
export const DEFAULT_RETRIES = 2;

// Retired alias — the os-backend project was renamed. Any stale VITE_* value
// or cached bundle pointing here is rewritten to the canonical host so old
// deployments keep working instead of "Failed to fetch".
export const LEGACY_BASE_URLS = ['https://digitallydefined-backend-clean.vercel.app'];

/* ------------------------------------------------------------------ */
/*  URL + header resolution                                            */
/* ------------------------------------------------------------------ */

function normalizeBaseUrl(raw) {
  let base = String(raw || '').trim().replace(/\/+$/, '');
  for (const legacy of LEGACY_BASE_URLS) {
    if (base.toLowerCase().startsWith(legacy.toLowerCase())) {
      try { console.warn('[api] Rewriting retired backend host to canonical:', base, '->', CANONICAL_BASE_URL); } catch { /* noop */ }
      base = CANONICAL_BASE_URL + base.slice(legacy.length);
      break;
    }
  }
  return base.replace(/\/+$/, '') || CANONICAL_BASE_URL;
}

export function resolveBaseUrl() {
  const base =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_DASHBOARD_API_URL ||
    DEFAULT_BASE_URL;
  return normalizeBaseUrl(base);
}

export function getBaseUrl() {
  return resolveBaseUrl();
}

export function getApiKey() {
  return import.meta.env.VITE_DASHBOARD_API_KEY || 'DigitallyDefined-OS-2026';
}

export function buildHeaders(extra = {}) {
  return {
    'Content-Type': 'application/json',
    'x-api-key': getApiKey(),
    ...extra,
  };
}

/* ------------------------------------------------------------------ */
/*  Errors                                                             */
/* ------------------------------------------------------------------ */

/** Standardized error — never a bare "Failed to fetch". */
export class ApiError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = opts.code || 'API_ERROR';
    this.status = opts.status ?? null;
    this.url = opts.url || null;
    this.action = opts.action || null;
    if (opts.cause) this.cause = opts.cause;
  }
  toJSON() {
    return { name: this.name, message: this.message, code: this.code, status: this.status, url: this.url, action: this.action };
  }
}

/* ------------------------------------------------------------------ */
/*  Transport internals                                                */
/* ------------------------------------------------------------------ */

function timeoutSignal(ms) {
  try {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(ms);
  } catch { /* manual fallback below */ }
  const c = new AbortController();
  setTimeout(() => { try { c.abort(new Error('timeout')); } catch { /* noop */ } }, ms);
  return c.signal;
}

function isRetryableStatus(s) { return s === 408 || s === 429 || (s >= 500 && s <= 599); }

function logApi(level, ...a) {
  try {
    if (import.meta.env.DEV) (console[level] || console.log)('[api]', ...a);
    else if (level === 'error' || level === 'warn') (console[level] || console.log)('[api]', ...a);
  } catch { /* never throw */ }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function toFriendlyError(url, err, action) {
  const raw = err instanceof Error ? err.message : String(err);
  let msg = raw || 'Request failed';
  let code = 'REQUEST_FAILED';
  if (err instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(raw)) {
    let origin = url;
    try { origin = new URL(url).origin; } catch { /* keep */ }
    msg = 'Cannot reach backend at ' + origin + '. Check connection, ad-blocker/CORS, and VITE_API_URL. (network: ' + raw + ')';
    code = 'NETWORK_UNREACHABLE';
  } else if ((err && err.name === 'AbortError') || /timed out|aborted/i.test(raw)) {
    msg = 'Backend request timed out. Server may be cold-starting — retry shortly. (' + raw + ')';
    code = 'TIMEOUT';
  } else if (err instanceof ApiError) return err;
  const out = new ApiError(msg, { code, url, action });
  out.cause = err;
  return out;
}

/* ------------------------------------------------------------------ */
/*  Core request                                                       */
/* ------------------------------------------------------------------ */

export async function apiRequest(path, opts = {}) {
  const method = opts.method || 'GET';
  const timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;
  const retries = opts.retries ?? DEFAULT_RETRIES;
  const action = opts.action || null;
  const base = normalizeBaseUrl(opts.base || resolveBaseUrl());
  const url = /^https?:\/\//i.test(path) ? normalizeBaseUrl(path) : base + (path.startsWith('/') ? path : '/' + path);
  let attempt = 0;
  let last = null;

  while (attempt <= retries) {
    attempt += 1;
    try {
      logApi('info', method + ' ' + url + ' try ' + attempt);
      const res = await fetch(url, {
        method,
        headers: buildHeaders(opts.headers || {}),
        body: opts.body === undefined ? undefined : (typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body)),
        signal: timeoutSignal(timeoutMs),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const srv = data && (data.error || data.message) ? String(data.error || data.message) : '';
        const hint = res.status === 401 ? ' VITE_DASHBOARD_API_KEY mismatch.'
          : res.status === 404 ? ' Endpoint/action missing on backend.' : '';
        const e = new ApiError((srv || (method + ' ' + path + ' failed')) + hint + ' (HTTP ' + res.status + ')',
          { code: res.status === 401 ? 'UNAUTHORIZED' : res.status === 404 ? 'NOT_FOUND' : 'HTTP_ERROR', status: res.status, url, action });
        if (attempt <= retries && isRetryableStatus(res.status)) { last = e; await sleep(400 * Math.pow(2, attempt - 1)); continue; }
        throw e;
      }
      return await res.json().catch(() => null);
    } catch (err) {
      if (err instanceof ApiError && err.status != null && !isRetryableStatus(err.status)) throw err;
      last = toFriendlyError(url, err, action);
      const retryable = (err instanceof TypeError) || (err && (err.name === 'AbortError')) || (err instanceof ApiError && isRetryableStatus(err.status));
      if (attempt <= retries && (retryable || (last && last.code === 'NETWORK_UNREACHABLE') || (last && last.code === 'TIMEOUT'))) {
        logApi('warn', 'retrying: ' + last.message);
        await sleep(400 * Math.pow(2, attempt - 1));
        continue;
      }
      throw last;
    }
  }
  throw last || new ApiError('Retries exhausted', { code: 'RETRY_EXHAUSTED', url, action });
}

export function postAction(action, payload = {}, opts = {}) {
  return apiRequest('/api', { method: 'POST', body: { action, ...payload }, action, ...opts });
}

export function rest(path, opts = {}) {
  const clean = String(path).replace(/^\/+/, '').replace(/^api\//, '');
  return apiRequest('/api/' + clean, opts);
}

/* ------------------------------------------------------------------ */
/*  Convenience wrappers                                               */
/* ------------------------------------------------------------------ */

const apiUrl = () => `${resolveBaseUrl()}/api`;

const post = (action, payload = {}) => postAction(action, payload);
const postRaw = (path, body = {}) => rest(path, { method: 'POST', body, action: path });
const getRaw = (path) => rest(path, { action: path });
const getBase = (path) => apiRequest(path.startsWith('/') ? path : `/${path}`);

async function checkHealth() {
  try {
    const res = await fetch(`${resolveBaseUrl()}/api/health`, {
      headers: buildHeaders(),
      signal: timeoutSignal(5000),
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, ...(await res.json().catch(() => ({}))) };
  } catch {
    return { ok: false, error: 'Backend unreachable' };
  }
}

async function hermesStatus() {
  try {
    const data = await postAction('hermes.status', {}, { timeoutMs: 15000, retries: 0 });
    return { online: Boolean(data?.online), status: data?.status ?? 200 };
  } catch (err) {
    return { online: false, status: err?.status ?? null };
  }
}

/* ------------------------------------------------------------------ */
/*  Domain services                                                    */
/* ------------------------------------------------------------------ */

const dashboard = {
  fetch: (userId) => post('dashboard', { userId }),
  sync: (userId) => post('automation.sync', { userId }),
  automations: (userId) => post('automation.list', { userId }),
};

const chat = {
  send: (message, history = []) =>
    postRaw('business-partner', {
      message,
      action: 'business.partner',
      conversation: history,
      job: 'reasoning',
    }),
};

const models = {
  list: () => getRaw('models'),
  getActive: (userId) => getRaw(`active-model?user_id=${encodeURIComponent(userId)}`),
  setActive: (model, userId) => postRaw('set-model', { model, user_id: userId }),
};

const integrations = {
  fetch: (type) => post(`integration.${type}`),
  start: (type) => post(`integration.${type}.start`),
  googleAnalytics: (params) => post('integration.googleAnalytics', params),
  social: (params) => post('integration.social', params),
  email: (params) => post('integration.email', params),
  community: (params) => post('integration.community', params),
};

const notion = {
  createPage: (props) => post('notion.page.create', props),
  intakeReport: (data) => post('notion.intake.report', data),
  logAutomation: (data) => post('automation.log', data),
};

const license = {
  verify: (key) => post('license.verify', { licenseKey: key }),
};

const intelligence = {
  fetch: (answers) => post('intelligence', { answers }),
  personalize: (data) => post('personalize', data),
};

const antigravity = {
  status: () => post('antigravity.status'),
  run: (toolId, params) => post(`antigravity.${toolId}`, params),
};

/* ------------------------------------------------------------------ */
/*  Back-compat aliases (formerly lib/supabase-edge.js)                */
/* ------------------------------------------------------------------ */

export const getSupabaseEdgeUrl = (functionName = '') => {
  const base = getBaseUrl();
  if (!functionName) return base + '/api';
  const fn = functionName.replace(/^\/+/, '').replace(/^functions\/v1\//, '').replace(/^api\//, '');
  return base + '/api/' + fn;
};

export const getSupabaseEdgeHeaders = (extra = {}) => buildHeaders(extra);

export function callSupabaseEdge(action, payload = {}, extraHeaders = {}) {
  return postAction(action, payload, { timeoutMs: 45000, retries: 2, headers: extraHeaders });
}

export const describeNetworkFailure = (url, err) => err;

/* ------------------------------------------------------------------ */
/*  Export — single surface                                            */
/* ------------------------------------------------------------------ */

const ApiService = {
  /* config */
  getBaseUrl,
  resolveBaseUrl,
  getApiKey,
  buildHeaders,
  apiUrl,

  /* health */
  checkHealth,
  hermesStatus,

  /* domain services */
  dashboard,
  chat,
  models,
  integrations,
  notion,
  license,
  intelligence,
  antigravity,

  /* raw (for edge cases — prefer the named methods above) */
  post,
  postRaw,
  getRaw,
  getBase,
  apiRequest,
  postAction,
  rest,
  callSupabaseEdge,
};

export default ApiService;
