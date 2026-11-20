/**
 * supabase-edge.js — backward-compatible re-export of ApiService.
 *
 * DEPRECATED: New code should import from '../services/api' directly.
 * This file delegates all calls to ApiService so existing imports keep working.
 */
import api from '../services/api';
import { postAction, getBaseUrl, buildHeaders } from './api-client';
import { recordRequestFailure } from './error-monitor';

export const getSupabaseEdgeUrl = (functionName = '') => {
  const base = getBaseUrl();
  if (!functionName) return base + '/api';
  const fn = functionName.replace(/^\/+/, '').replace(/^functions\/v1\//, '').replace(/^api\//, '');
  return base + '/api/' + fn;
};

export const getSupabaseEdgeHeaders = (extra = {}) => buildHeaders(extra);

export async function callSupabaseEdge(action, payload = {}, extraHeaders = {}) {
  try {
    return await postAction(action, payload, { timeoutMs: 45000, retries: 2, headers: extraHeaders });
  } catch (err) {
    try { recordRequestFailure({ message: err.message, url: getSupabaseEdgeUrl(), action, code: err.code, status: err.status }); } catch { /* noop */ }
    throw err;
  }
}

export const describeNetworkFailure = (url, err) => err;
export default { getSupabaseEdgeUrl, getSupabaseEdgeHeaders, callSupabaseEdge, describeNetworkFailure };

