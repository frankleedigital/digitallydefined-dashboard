import React, { useState } from "react";
import { Database, FileText, LayoutTemplate, Play, Loader2, X } from "lucide-react";
import { brutalBorder, brutalEyebrow, brutalHeading, theme } from "../theme";
import { callSupabaseEdge } from "../lib/supabase-edge";

const cardStyle = {
  border: brutalBorder,
  backgroundColor: theme.colors.colors?.card || "#ffffff",
  padding: "1rem",
};

const tools = [
  { id: "createNotionPage", label: "Create Notion Page", icon: FileText, description: "Create a new page in a Notion database." },
  { id: "updateDatabase", label: "Update Database", icon: Database, description: "Update an existing Notion database schema." },
  { id: "buildTemplate", label: "Build Template", icon: LayoutTemplate, description: "Build a new Notion database template." },
  { id: "runAutomation", label: "Run Automation", icon: Play, description: "Run a Notion automation." },
];

export default function AntigravityPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});

  const runTool = async (toolId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await callSupabaseEdge(`antigravity.${toolId}`, params);
      setResult(res);
    } catch (err) {
      setError(err.message || "Antigravity request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <h2 style={{ ...brutalHeading, margin: 0 }}>ANTIGRAVITY NOTION ARCHITECT</h2>
      <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.9rem" }}>
        Build and manage your Notion workspace. Create pages, update databases, build templates, and run automations.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => runTool(tool.id)}
              disabled={loading}
              style={{
                ...cardStyle,
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
            </button>
          );
        })}
      </div>

      <div style={cardStyle}>
        <label style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
          <span>Params (JSON)</span>
          <textarea
            value={JSON.stringify(params, null, 2)}
            onChange={(e) => {
              try { setParams(JSON.parse(e.target.value)); } catch {}
            }}
            rows={6}
            style={{ border: brutalBorder, padding: "0.5rem", fontFamily: "monospace", fontSize: "0.8rem" }}
          />
        </label>
      </div>

      {loading && (
        <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Loader2 size={16} className="spin" /> Running...
        </div>
      )}

      {error && (
        <div style={{ ...cardStyle, color: theme.colors.darkRed }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <pre style={{ ...cardStyle, overflow: "auto", fontSize: "0.8rem", maxHeight: "400px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}