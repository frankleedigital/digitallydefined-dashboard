// Shared helper for calling the campus-wide dashboard backend.
// The dashboard no longer depends on the legacy Hermes Supabase edge function.

const DEFAULT_DASHBOARD_API_URL = 'https://digitallydefined-os-backend.vercel.app/api';

export const getSupabaseEdgeUrl = (functionName = '') => {
  const configuredUrl = import.meta.env.VITE_DASHBOARD_API_URL ||
    import.meta.env.VITE_SUPABASE_URL ||
    DEFAULT_DASHBOARD_API_URL;

  const normalized = configuredUrl.replace(/\/+$/, '');

  if (normalized.includes('/functions/v1')) {
    return functionName ? `${normalized}/functions/v1/${functionName}` : normalized;
  }

  if (functionName) {
    return `${normalized}/${functionName.replace(/^\//, '')}`;
  }

  return normalized;
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
