// src/lib/modelSelector.js
// ============================================================================
// Dashboard <-> backend model-switch wiring.
//
// Calls the dedicated backend functions (digitallydefined-os-backend):
//   POST {backend}/api/set-model         { model, user_id? }
//   GET  {backend}/api/active-model?user_id=
//   GET  {backend}/api/models
//
// The selected model is persisted server-side in Supabase
// (`user_model_preferences`) and mirrored into localStorage so the chat
// paths can attach it to every request without a network round-trip.
//
// Everything here is best-effort: switching never blocks the UI.
// ============================================================================

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || import.meta.env.VITE_DASHBOARD_API_URL || "https://digitallydefined-os-backend.vercel.app").replace(/\/+$/, "");
const DASHBOARD_API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";

export const MODEL_SWITCH_STORAGE_KEY = "dd-assistant-model";
export const DEFAULT_ASSISTANT_MODEL = "auto/best-chat";

function backendHeaders() {
  return {
    "Content-Type": "application/json",
    ...(DASHBOARD_API_KEY ? { "x-api-key": DASHBOARD_API_KEY } : {}),
  };
}

/** Current signed-in user id, when the auth context exposes one. */
export function currentUserId() {
  try {
    const ls = localStorage.getItem("sb-user-id") || localStorage.getItem("dd-user-id");
    if (ls) return ls;
  } catch { /* ignore */ }
  return "default";
}

/** List REAL models grouped by tier (free / gemini / bluesminds). */
export async function fetchModelGroups() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/models`, {
      headers: backendHeaders(),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const body = await res.json().catch(() => null);
    if (!body?.ok) return null;
    return body;
  } catch {
    return null;
  }
}

/**
 * Restore the stored model for this user.
 * Order: backend (Supabase-backed) -> localStorage -> backend default.
 */
export async function fetchActiveModel() {
  const local = getActiveModelId();

  const userId = currentUserId();

  // 1. backend (Supabase-backed) — GET /api/active-model
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/active-model?user_id=${encodeURIComponent(userId)}`,
      { headers: backendHeaders(), signal: AbortSignal.timeout(15000) }
    );
    if (res.ok) {
      const body = await res.json().catch(() => null);
      if (body?.activeModel) {
        return { model: body.activeModel, source: body.source || "supabase", local };
      }
    }
  } catch { /* fall through */ }

  // 2. Local fallback.
  //
  // NOTE: the previous step 2 posted { action: "hermes.getActiveModel" } to the
  // Vercel dispatcher. That action was never implemented there and always
  // returned 404, so the fallback silently failed and the dropdown reset to
  // the default model on every reload. The authoritative read is the
  // /api/active-model function above, which reads the same Supabase row.
  if (local) return { model: local, source: "local", local };
  return { model: DEFAULT_ASSISTANT_MODEL, source: "default", local: null };
}

/**
 * Synchronous read of the model the user selected.
 *
 * The chat paths need the active model id on every request (so the backend can
 * route to it), but they cannot await a network round-trip just to learn which
 * model is selected. localStorage is written by switchActiveModel() and kept in
 * sync with the Supabase row, so it is the right fast path here.
 */
export function getActiveModelId() {
  try {
    const v = localStorage.getItem(MODEL_SWITCH_STORAGE_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Switch the active model everywhere:
 *   backend-clean -> Hermes runtime -> Supabase persistence.
 * Returns the backend response { activeModel, ... } or throws.
 */
export async function switchActiveModel(modelId) {
  const model = String(modelId || "").trim();
  if (!model) throw new Error("A model id is required.");
  const userId = currentUserId();

  // 1. backend-clean — validates, syncs Hermes, persists, returns verdict.
  const res = await fetch(`${BACKEND_URL}/api/set-model`, {
    method: "POST",
    headers: backendHeaders(),
    body: JSON.stringify({ model, user_id: userId }),
    signal: AbortSignal.timeout(45000),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body?.ok === false) {
    throw new Error(body?.error || `Model switch failed (${res.status}).`);
  }

  try {
    localStorage.setItem(MODEL_SWITCH_STORAGE_KEY, body.activeModel || model);
  } catch { /* ignore */ }

  return { ...body, via: "backend-clean" };
}

export default { fetchModelGroups, fetchActiveModel, getActiveModelId, switchActiveModel, currentUserId, MODEL_SWITCH_STORAGE_KEY, DEFAULT_ASSISTANT_MODEL };
