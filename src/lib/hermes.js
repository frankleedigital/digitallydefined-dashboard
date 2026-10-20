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

import { getSupabaseEdgeUrl, getSupabaseEdgeHeaders } from "./supabase-edge";
import { getActiveModelId } from "./modelSelector";

export function getHermesEndpoint() {
  // Explicit override still wins (useful for pointing at a local backend).
  if (import.meta.env.VITE_HERMES_ENDPOINT) {
    return import.meta.env.VITE_HERMES_ENDPOINT;
  }
  // The backend dispatcher root: POST {base}/api with an `action` in the body.
  return getSupabaseEdgeUrl();
}

export function getHermesHeaders(extra = {}) {
  const headers = getSupabaseEdgeHeaders(extra);

  if (!import.meta.env.VITE_DASHBOARD_API_KEY) {
    console.warn(
      '[Hermes] VITE_DASHBOARD_API_KEY is not set. Authenticated requests will be rejected with 401.'
    );
  }

  return headers;
}

let typingCallback = null;

export function onHermesTyping(cb) {
  typingCallback = cb;
}

export async function getHermesStatus() {
  try {
    // Probe the backend dispatcher, not a relative path — a relative URL only
    // works if a dev-server proxy happens to exist for it.
    const res = await fetch(`${getHermesEndpoint()}?action=status`, {
      method: "GET",
      headers: getHermesHeaders(),
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return { online: false, status: res.status, checkedAt: Date.now() };
    const data = await res.json();
    return {
      online: Boolean(data?.ok ?? true),
      status: data?.status ?? res.status,
      provider: data?.provider || null,
      checkedAt: Date.now(),
    };
  } catch (err) {
    return { online: false, error: err instanceof Error ? err.message : String(err), checkedAt: Date.now() };
  }
}

export async function sendToHermes(message, context = {}) {
  if (typingCallback) typingCallback(true);

  try {
    const action =
      (import.meta.env.VITE_HERMES_ACTION) ||
      (context.devMode ? 'mentor.dev' : 'hermes.agent');

    // Attach the model the user selected so the backend routes to it.
    // `context.model` wins (a caller may want a one-off override).
    const model = String(context.model || getActiveModelId() || '').trim();

    const res = await fetch(getHermesEndpoint(), {
      method: "POST",
      headers: getHermesHeaders(),
      body: JSON.stringify({
        action,
        message,
        systemPrompt: context.systemPrompt || context.system || null,
        toolState: context.toolState || null,
        page: context.page || null,
        ...(model ? { model } : {}),
        ...context,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Hermes request failed: ${res.status}`);
    }

    return await res.json();
  } finally {
    if (typingCallback) typingCallback(false);
  }
}

export default { getHermesEndpoint, getHermesHeaders, sendToHermes };
