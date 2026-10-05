import React, { useEffect, useState } from "react";
import {
  Activity, AlertTriangle, Database, Eye, FileText, LayoutTemplate,
  Loader2, Play, Plus, RefreshCw, Search, Wrench,
} from "lucide-react";
import { brutalBorder, brutalHeading, theme } from "../theme";
import { callSupabaseEdge } from "../lib/supabase-edge";

const cardStyle = {
  border: brutalBorder,
  backgroundColor: theme.colors.colors?.card || "#ffffff",
  padding: "1rem",
};

const sectionTitleStyle = {
  margin: "0.5rem 0 0",
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: theme.colors.muted,
};

/**
 * The 8 core Notion OS databases. Mirrors NOTION_OS_DBS in
 * digitallydefined-backend-clean/src/services/antigravity.js — keep in sync.
 */
const NOTION_DB_KEYS = [
  { key: "assets", label: "Digital Assets" },
  { key: "ideas", label: "Ideas & Intake" },
  { key: "money", label: "Money Snapshot" },
  { key: "monthly", label: "Monthly Review" },
  { key: "reputation", label: "Reputation Signals" },
  { key: "content", label: "Content Blocks" },
  { key: "automations", label: "Automations Log" },
  { key: "templates", label: "Templates Library" },
];
/**
 * Every action the backend dispatch switch accepts, with the param shape its
 * handler destructures. `write: true` actions mutate Notion, so they require an
 * explicit confirm before firing.
 */
const TOOLS = [
  // ── READ / DIAGNOSE (never writes) ────────────────────────────────────────
  { id: "status", label: "Architect Status", icon: Activity, group: "diagnose",
    description: "Config, live-mode flags, and how many Notion DBs are wired.",
    defaultParams: {} },
  { id: "reconcileDatabase", label: "Reconcile Schema", icon: RefreshCw, group: "diagnose",
    description: "Diff a live database against the architect contract. Safe preview.",
    defaultParams: { dbKey: "ideas", diffOnly: true, verbose: true } },
  { id: "queryDatabase", label: "Query Database", icon: Search, group: "diagnose",
    description: "Read rows back from a Notion database.",
    defaultParams: { limit: 20 } },
  { id: "getPage", label: "Get Page", icon: Eye, group: "diagnose",
    description: "Fetch a single Notion page by ID.",
    defaultParams: { pageId: "" } },

  // ── WRITE (mutates Notion) ────────────────────────────────────────────────
  { id: "createNotionPage", label: "Create Notion Page", icon: FileText, group: "write", write: true,
    description: "Create a new page in a Notion database.",
    defaultParams: { databaseId: "", title: "" } },
  { id: "updateDatabase", label: "Update Database", icon: Database, group: "write", write: true,
    description: "Update an existing Notion database schema.",
    defaultParams: { databaseId: "", properties: {} } },
  { id: "patch", label: "Patch Properties", icon: Wrench, group: "write", write: true,
    description: "Add individual properties without a full schema rewrite.",
    defaultParams: { databaseId: "", properties: {} } },
  { id: "buildTemplate", label: "Build Template", icon: LayoutTemplate, group: "write", write: true,
    description: "Build a new Notion database template.",
    defaultParams: { name: "" } },
  { id: "runAutomation", label: "Run Automation", icon: Play, group: "write", write: true,
    description: "Run a Notion automation.",
    defaultParams: { name: "", databaseId: "" } },
  { id: "phase21.rollout", label: "Phase 21 Rollout", icon: Plus, group: "write", write: true,
    description: "Create or update ALL 8 Notion OS databases in one pass.",
    defaultParams: {} },
];

const GROUPS = [
  { id: "diagnose", title: "Diagnose (read-only)" },
  { id: "write", title: "Write to Notion" },
];



/**
 * Shows whether the architect can actually write. Production currently returns
 * liveMode:false / 0 databases, which silently dry-runs every write — surfacing
 * that here means nobody clicks a tool and mistakes a no-op for success.
 */
function StatusBanner({ status, loading }) {
  if (loading && !status) {
    return (
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Loader2 size={16} className="spin" /> Checking architect status…
      </div>
    );
  }
  if (!status) return null;

  const cfg = status.config || {};
  const dbCount = status.databases?.configured ?? 0;
  const ready = !!(cfg.liveMode && cfg.approvalMode && (cfg.hasNotionToken || cfg.notionApiKeySet));
  const okTone = theme.colors.success || "#16a34a";
  const badTone = theme.colors.darkRed || "#8b1a0a";
  const tone = ready && dbCount > 0 ? okTone : badTone;

  return (
    <div
      style={{
        ...cardStyle,
        border: `2px solid ${tone}`,
        backgroundColor: ready && dbCount > 0 ? "#F0FDF4" : "#FFFAF5",
        display: "grid",
        gap: "0.35rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <AlertTriangle size={16} color={tone} />
        <strong style={{ fontSize: "0.9rem", color: tone }}>
          {ready && dbCount > 0 ? "Architect is live" : "Architect is not live"}
        </strong>
      </div>
      <div style={{ fontSize: "0.8rem", color: theme.colors.muted, display: "grid", gap: "0.2rem" }}>
        <span>
          Live mode: <strong>{cfg.liveMode ? "on" : "off"}</strong> · Phase 21 approval:{" "}
          <strong>{cfg.approvalMode ? "on" : "off"}</strong> · Notion token:{" "}
          <strong>{cfg.hasNotionToken || cfg.notionApiKeySet ? "set" : "missing"}</strong>
        </span>
        <span>
          Notion databases wired: <strong>{dbCount} of 8</strong> · {status.dryRunNote || ""}
        </span>
        {!(ready && dbCount > 0) ? (
          <span style={{ color: tone }}>
            Writes will be skipped as dry-run until the Vercel env vars are set: NOTION_LIVE_MODE,
            NOTION_PHASE21_LIVE_APPROVAL, ANTIGRAVITY_API_KEY, ANTIGRAVITY_NOTION_TOKEN, and the
            NOTION_*_DB_ID database ids.
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function AntigravityPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [paramsText, setParamsText] = useState(JSON.stringify({}, null, 2));
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const paramsInvalid = (() => {
    try { JSON.parse(paramsText); return false; } catch { return true; }
  })();

  // Load architect status on mount so dry-run is visible before any write.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await callSupabaseEdge("antigravity.status", {});
        if (!cancelled) setStatus(res?.result || res || null);
      } catch (err) {
        if (!cancelled) console.error("[Antigravity] status check failed:", err);
      } finally {
        if (!cancelled) setStatusLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /** Select a tool: load its param shape into the editor, do not run it yet. */
  const applyParams = (tool) => {
    setActiveTool(tool.id);
    setParamsText(JSON.stringify(tool.defaultParams || {}, null, 2));
    setResult(null);
    setError(null);
  };

  const runTool = async (tool) => {
    if (tool.write) {
      const warn = tool.id === "phase21.rollout"
        ? "\n\nPhase 21 Rollout touches ALL 8 Notion OS databases."
        : "";
      if (!window.confirm(`Run "${tool.label}"?\n\nThis WRITES to your Notion workspace.${warn}`)) return;
    }

    setLoading(true);
    setActiveTool(tool.id);
    setError(null);
    setResult(null);
    try {
      const parsed = JSON.parse(paramsText);
      const res = await callSupabaseEdge(`antigravity.${tool.id}`, parsed);
      setResult(res);
      // Refresh status after a run — a write that silently dry-ran would
      // otherwise look like a success.
      if (tool.write || tool.id === "status") {
        try {
          const s = await callSupabaseEdge("antigravity.status", {});
          setStatus(s?.result || s || null);
        } catch { /* status refresh is best-effort */ }
      }
    } catch (err) {
      setError(err.message || "Antigravity request failed");
    } finally {
      setLoading(false);
    }
  };

  const runActive = () => {
    const tool = TOOLS.find((t) => t.id === activeTool);
    if (tool) runTool(tool);
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <h2 style={{ ...brutalHeading, margin: 0 }}>ANTIGRAVITY NOTION ARCHITECT</h2>
      <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.9rem" }}>
        Build and manage your Notion workspace across the 8 core Notion OS databases.
        Start with <strong>Architect Status</strong>, then <strong>Reconcile Schema</strong> to
        preview drift before anything writes.
      </p>

      <StatusBanner status={status} loading={statusLoading} />

      {GROUPS.map((group) => (
        <div key={group.id}>
          <p style={sectionTitleStyle}>{group.title}</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "1rem",
              marginTop: "0.5rem",
            }}
          >
            {TOOLS.filter((t) => t.group === group.id).map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => applyParams(tool)}
                  disabled={loading}
                  style={{
                    ...cardStyle,
                    border: isActive ? `2px solid ${theme.colors.accent}` : brutalBorder,
                    cursor: loading ? "progress" : "pointer",
                    textAlign: "left",
                    display: "grid",
                    gap: "0.5rem",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <Icon size={20} color={theme.colors.accent} />
                  <strong style={{ fontSize: "0.9rem" }}>{tool.label}</strong>
                  <span style={{ fontSize: "0.78rem", color: theme.colors.muted }}>{tool.description}</span>
                  {tool.write ? (
                    <span
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: theme.colors.darkRed,
                      }}
                    >
                      Writes to Notion
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div style={cardStyle}>
        <label style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
          <span>
            Params (JSON)
            {activeTool ? ` — for ${activeTool}` : " — select a tool to load its shape"}
          </span>
          <textarea
            value={paramsText}
            onChange={(e) => setParamsText(e.target.value)}
            rows={7}
            spellCheck={false}
            style={{
              border: `1px solid ${paramsInvalid ? (theme.colors.darkRed || "#8b1a0a") : "#111111"}`,
              padding: "0.5rem",
              fontFamily: "monospace",
              fontSize: "0.8rem",
            }}
          />
        </label>
        {paramsInvalid ? (
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.78rem", color: theme.colors.darkRed }}>
            Invalid JSON — fix it before running.
          </p>
        ) : null}
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", color: theme.colors.muted }}>
          Databases: {NOTION_DB_KEYS.map((d) => `${d.key} → ${d.label}`).join(" · ")}
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={runActive}
          disabled={!activeTool || loading || paramsInvalid}
          className="btn btn--primary"
          style={{ opacity: !activeTool || loading || paramsInvalid ? 0.6 : 1 }}
        >
          {loading ? "Running…" : "Run tool"}
        </button>
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => runTool(TOOLS[0])}
          disabled={loading}
        >
          Refresh status
        </button>
      </div>

      {loading && (
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Loader2 size={16} className="spin" /> Running…
        </div>
      )}

      {error && (
        <div style={{ ...cardStyle, color: theme.colors.darkRed }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <pre style={{ ...cardStyle, overflow: "auto", fontSize: "0.8rem", maxHeight: "400px", margin: 0 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}