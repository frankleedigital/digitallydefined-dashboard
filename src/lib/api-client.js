/**
 * api-client.js — centralized API layer for the dashboard.
 * Timeout + retry + standardized ApiError + auth headers + logging.
 * RULE: all backend communication should flow through here.
 */

export const DEFAULT_BASE_URL = 'https://digitallydefined-os-backend.vercel.app';
export const DEFAULT_TIMEOUT_MS = 30000;
export const DEFAULT_RETRIES = 2;

export function resolveBaseUrl() {
  const base =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_DASHBOARD_API_URL ||
    DEFAULT_BASE_URL;
  return String(base).replace(/\/+$/, '');
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

export function getBaseUrl() { return resolveBaseUrl(); }

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
    if (import.meta.env.DEV) (console[level] || console.log)('[api-client]', ...a);
    else if (level === 'error' || level === 'warn') (console[level] || console.log)('[api-client]', ...a);
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

export async function apiRequest(path, opts = {}) {
  const method = opts.method || 'GET';
  const timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;
  const retries = opts.retries ?? DEFAULT_RETRIES;
  const action = opts.action || null;
  const base = String(opts.base || resolveBaseUrl()).replace(/\/+$/, '');
  const url = /^https?:\/\//i.test(path) ? path : base + (path.startsWith('/') ? path : '/' + path);
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
export default { apiRequest, postAction, rest, getBaseUrl, resolveBaseUrl, getApiKey, buildHeaders, ApiError };

