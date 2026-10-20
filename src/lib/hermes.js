// src/lib/hermes.js
// ============================================================================
// Hermes chat helper.
//
// IMPORTANT: Hermes chat is routed through the Vercel backend
// (digitallydefined-os-backend), NOT directly to the Supabase edge function.
//
// Why: the Supabase edge function has no `hermes.agent` branch — it answers
// 404 "Unknown action" for that action, and its model selection is a
// per-instance in-memory variable that is never synced from the dashboard's
// model selector. The Vercel dispatcher (api/index.js) DOES handle
// `hermes.agent` and honours a `model` override in the request body.
//
// The model the user picked in the dashboard selector is attached to every
// request so the backend actually routes to it.
// ============================================================================

import { rest, apiRequest, getBaseUrl, buildHeaders } from "./api-client";
import { recordRequestFailure } from "./error-monitor";


export function getHermesEndpoint() {
  if (import.meta.env.VITE_HERMES_ENDPOINT) return import.meta.env.VITE_HERMES_ENDPOINT;
  return getBaseUrl() + '/api';
}

export function getHermesHeaders(extra = {}) {
  const headers = buildHeaders(extra);
  if (!import.meta.env.VITE_DASHBOARD_API_KEY && import.meta.env.DEV) {
    console.warn('[Hermes] VITE_DASHBOARD_API_KEY not set; backend may 401.');
  }
  return headers;
}

let typingCallback = null;

export function onHermesTyping(cb) {
  typingCallback = cb;
}

export async function getHermesStatus() {
  try {
    const data = await apiRequest('/api?action=status', { method: 'GET', timeoutMs: 9000, retries: 1 });
    return { online: Boolean(data?.ok ?? true), status: data?.status ?? 200, provider: data?.provider || null, checkedAt: Date.now() };
  } catch (err) {
    try { recordRequestFailure({ message: err.message, url: getBaseUrl() + '/api', action: 'status', code: err.code, status: err.status }); } catch { /* noop */ }
    return { online: false, error: err instanceof Error ? err.message : String(err), checkedAt: Date.now() };
  }
}

export async function sendToHermes(message, context = {}) {
  if (typingCallback) typingCallback(true);
  try {
    const action = (import.meta.env.VITE_HERMES_ACTION) || (context.devMode ? 'mentor.dev' : 'hermes.agent');
    let model = String(context.model || '').trim();
    if (!model) {
      try {
        const { getActiveModelId } = await import('./modelSelector');
        model = String(getActiveModelId() || '').trim();
      } catch { /* localStorage may be unavailable */ }
    }
    const { devMode, ...restCtx } = context;
    const data = await apiRequest('/api', {
      method: 'POST', timeoutMs: 60000, retries: 1, action,
      body: { action, message, systemPrompt: context.systemPrompt || context.system || null, toolState: context.toolState || null, page: context.page || null, ...(model ? { model } : {}), ...restCtx },
    });
    return data;
  } catch (err) {
    try { recordRequestFailure({ message: err.message, url: getBaseUrl() + '/api', action: 'hermes.agent', code: err.code, status: err.status }); } catch { /* noop */ }
    throw err;
  } finally {
    if (typingCallback) typingCallback(false);
  }
}

export default { getHermesEndpoint, getHermesHeaders, sendToHermes, getHermesStatus, onHermesTyping };
