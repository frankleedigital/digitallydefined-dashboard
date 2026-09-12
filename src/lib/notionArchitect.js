// lib/notionArchitect.js (dashboard)
// JS mirror of the backend Notion Architect contract
// (supabase/functions/_shared/notion-architect.ts). Keep in sync.
//
// Gives the dashboard views one normalized contract for the 8 core Notion OS
// databases: Digital Assets, Ideas & Intake, Money Snapshot, Monthly Review,
// Reputation Signals, Content Blocks, Automations Log, Templates Library.

export const NOTION_OS_DBS = {
  assets: {
    key: "assets", label: "Digital Assets DB", envVar: "NOTION_ASSETS_DB_ID",
    dedupKeys: ["Name", "URL"],
    properties: [
      { name: "Name", type: "title", required: true, maxChars: 2000 },
      { name: "URL", type: "url", required: false },
      { name: "Status", type: "select", required: false, options: ["Draft", "Published", "Paused", "Scheduled", "Archived"] },
      { name: "Niche", type: "rich_text", required: false, maxChars: 500 },
      { name: "AssetValue", type: "number", required: false },
      { name: "Created", type: "date", required: false },
    ],
  },
  ideas: {
    key: "ideas", label: "Ideas & Intake DB", envVar: "NOTION_IDEAS_DB_ID",
    dedupKeys: ["Name", "Created"],
    properties: [
      { name: "Name", type: "title", required: true, maxChars: 2000 },
      { name: "Status", type: "select", required: false, options: ["Draft", "Published", "Archived"] },
      { name: "Source", type: "rich_text", required: false, maxChars: 200 },
      { name: "Niche", type: "rich_text", required: false, maxChars: 500 },
      { name: "Created", type: "date", required: false },
    ],
  },
  money: {
    key: "money", label: "Money Snapshot DB", envVar: "NOTION_MONEY_DB_ID",
    dedupKeys: ["Name", "Created"],
    properties: [
      { name: "Name", type: "title", required: true, maxChars: 2000 },
      { name: "Month", type: "date", required: false },
      { name: "Revenue", type: "number", required: false },
      { name: "Expenses", type: "number", required: false },
      { name: "Net", type: "number", required: false },
      { name: "Created", type: "date", required: false },
    ],
  },
  monthly: {
    key: "monthly", label: "Monthly Review DB", envVar: "NOTION_MONTHLY_DB_ID",
    dedupKeys: ["Name", "Created"],
    properties: [
      { name: "Name", type: "title", required: true, maxChars: 2000 },
      { name: "Period", type: "date", required: false },
      { name: "Wins", type: "rich_text", required: false, maxChars: 2000 },
      { name: "Risks", type: "rich_text", required: false, maxChars: 2000 },
      { name: "NextActions", type: "rich_text", required: false, maxChars: 2000 },
      { name: "Created", type: "date", required: false },
    ],
  },
};

const STATUS_SYNONYMS = {
  live: "Published", published: "Published", on: "Published", active: "Published",
  draft: "Draft", wip: "Draft", idea: "Draft", pending: "Draft",
  paused: "Paused", scheduled: "Scheduled", archived: "Archived",
  done: "Done", complete: "Done", completed: "Done", failed: "Failed", error: "Failed",
};
const DATE_SYNONYMS = {
  month: "Month", period: "Period", created: "Created",
  createdat: "Created", created_at: "Created", publishedat: "Created",
};

const canonicalKey = (name) => String(name).replace(/[\s_]/g, "").toLowerCase();
const capText = (value, maxChars) => (value == null ? "" : String(value).trim()).slice(0, maxChars);

// Remaining 4 of the 8 core DBs (reputation / content / automations / templates).
NOTION_OS_DBS.reputation = {
  key: "reputation", label: "Reputation Signals DB", envVar: "NOTION_REPUTATION_DB_ID",
  dedupKeys: ["Name", "URL"],
  properties: [
    { name: "Name", type: "title", required: true, maxChars: 2000 },
    { name: "URL", type: "url", required: false },
    { name: "Signal", type: "select", required: false, options: ["Positive", "Neutral", "Negative"] },
    { name: "Score", type: "number", required: false },
    { name: "Created", type: "date", required: false },
  ],
};
NOTION_OS_DBS.content = {
  key: "content", label: "Content Blocks DB", envVar: "NOTION_CONTENT_DB_ID",
  dedupKeys: ["Name", "URL"],
  properties: [
    { name: "Name", type: "title", required: true, maxChars: 2000 },
    { name: "Status", type: "select", required: false, options: ["Draft", "Published", "Scheduled", "Archived"] },
    { name: "ContentType", type: "select", required: false, options: ["Blog", "Newsletter", "Social", "Video", "Guide", "Template"] },
    { name: "Niche", type: "rich_text", required: false, maxChars: 500 },
    { name: "URL", type: "url", required: false },
    { name: "Created", type: "date", required: false },
  ],
};
NOTION_OS_DBS.automations = {
  key: "automations", label: "Automations Log DB", envVar: "NOTION_AUTOMATIONS_DB_ID",
  dedupKeys: ["Name", "Created"],
  properties: [
    { name: "Name", type: "title", required: true, maxChars: 2000 },
    { name: "Status", type: "select", required: false, options: ["Draft", "Published", "Done", "Failed"] },
    { name: "Source", type: "rich_text", required: false, maxChars: 200 },
    { name: "Email", type: "email", required: false },
    { name: "Superpower", type: "rich_text", required: false, maxChars: 100 },
    { name: "Created", type: "date", required: false },
  ],
};
NOTION_OS_DBS.templates = {
  key: "templates", label: "Templates Library DB", envVar: "NOTION_TEMPLATES_DB_ID",
  dedupKeys: ["Name", "URL"],
  properties: [
    { name: "Name", type: "title", required: true, maxChars: 2000 },
    { name: "Status", type: "select", required: false, options: ["Draft", "Published", "Archived"] },
    { name: "Format", type: "select", required: false, options: ["PDF", "Notion", "Spreadsheet", "Checklist", "Playbook"] },
    { name: "URL", type: "url", required: false },
    { name: "Niche", type: "rich_text", required: false, maxChars: 500 },
    { name: "Created", type: "date", required: false },
  ],
};

/** Look up the architect type for a property name. */
export function getNotionPropType(dbKey, propName) {
  const spec = NOTION_OS_DBS[dbKey];
  return spec?.properties.find((p) => p.name === propName)?.type ?? null;
}

/** Dedup-key tuple for a DB record (Name/URL/Email/Created). */
export function getNotionDedupTuple(dbKey, record) {
  const spec = NOTION_OS_DBS[dbKey];
  if (!spec) return null;
  const tuple = {};
  for (const key of spec.dedupKeys) {
    if (record[key] !== undefined) tuple[key] = record[key];
  }
  return tuple;
}

/** Normalize arbitrary fields into the DB's sync-safe names. */
export function normalizeNotionRecord(dbKey, input) {
  const spec = NOTION_OS_DBS[dbKey];
  if (!spec) return null;
  const out = {};

  for (const prop of spec.properties) {
    const found = Object.keys(input).find((k) => canonicalKey(k) === canonicalKey(prop.name));
    const raw = found !== undefined ? input[found] : undefined;
    if (raw === undefined || raw === null || (typeof raw === "string" && !raw.trim())) continue;

    switch (prop.type) {
      case "title":
      case "rich_text":
        out[prop.name] = capText(raw, prop.maxChars ?? 2000);
        break;
      case "email":
        out[prop.name] = capText(raw, 320).toLowerCase();
        break;
      case "url":
        out[prop.name] = capText(raw, 2000);
        break;
      case "select": {
        const text = capText(raw, 100);
        const synonyms = prop.name === "Status" ? STATUS_SYNONYMS : {};
        out[prop.name] = synonyms[canonicalKey(text)] || text;
        break;
      }
      case "multi_select": {
        const list = Array.isArray(raw) ? raw : String(raw).split(",");
        out[prop.name] = list.map((v) => capText(v, 100)).filter(Boolean).slice(0, 50);
        break;
      }
      case "number": {
        const num = Number(raw);
        if (Number.isFinite(num)) out[prop.name] = num;
        break;
      }
      case "date": {
        const synonym = DATE_SYNONYMS[canonicalKey(capText(raw, 40))];
        if (synonym) { out[prop.name] = synonym; break; }
        const parsed = new Date(raw);
        out[prop.name] = Number.isNaN(parsed.getTime()) ? capText(raw, 60) : parsed.toISOString();
        break;
      }
    }
  }

  if (!out.Name) {
    const fallback = input.email || input.url || input.source || input.id;
    if (fallback) out.Name = capText(fallback, 2000);
  }
  return out;
}

/** Missing required props → invalid (mirrors the backend architect). */
export function validateNotionRecord(dbKey, record) {
  const spec = NOTION_OS_DBS[dbKey];
  if (!spec) return { valid: false, error: `Unknown architect DB key: ${dbKey}`, missing: [] };
  const missing = spec.properties
    .filter((p) => p.required)
    .filter((p) => {
      const v = record[p.name];
      return v === undefined || v === null || (typeof v === "string" && !v.trim());
    })
    .map((p) => p.name);
  if (missing.length > 0) {
    return { valid: false, error: `${spec.label}: missing required ${missing.join(", ")}`, missing };
  }
  return { valid: true, error: null, missing: [] };
}

/** Notion page → view-friendly row (title/text/select/url/number/date). */
export function mapNotionPageToView(dbKey, page) {
  const props = (page && page.properties) || {};
  const readTitle = (n) => {
    const list = props[n]?.title || [];
    return Array.isArray(list) && list[0]?.plain_text ? String(list[0].plain_text).trim() : "";
  };
  const readText = (n) => {
    const list = props[n]?.rich_text || [];
    return Array.isArray(list) && list[0]?.plain_text ? String(list[0].plain_text).trim() : "";
  };
  const readSelect = (n) => (props[n]?.select?.name ? String(props[n].select.name).trim() : "");
  const readUrl = (n) => (props[n]?.url ? String(props[n].url).trim() : "");
  const readNumber = (n) => (typeof props[n]?.number === "number" ? props[n].number : null);
  const readDate = (n) => (props[n]?.date?.start ? String(props[n].date.start).trim() : null);

  const base = {
    id: page.id,
    name: readTitle("Name"),
    status: readSelect("Status"),
    niche: readText("Niche"),
    url: readUrl("URL"),
    created: readDate("Created"),
  };

  switch (dbKey) {
    case "money":
      return { ...base, month: readDate("Month"), revenue: readNumber("Revenue"), expenses: readNumber("Expenses"), net: readNumber("Net") };
    case "monthly":
      return { ...base, period: readDate("Period"), wins: readText("Wins"), risks: readText("Risks"), nextActions: readText("NextActions") };
    case "reputation":
      return { ...base, signal: readSelect("Signal"), score: readNumber("Score") };
    case "content":
      return { ...base, contentType: readSelect("ContentType") };
    case "templates":
      return { ...base, format: readSelect("Format") };
    case "assets":
      return { ...base, assetValue: readNumber("AssetValue") };
    case "ideas":
      return { ...base, source: readText("Source") };
    case "automations":
      return { ...base, source: readText("Source"), email: props.Email?.email || "", superpower: readText("Superpower") };
    default:
      return base;
  }
}

export default {
  NOTION_OS_DBS,
  getNotionPropType,
  getNotionDedupTuple,
  normalizeNotionRecord,
  validateNotionRecord,
  mapNotionPageToView,
};