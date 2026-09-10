// Notion integration data access for the DigitallyDefined dashboard.
// Reads Notion databases (ideas, content, automations, buyer signals, AI drafts)
// via the Hermes /sync endpoint which already aggregates them.
import { getSupabaseEdgeUrl, getSupabaseEdgeHeaders } from "./supabase-edge";

const notionConfig = {
  ideasDbId: import.meta.env.VITE_NOTION_IDEAS_DB_ID || "",
  contentDbId: import.meta.env.VITE_NOTION_CONTENT_DB_ID || "",
  automationsDbId: import.meta.env.VITE_NOTION_AUTOMATIONS_DB_ID || "",
  publishingQueueDbId: import.meta.env.VITE_NOTION_PUBLISHING_QUEUE_DB_ID || "",
  approvalsDbId: import.meta.env.VITE_NOTION_CONTENT_APPROVALS_DB_ID || "",
  buyerSignalsDbId: import.meta.env.VITE_NOTION_BUYER_SIGNALS_DB_ID || "",
  aiDraftsDbId: import.meta.env.VITE_NOTION_AI_CONTENT_DRAFTS_DB_ID || "",
};

// ---- Fetch Notion data from the synchronized dashboard payload ----
// The Hermes sync endpoint already aggregates all Notion databases.
// We re-use it so the dashboard stays single-source-of-truth with the backend.
export async function fetchNotionData() {
  const API_URL = getSupabaseEdgeUrl();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getSupabaseEdgeHeaders(),
      body: JSON.stringify({
        action: "dashboard",
        context: { includeNotion: true },
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Notion sync failed: ${res.status}`);
    }
    const payload = await res.json();

    // The sync response nests notion data under payload.notion
    const notion = payload?.notion || {};

    return {
      ideas: notion.ideas || [],
      content: notion.content || [],
      automations: notion.automations || [],
      intakeAlerts: notion.intakeAlerts || [],
      publishingQueue: notion.publishingQueue || [],
      approvals: notion.approvals || [],
      buyerSignals: notion.buyerSignals || [],
      aiDrafts: notion.aiDrafts || [],
      ideasAlerts: notion.ideasAlerts || [],
      rawNotion: notion,
    };
  } catch (error) {
    console.error("[Notion] fetchNotionData error:", error);
    return {
      ideas: [],
      content: [],
      automations: [],
      intakeAlerts: [],
      publishingQueue: [],
      approvals: [],
      buyerSignals: [],
      aiDrafts: [],
      ideasAlerts: [],
      rawNotion: {},
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ---- Create a Notion page via the Hermes edge action ----
export async function createNotionPage(params) {
  const API_URL = getSupabaseEdgeUrl();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getSupabaseEdgeHeaders(),
      body: JSON.stringify({
        action: "notion.page.create",
        database_id: params.databaseId,
        title: params.title,
        status: params.status,
        content: params.content,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Notion page create failed: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("[Notion] createNotionPage error:", error);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// ---- Report an intake item (quiz result, buyer signal, idea) to Notion ----
export async function reportIntakeItem(params) {
  const API_URL = getSupabaseEdgeUrl();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getSupabaseEdgeHeaders(),
      body: JSON.stringify({
        action: "notion.intake.report",
        intake_db_id: params.intakeDbId,
        title: params.title,
        source: params.source,
        status: params.status,
        score: params.score,
        route: params.route,
        customerEmail: params.customerEmail,
        productSlug: params.productSlug,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Notion intake report failed: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("[Notion] reportIntakeItem error:", error);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// ---- Log an automation execution to Notion ----
export async function logAutomationExecution(params) {
  const API_URL = getSupabaseEdgeUrl();
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getSupabaseEdgeHeaders(),
      body: JSON.stringify({
        action: "automation.log",
        log_db_id: params.logDbId,
        name: params.name,
        action: params.actionName,
        status: params.status,
        source: params.source,
        description: params.description,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Automation log failed: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("[Notion] logAutomationExecution error:", error);
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export default {
  fetchNotionData,
  createNotionPage,
  reportIntakeItem,
  logAutomationExecution,
};