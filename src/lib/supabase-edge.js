/**
 * supabase-edge.js — backward-compatible re-export of ApiService.
 *
 * DEPRECATED: New code should import from '../services/api' directly.
 * This file delegates all calls to ApiService so existing imports keep working.
 */
import api from '../services/api';

export const getSupabaseEdgeUrl = (functionName = '') => {
  const base = api.getBaseUrl();
  if (!functionName) return `${base}/api`;
  const fn = functionName.replace(/^\//, '').replace(/^functions\/v1\//, '');
  return `${base}/api/${fn}`;
};

export const getSupabaseEdgeHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_DASHBOARD_API_KEY || 'DigitallyDefined-OS-2026',
  ...extra,
});

export async function callSupabaseEdge(action, payload = {}, extraHeaders = {}) {
  if (extraHeaders && Object.keys(extraHeaders).length > 0) {
    const url = getSupabaseEdgeUrl();
    const res = await fetch(url, {
      method: 'POST',
      headers: getSupabaseEdgeHeaders(extraHeaders),
      body: JSON.stringify({ action, ...payload }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed: ${res.status}`);
    }
    return res.json();
  }
  return api.post(action, payload);
}

export const describeNetworkFailure = (url, err) => {
  const target = new URL(url);
  const hint = `\n\nThe backend at ${target.origin} could not be reached.`;
  if (err instanceof TypeError) {
    return new Error(
      `Network error contacting the backend (${err.message}). Check that VITE_API_URL is correct.${hint}`
    );
  }
  return err instanceof Error ? err : new Error(String(err));
};

export default { getSupabaseEdgeUrl, getSupabaseEdgeHeaders, callSupabaseEdge, describeNetworkFailure };
