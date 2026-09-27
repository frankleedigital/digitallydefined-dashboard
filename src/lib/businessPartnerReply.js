// src/lib/businessPartnerReply.js
// Shared rendering helpers for the Hermes business-partner response contract.
//
// The backend (src/routes/businessPartner.js) returns { reply, data, ... } where
// `data` is the structured business-partner payload:
//   { summary, opportunities[], riskFlags[], nextActions[], priorityFocus }
//
// Both the Assistant page and the floating ChatWidget render the same shape, so
// the formatting lives here rather than being duplicated per component.

/** Clean Hermes prose for display: normalize bullets, strip emoji/decorative glyphs. */
export const cleanPartnerReply = (text) => {
  if (!text || typeof text !== "string") return "";

  // Strip fenced code blocks the model sometimes wraps JSON in. The backend's
  // JSON parser can't reliably split prose from the trailing JSON fence, so
  // trim it here and render the structured payload from `businessInsights`.
  let out = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  // If a JSON object is still embedded in the prose, cut everything from the
  // opening brace onward — the structured fields are rendered separately.
  const brace = out.indexOf("{");
  const fence = out.indexOf("```");
  const cutAt =
    brace !== -1 && (fence === -1 || brace < fence)
      ? brace
      : fence !== -1
        ? fence
        : -1;
  if (cutAt > 0) out = out.slice(0, cutAt);

  // Normalize bullet markers to a plain dash list; drop stray asterisks/tildes.
  out = out.replace(/^\s*[*+]\s+/gm, "- ");
  out = out.replace(/[~^]{1,}/g, "");

  // Drop any leftover orphan asterisks.
  out = out.replace(/\*/g, "");

  // Remove decorative symbols and emoji: dingbats & checkmarks, arrows, misc
  // symbols, the full emoji range, and dot/bullet glyphs — keep letters, numbers,
  // and safe punctuation so real page/product titles survive intact.
  out = out.replace(
    /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{00B7}\u{2022}\u{2023}\u{2043}\u{25A0}-\u{25FF}\u{2B00}-\u{2BFF}]/gu,
    ""
  );

  // Collapse runs of blank lines.
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
};

/**
 * Normalize either business-partner payload shape into a single object.
 *
 * The backend route (src/routes/businessPartner.js) returns `businessInsights`
 * with snake_case keys:
 *   { summary, revenue_signals, growth_opportunities[], risk_flags[],
 *     recommended_next_action, confidence }
 *
 * The Supabase edge path returns `data` with camelCase keys:
 *   { summary, opportunities[], riskFlags[], nextActions[], priorityFocus }
 *
 * Accept either so the chat renders identically regardless of which backend
 * served the request.
 */
export const normalizeBusinessPayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;

  const opportunities = payload.opportunities ?? payload.growth_opportunities;
  const riskFlags = payload.riskFlags ?? payload.risk_flags;
  const nextActions = payload.nextActions;
  const priorityFocus = payload.priorityFocus ?? payload.recommended_next_action;

  return {
    summary: payload.summary,
    opportunities: Array.isArray(opportunities) ? opportunities : [],
    riskFlags: Array.isArray(riskFlags) ? riskFlags : [],
    nextActions: Array.isArray(nextActions)
      ? nextActions
      : priorityFocus
        ? [priorityFocus]
        : [],
    priorityFocus,
  };
};

/**
 * Flatten the structured business-partner payload into plain text so it can be
 * dropped into any chat bubble without bespoke markup. Returns "" when the
 * payload carries nothing renderable.
 */
export const formatStructuredBusinessReply = (payload) => {
  const data = normalizeBusinessPayload(payload);
  if (!data) return "";

  const summary = data.summary ? String(data.summary).trim() : "";
  const opportunities = data.opportunities;
  const riskFlags = data.riskFlags;
  const nextActions = data.nextActions;
  const priorityFocus = data.priorityFocus ? String(data.priorityFocus).trim() : "";

  const lines = [];
  if (summary) lines.push(summary);
  if (opportunities.length) {
    lines.push("");
    lines.push("Opportunities:");
    opportunities.forEach((item) => lines.push(`- ${String(item)}`));
  }
  if (riskFlags.length) {
    lines.push("");
    lines.push("Risk flags:");
    riskFlags.forEach((item) => lines.push(`- ${String(item)}`));
  }
  if (nextActions.length) {
    lines.push("");
    lines.push("Next actions:");
    nextActions.forEach((item) => lines.push(`- ${String(item)}`));
  }
  if (priorityFocus) {
    lines.push("");
    lines.push(`Priority focus: ${priorityFocus}`);
  }

  return cleanPartnerReply(lines.join("\n"));
};

/** Human-readable "Edited <file> — saved locally" lines for website edit results. */
export const formatAppliedEdit = (appliedEdit) => {
  if (!appliedEdit) return "";
  const edits = Array.isArray(appliedEdit) ? appliedEdit : [appliedEdit];
  const okEdits = edits.filter((e) => e && e.ok);
  const failedEdits = edits.filter((e) => e && !e.ok);

  const editLines = okEdits.map(
    (e) => `Edited ${e.file}${e.committed ? " — committed" : " — saved locally"}${e.pushed ? " → pushed to origin" : ""}`
  );
  const failLines = failedEdits.map((e) => `Failed to edit ${e.file}: ${e.error}`);

  return editLines.join("\n") + (failLines.length ? "\n\n" + failLines.join("\n") : "");
};

/**
 * Single entry point for rendering a business-partner response into message text.
 * Prefers the backend's `reply`, falls back to the structured `data` payload.
 */
export const renderBusinessPartnerReply = (data, fallback = "") => {
  const reply = typeof data?.reply === "string" ? data.reply : "";
  // The REST route returns `businessInsights`; the edge path returns `data`.
  const payload = data?.data ?? data?.businessInsights ?? null;
  const structured = payload ? formatStructuredBusinessReply(payload) : "";
  return cleanPartnerReply(reply || structured) || fallback;
};

export default {
  cleanPartnerReply,
  normalizeBusinessPayload,
  formatStructuredBusinessReply,
  formatAppliedEdit,
  renderBusinessPartnerReply,
};
