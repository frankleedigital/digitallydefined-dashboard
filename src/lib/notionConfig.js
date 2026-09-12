// Notion database configuration for the DigitallyDefined dashboard.
// Each database is mapped to a Vite env var so the dashboard can pull live data.
// Keys are the backend Notion Architect DB keys (supabase/functions/_shared/notion-architect.ts),
// so dashboard views use the same normalized contract as the backend.

const notionConfig = {
  ideasDbId: import.meta.env.VITE_NOTION_IDEAS_DB_ID || "",
  contentDbId: import.meta.env.VITE_NOTION_CONTENT_DB_ID || "",
  automationsDbId: import.meta.env.VITE_NOTION_AUTOMATIONS_DB_ID || "",
  publishingQueueDbId: import.meta.env.VITE_NOTION_PUBLISHING_QUEUE_DB_ID || "",
  approvalsDbId: import.meta.env.VITE_NOTION_CONTENT_APPROVALS_DB_ID || "",
  buyerSignalsDbId: import.meta.env.VITE_NOTION_BUYER_SIGNALS_DB_ID || "",
  aiDraftsDbId: import.meta.env.VITE_NOTION_AI_CONTENT_DRAFTS_DB_ID || "",

  // 8 core Notion OS databases (Phase 5 restoration)
  assetsDbId: import.meta.env.VITE_NOTION_ASSETS_DB_ID || "",
  moneyDbId: import.meta.env.VITE_NOTION_MONEY_DB_ID || "",
  monthlyDbId: import.meta.env.VITE_NOTION_MONTHLY_DB_ID || "",
  reputationDbId: import.meta.env.VITE_NOTION_REPUTATION_DB_ID || "",
  templatesDbId: import.meta.env.VITE_NOTION_TEMPLATES_DB_ID || "",
};

export default notionConfig;