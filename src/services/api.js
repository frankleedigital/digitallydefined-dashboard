/**
 * ApiService — single source of truth for backend communication.
 *
 * RULES:
 * - No component may call fetch() directly.
 * - No component may reference import.meta.env.VITE_API_URL.
 * - No component may contain a hardcoded URL.
 * - All requests flow through this module.
 */

const DEFAULT_BASE_URL = 'https://digitallydefined-os-backend.vercel.app';

/* ------------------------------------------------------------------ */
/*  URL resolution                                                     */
/* ------------------------------------------------------------------ */

function resolveBaseUrl() {
  return (
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_DASHBOARD_API_URL ||
    DEFAULT_BASE_URL
  ).replace(/\/+$/, '');
}

const _baseUrl = resolveBaseUrl();

/* ------------------------------------------------------------------ */
/*  Headers                                                            */
/* ------------------------------------------------------------------ */

function headers(extra = {}) {
  const apiKey =
    import.meta.env.VITE_DASHBOARD_API_KEY || 'DigitallyDefined-OS-2026';
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    ...extra,
  };
}

/* ------------------------------------------------------------------ */
/*  Low-level HTTP helpers                                              */
/* ------------------------------------------------------------------ */

async function post(action, payload = {}) {
  const url = `${_baseUrl}/api`;
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

async function getRaw(path) {
  const url = `${_baseUrl}/api/${path.replace(/^\//, '')}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    throw new Error(`GET ${path} failed: ${res.status}`);
  }
  return res.json();
}

async function postRaw(path, body = {}) {
  const url = `${_baseUrl}/api/${path.replace(/^\//, '')}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || `POST ${path} failed: ${res.status}`);
  }
  return res.json();
}

async function getBase(path) {
  const url = `${_baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

/* ------------------------------------------------------------------ */
/*  Health / status                                                    */
/* ------------------------------------------------------------------ */

async function checkHealth() {
  try {
    const res = await fetch(`${_baseUrl}/api/health`, {
      headers: headers(),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, ...(await res.json().catch(() => ({}))) };
  } catch {
    return { ok: false, error: 'Backend unreachable' };
  }
}

async function hermesStatus() {
  try {
    const res = await fetch(`${_baseUrl}/api`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ action: 'hermes.status' }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return { online: false, success: false, status: res.status, error: `Request failed: ${res.status}` };
    }
    const data = await res.json();
    // Return the full backend payload (activeProvider, providerHealth,
    // fallbackOrder, providerLatencies, currentModel) so consumers do not
    // need a second request. `online`/`status` are kept for compatibility.
    return { ...data, online: Boolean(data?.online ?? data?.success), status: data?.status ?? res.status };
  } catch (err) {
    return { online: false, success: false, error: err?.message || 'Backend unreachable' };
  }
}

/* ------------------------------------------------------------------ */
/*  Dashboard data                                                     */
/* ------------------------------------------------------------------ */

const dashboard = {
  fetch: (userId) => post('dashboard', { userId }),
  sync: (userId) => post('automation.sync', { userId }),
  automations: (userId) => post('automation.list', { userId }),
};

/* ------------------------------------------------------------------ */
/*  Chat / AI                                                          */
/* ------------------------------------------------------------------ */

const chat = {
  send: (message, history = []) =>
    postRaw('business-partner', {
      message,
      action: 'business.partner',
      conversation: history,
      job: 'reasoning',
    }),
};

/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */

const models = {
  list: () => getRaw('models'),
  getActive: (userId) => getRaw(`active-model?user_id=${encodeURIComponent(userId)}`),
  setActive: (model, userId) => postRaw('set-model', { model, user_id: userId }),
};

/* ------------------------------------------------------------------ */
/*  Integrations                                                       */
/* ------------------------------------------------------------------ */

const integrations = {
  fetch: (type) => post(`integration.${type}`),
  start: (type) => post(`integration.${type}.start`),
  googleAnalytics: (params) => post('integration.googleAnalytics', params),
  social: (params) => post('integration.social', params),
  email: (params) => post('integration.email', params),
  community: (params) => post('integration.community', params),
};

/* ------------------------------------------------------------------ */
/*  Notion                                                             */
/* ------------------------------------------------------------------ */

const notion = {
  createPage: (props) => post('notion.page.create', props),
  intakeReport: (data) => post('notion.intake.report', data),
  logAutomation: (data) => post('automation.log', data),
};

/* ------------------------------------------------------------------ */
/*  License                                                            */
/* ------------------------------------------------------------------ */

const license = {
  verify: (key) => post('license.verify', { licenseKey: key }),
};

/* ------------------------------------------------------------------ */
/*  Intelligence                                                       */
/* ------------------------------------------------------------------ */

const intelligence = {
  fetch: (answers) => post('intelligence', { answers }),
  personalize: (data) => post('personalize', data),
};

/* ------------------------------------------------------------------ */
/*  Antigravity                                                        */
/* ------------------------------------------------------------------ */

const antigravity = {
  status: () => post('antigravity.status'),
  run: (toolId, params) => post(`antigravity.${toolId}`, params),
};

/* ------------------------------------------------------------------ */
/*  Export — single surface                                             */
/* ------------------------------------------------------------------ */

const ApiService = {
  /* config */
  getBaseUrl: () => _baseUrl,

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
  getRaw,
  postRaw,
  getBase,
};

export default ApiService;