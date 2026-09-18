// Shared helper for calling the campus-wide dashboard backend.
// The dashboard no longer depends on the legacy Hermes Supabase edge function.

const DEFAULT_DASHBOARD_API_URL = 'https://api.digitallydefined.online';

export const getSupabaseEdgeUrl = (functionName = '') => {
  // Canonical backend base. VITE_API_URL is the single source of truth.
  // Do NOT fall back to VITE_SUPABASE_URL — that points to the Supabase project,
  // not the DigitallyDefined backend, and would route dashboard API calls to the
  // wrong service.
  const configuredUrl = import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_DASHBOARD_API_URL ||
    DEFAULT_DASHBOARD_API_URL;

  const normalized = configuredUrl.replace(/\/+$/, '');

  if (!functionName) {
    // No specific function requested — return base with /api prefix so
    // requests hit the backend dispatcher (not the bare root which 404s).
    return `${normalized}/api`;
  }

  // Strip any leading slashes and a redundant "functions/v1/" segment so a base
  // that already ends in "/functions/v1" never produces "/functions/v1/functions/v1".
  const fn = functionName.replace(/^\//, '').replace(/^functions\/v1\//, '');
  const base = normalized.includes('/functions/v1')
    ? normalized
    : `${normalized}/api`;
  return `${base}/${fn}`;
};

export const getSupabaseEdgeHeaders = (extra = {}) => {
  const apiKey = import.meta.env.VITE_DASHBOARD_API_KEY;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!apiKey) {
    console.warn(
      '[Dashboard] VITE_DASHBOARD_API_KEY is not set in this build. Authenticated dashboard requests will be rejected with 401.'
    );
  }

  return {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'x-api-key': apiKey } : {}),
    ...(anonKey ? { apikey: anonKey, Authorization: `Bearer ${anonKey}` } : {}),
    ...extra,
  };
};

export async function callSupabaseEdge(action, payload = {}, extraHeaders = {}) {
  const apiKey = import.meta.env.VITE_DASHBOARD_API_KEY;
  const res = await fetch(getSupabaseEdgeUrl(), {
    method: 'POST',
    headers: getSupabaseEdgeHeaders(extraHeaders),
    body: JSON.stringify({ action, ...(apiKey ? { key: apiKey } : {}), ...payload }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export default { getSupabaseEdgeUrl, getSupabaseEdgeHeaders, callSupabaseEdge };
