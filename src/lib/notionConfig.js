// Notion database configuration for the DigitallyDefined dashboard.
// Each database is mapped to a Vite env var so the dashboard can pull live data.

const notionConfig = {
  ideasDbId: import.meta.env.VITE_NOTION_IDEAS_DB_ID || "",
  contentDbId: import.meta.env.VITE_NOTION_CONTENT_DB_ID || "",
  automationsDbId: import.meta.env.VITE_NOTION_AUTOMATIONS_DB_ID || "",
  publishingQueueDbId: import.meta.env.VITE_NOTION_PUBLISHING_QUEUE_DB_ID || "",
  approvalsDbId: import.meta.env.VITE_NOTION_CONTENT_APPROVALS_DB_ID || "",
  buyerSignalsDbId: import.meta.env.VITE_NOTION_BUYER_SIGNALS_DB_ID || "",
  aiDraftsDbId: import.meta.env.VITE_NOTION_AI_CONTENT_DRAFTS_DB_ID || "",
};

export default notionConfig;