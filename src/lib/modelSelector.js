// src/lib/modelSelector.js
// ============================================================================
// Dashboard <-> backend-clean model-switch wiring.
// ============================================================================
// Calls:
//   POST {backend}/api/set-model         { model, user_id? }
//   GET  {backend}/api/active-model?user_id=
//   GET  {backend}/api/models
//
// Falls back to the Hermes edge function (hermes.setActiveModel /
// hermes.getActiveModel) when backend-clean is unreachable.
// Everything here is best-effort: switching never blocks the UI.
// ============================================================================

import api from "../services/api";

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
    const body = await api.models.list();
    if (!body?.ok) return null;
    return body;
  } catch {
    return null;
  }
}

/**
 * Restore the stored model for this user.
 * Order: Supabase row -> localStorage -> backend default.
 */
export async function fetchActiveModel() {
  const local = (() => {
    try {
      const v = localStorage.getItem(MODEL_SWITCH_STORAGE_KEY);
      return v && v.trim() ? v.trim() : null;
    } catch {
      return null;
    }
  })();

  const userId = currentUserId();

  // 1. Backend — fetch active model
  try {
    const body = await api.models.getActive(userId);
    if (body?.activeModel) {
      return { model: body.activeModel, source: body.source || "backend", local };
    }
  } catch { /* fall through */ }

  // 2. Hermes edge function fallback
  try {
    const body = await api.post("hermes.getActiveModel", { user_id: userId });
    if (body?.activeModel) {
      return { model: body.activeModel, source: "hermes", local };
    }
  } catch { /* fall through */ }

  // 3. Local fallback
  if (local) return { model: local, source: "local", local };
  return { model: DEFAULT_ASSISTANT_MODEL, source: "default", local: null };
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

  // Backend — validates, syncs Hermes, persists, returns verdict.
  try {
    const body = await api.models.setActive(model, userId);
    try {
      localStorage.setItem(MODEL_SWITCH_STORAGE_KEY, body.activeModel || model);
    } catch { /* ignore */ }
    return { ...body, via: "backend" };
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : `Model switch failed.`);
  }
}

export default { fetchModelGroups, fetchActiveModel, switchActiveModel, currentUserId, MODEL_SWITCH_STORAGE_KEY, DEFAULT_ASSISTANT_MODEL };
