// src/utils/notionMapper.js
// Property-name mapper between live Notion OS database property names and the
// dashboard's canonical contract (notionArchitect.js).
//
// The Notion databases use user-chosen display names (e.g. "Idea Title",
// "Build Status"). This layer maps them to the dashboard-friendly keys so the
// UI can render real titles instead of "Untitled".
//
// Do NOT modify anything inside Notion — this is a read-side mapping only.

/**
 * Maps raw Notion property names → dashboard canonical names.
 * Keys are the Notion property display names; values are the canonical keys
 * that the dashboard views expect (matching notionArchitect.js NOTION_OS_DBS).
 */
export const PROPERTY_MAP = {
  // Ideas & Intake DB
  "Idea Title": "Name",
  "Build Status": "Status",
  "Pipeline Stage": "Stage",
  "Idea Category": "Category",
  "Score": "Priority",
  "Created At": "Created",
  "Updated At": "Last Updated",

  // Content Blocks DB
  "Content Engine Stage": "Stage",

  // Digital Assets DB
  "Asset Type": "Type",

  // Reputation Signals DB
  "Signal Strength": "Priority",

  // Automations Log DB
  "Automation Event": "Name",
  "Workflow Step": "Event",
  "Trigger Source": "Source",
};

/**
 * Return the dashboard-canonical name for a Notion property, or the original
 * name if no mapping exists.
 */
export function resolvePropertyName(notionPropName) {
  return PROPERTY_MAP[notionPropName] ?? notionPropName;
}

/**
 * Normalize a raw Notion page properties object by renaming keys to their
 * dashboard-canonical equivalents.
 *
 * @param {Record<string, any>} rawProps - Raw Notion property object (e.g. page.properties)
 * @returns {Record<string, any>} Properties with canonical keys
 */
export function normalizeProperties(rawProps) {
  if (!rawProps || typeof rawProps !== "object") return {};

  const normalized = {};
  for (const [key, value] of Object.entries(rawProps)) {
    const canonicalKey = resolvePropertyName(key);
    normalized[canonicalKey] = value;
  }
  return normalized;
}

export default { PROPERTY_MAP, resolvePropertyName, normalizeProperties };
