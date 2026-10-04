// Shared helper for calling the campus-wide dashboard backend.
// The dashboard no longer depends on the legacy Hermes Supabase edge function.

const DEFAULT_DASHBOARD_API_URL = 'https://digitallydefined-backend-clean.vercel.app';

// Resolve the configured backend base URL, shared by every call site so the
// routing logic below only has to think about one value.
function resolveBackendBase() {
  // Canonical backend base. VITE_API_URL is the single source of truth.
  // Do NOT fall back to VITE_SUPABASE_URL — that points to the Supabase project,
  // not the DigitallyDefined backend, and would route dashboard API calls to the
  // wrong service.
  const configuredUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_DASHBOARD_API_URL ||
    DEFAULT_DASHBOARD_API_URL;

  return String(configuredUrl).replace(/\/+$/, '');
}

/**
 * Turn an opaque network failure into something actionable.
 *
 * A browser reports *any* transport problem as "TypeError: Failed to fetch",
 * which hides the real cause. The most common cause is VITE_API_URL pointing at
 * a host that is not actually serving this backend (e.g. a domain attached to a
 * project with no functions), which answers 404/NOT_FOUND on every /api path.
 * A preflight must return 2xx, so that 404 surfaces to the UI as a CORS error
 * even though CORS is not the problem at all.
 */
export function describeNetworkFailure(url, err) {
  const target = new URL(url);
  const hint =
    `\n\nThe backend at ${target.origin} could not be reached.` +
    `\nIf VITE_API_URL points at a domain that 404s, every request fails this way.` +
    `\nVerify with: curl -s -o /dev/null -w '%{http_code}' ${target.origin}/api/health`;

  if (err instanceof TypeError) {
    return new Error(
      `Network error contacting the backend (${err.message}).` +
        `Check that VITE_API_URL is correct and the backend is deployed.${hint}`
    );
  }
  return err instanceof Error ? err : new Error(String(err));
}

export const getSupabaseEdgeUrl = (functionName = '') => {
  const normalized = resolveBackendBase();

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
  const url = getSupabaseEdgeUrl();
  let res;

  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
        ...extraHeaders,
      },
      body: JSON.stringify({ action, ...payload }),
    });
  } catch (err) {
    // Network-level failure (dead host, DNS, blocked preflight). Surface a
    // message that names the actual cause instead of "Failed to fetch".
    throw describeNetworkFailure(url, err);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export default { getSupabaseEdgeUrl, getSupabaseEdgeHeaders, callSupabaseEdge, describeNetworkFailure };
