import React, { useState, useEffect } from "react";
import {
  Bot,
  Play,
  ChevronDown,
  ChevronRight,
  Loader2,
  Zap,
} from "lucide-react";
import {
  brutalBorder,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";
import { postAction as ddPost } from "../lib/api-client";

const cardStyle = {
  border: brutalBorder,
  backgroundColor: theme.colors.card,
  padding: "1rem",
};

function formatResult(data) {
  if (!data) return null;
  const lines = [];
  const push = (label, val) => {
    if (val && (Array.isArray(val) ? val.length : Object.keys(val).length)) lines.push({ label, val });
  };
  push("Opportunity Gaps", data.opportunityGaps);
  push("Quick Wins", data.quickWins);
  push("Long-Term Bets", data.longTermBets);
  push("Recommended Products", data.recommendedProducts);
  push("Strengths", data.strengths);
  push("Recommendations", data.recommendations);
  push("Trends", data.trends);
  push("Roadmap Steps", data.roadmap && data.roadmap.steps);
  push("Market Size", data.marketSize ? [data.marketSize] : null);
  if (data.confidenceScore != null) lines.push({ label: "Confidence", val: [String(data.confidenceScore) + " / 100"] });
  if (data.superpower) lines.push({ label: "Your Superpower", val: [data.superpower] });
  if (data.roadmap && data.roadmap.estimatedTime) lines.push({ label: "Estimated Time", val: [data.roadmap.estimatedTime] });
  if (!lines.length) {
    const flat = {};
    Object.keys(data).forEach((k) => {
      if (["provider", "model", "timestamp", "mode", "niche", "error"].includes(k)) return;
      const v = data[k];
      if (Array.isArray(v) && v.length) flat[k] = v;
      else if (typeof v === "string" && v.trim()) flat[k] = [v];
    });
    Object.entries(flat).forEach(([label, val]) => lines.push({ label, val }));
  }
  return lines;
}

export default function AgentHub() {
  const [hub, setHub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [inputs, setInputs] = useState({});
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [orchOpen, setOrchOpen] = useState(false);
  const [orchGoal, setOrchGoal] = useState("");
  const [orchRunning, setOrchRunning] = useState(false);
  const [orchResult, setOrchResult] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    ddPost("agents.list", {})
      .then((res) => setHub(res && res.success ? res : null))
      .catch(() => setHub(null))
      .finally(() => setLoading(false));
  }, []);

  const openAgent = (name) => {
    setSelected(name);
    setResult(null);
    setInputs({});
  };


  const runAgent = async () => {
    if (!selected) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await ddPost("agents.run", { agent: selected, params: inputs });
      setResult(res && res.success ? res : { error: (res && res.error) || "Agent run failed" });
      setRecent((r) => [{ agent: selected, ok: !!(res && res.success), at: Date.now() }, ...r].slice(0, 5));
    } catch (err) {
      setResult({ error: err.message });
      setRecent((r) => [{ agent: selected, ok: false, at: Date.now() }, ...r].slice(0, 5));
    } finally {
      setRunning(false);
    }
  };

  const runOrchestrate = async () => {
    if (!orchGoal.trim()) return;
    setOrchRunning(true);
    setOrchResult(null);
    try {
      const res = await ddPost("agents.orchestrate", { goal: orchGoal });
      setOrchResult(res && res.success ? res : { error: (res && res.error) || "Orchestration failed" });
    } catch (err) {
      setOrchResult({ error: err.message });
    } finally {
      setOrchRunning(false);
    }
  };

  const findAgent = (name) => {
    if (!hub) return null;
    for (const c of hub.categories || []) {
      for (const a of c.agents || []) if (a.name === name) return a;
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "0.5rem", color: theme.colors.muted }}>
        <Loader2 size={16} className="spin" /> Loading your agent team...
      </div>
    );
  }

  if (!hub) {
    return (
      <div style={{ ...cardStyle, color: theme.colors.darkRed, fontSize: "0.85rem" }}>
        Agent Hub is unavailable right now. The data you have is safe — try again in a moment.
      </div>
    );
  }

  const sel = selected ? findAgent(selected) : null;

  return (
    <div style={{ display: "grid", gap: "1.1rem" }}>
      {/* HEADER */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
          backgroundColor: "#111111",
          color: "#FFFFFF",
        }}
      >
        <div>
          <span style={{ ...brutalEyebrow, color: "#F18B25", fontSize: "0.68rem" }}>
            Specialist AI Team
          </span>
          <h2 style={{ ...brutalHeading, fontSize: "1.4rem", color: "#FFFFFF", margin: "0.25rem 0 0" }}>
            AGENT HUB
          </h2>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#BFBFBF" }}>
            Open any agent directly. No chat required.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span style={{ ...brutalEyebrow, fontSize: "0.7rem", color: "#FFFFFF", border: "1px solid #444", padding: "4px 8px" }}>
            {hub.launchableAgents ? hub.launchableAgents.length : 0} agents live
          </span>
        </div>
      </div>
      {/* CATEGORY GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {(hub.categories || []).map((cat) => {
          const liveCount = (cat.agents || []).filter((a) => a.launchable).length;
          return (
            <div key={cat.key} style={{ ...cardStyle, borderLeft: "5px solid " + cat.color }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase", color: cat.color }}>{cat.label}</div>
              <div style={{ fontSize: "0.72rem", color: theme.colors.muted, margin: "0.2rem 0 0.6rem" }}>{cat.tagline}</div>
              <div style={{ display: "grid", gap: "0.4rem" }}>
                {(cat.agents || []).map((agent) => (
                  <button
                    key={agent.name}
                    type="button"
                    onClick={() => agent.launchable && openAgent(agent.name)}
                    disabled={!agent.launchable}
                    style={{ border: brutalBorder, backgroundColor: selected === agent.name ? "#FFFCF9" : "#FFFFFF", padding: "0.5rem 0.6rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 800, cursor: agent.launchable ? "pointer" : "not-allowed", opacity: agent.launchable ? 1 : 0.55, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span>{agent.displayName}</span>
                    <span style={{ ...brutalEyebrow, fontSize: "0.56rem", color: agent.launchable ? cat.color : "#999" }}>{agent.launchable ? "OPEN" : "SOON"}</span>
                  </button>
                ))}
                {liveCount === 0 && <div style={{ fontSize: "0.7rem", color: theme.colors.muted, fontStyle: "italic" }}>Coming in Phase B.</div>}
              </div>
            </div>
          );
        })}
      </div>
      {/* SELECTED AGENT LAUNCH PANEL */}
      {sel && (
        <div style={{ ...cardStyle, borderTop: "4px solid " + theme.colorsorange || theme.colors.orange }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.7rem" }}>
            <div>
              <h3 style={{ ...brutalHeading, fontSize: "1.05rem", margin: 0 }}>{sel.displayName}</h3>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.8rem", color: theme.colors.muted }}>{sel.description}</p>
            </div>
            <Bot size={20} color={theme.colors.orange} />
          </div>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {((sel.input && sel.input.fields) || []).map((field) => (
              <div key={field.name}>
                <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{field.label} {field.required ? "*" : ""}</label>
                {field.type === "select" ? (
                  <select value={inputs[field.name] || ""} onChange={(e) => setInputs((s) => ({ ...s, [field.name]: e.target.value }))} style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", fontWeight: 600 }}>
                    <option value="">Select...</option>
                    {(field.options || []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type="text" value={inputs[field.name] || ""} onChange={(e) => setInputs((s) => ({ ...s, [field.name]: e.target.value }))} placeholder={field.type === "json" ? "{ ... }" : field.label} style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", fontWeight: 600 }} />
                )}
              </div>
            ))}
            <button type="button" onClick={runAgent} disabled={running} style={{ border: brutalBorder, backgroundColor: "#F18B25", color: "#111", fontWeight: 900, textTransform: "uppercase", padding: "0.7rem 1rem", cursor: running ? "wait" : "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", alignSelf: "flex-start" }}>
              {running ? <Loader2 size={15} className="spin" /> : <Play size={15} />}
              {running ? "Running..." : "Run Agent"}
            </button>
          </div>
          {result && (
            <div style={{ marginTop: "0.9rem", borderTop: brutalBorder, paddingTop: "0.9rem" }}>
              {result.error ? (
                <div style={{ ...cardStyle, backgroundColor: "#FEF2F2", color: theme.colors.darkRed, fontSize: "0.85rem", fontWeight: 700 }}>{result.error}</div>
              ) : (
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  <h4 style={{ ...brutalHeading, fontSize: "0.9rem", marginBottom: "0.4rem", color: theme.colors.orange }}>Agent Output</h4>
                  {(formatResult(result.data) || []).map((line, i) => (
                    <div key={i}>
                      <div style={{ ...brutalEyebrow, fontSize: "0.62rem", color: theme.colors.muted }}>{line.label}</div>
                      {Array.isArray(line.val) ? (
                        <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1rem", fontSize: "0.82rem" }}>
                          {line.val.map((v, j) => <li key={j} style={{ marginBottom: "0.2rem" }}>{typeof v === "object" ? (v.name ? v.name + (v.priceRange ? " (" + v.priceRange + ")" : "") : JSON.stringify(v)) : v}</li>)}
                        </ul>
                      ) : <div style={{ fontSize: "0.82rem", marginTop: "0.2rem" }}>{line.val}</div>}
                    </div>
                  ))}
                  {((result.data && Object.keys(result.data).length) || 0) > 0 && (formatResult(result.data) || []).length === 0 && <pre style={{ fontSize: "0.75rem", background: "#FFFCF9", border: brutalBorder, padding: "0.6rem", overflow: "auto" }}>{JSON.stringify(result.data, null, 2)}</pre>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* AI BUSINESS PARTNER — ORCHESTRATOR RAIL */}
      <div style={{ ...cardStyle, backgroundColor: "#111111", color: "#FFFFFF" }}>
        <button type="button" onClick={() => setOrchOpen((o) => !o)} style={{ border: "none", background: "transparent", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Zap size={16} color="#F18B25" />
            <span style={{ ...brutalHeading, fontSize: "1.05rem", color: "#FFFFFF" }}>AI BUSINESS PARTNER — ORCHESTRATOR</span>
          </div>
          {orchOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {orchOpen && (
          <div style={{ marginTop: "0.8rem", display: "grid", gap: "0.7rem" }}>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#BFBFBF" }}>Describe a goal. The orchestrator routes it across the specialist agents and returns an action plan — no chat thread.</p>
            <input type="text" value={orchGoal} onChange={(e) => setOrchGoal(e.target.value)} placeholder="e.g. I want to generate $2,000/month from digital assets" style={{ ...cardStyle, backgroundColor: "#FFFFFF", color: "#111", fontWeight: 600 }} />
            <button type="button" onClick={runOrchestrate} disabled={orchRunning} style={{ border: brutalBorder, backgroundColor: "#F18B25", color: "#111", fontWeight: 900, textTransform: "uppercase", padding: "0.6rem 1rem", cursor: orchRunning ? "wait" : "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem", alignSelf: "flex-start" }}>
              {orchRunning ? <Loader2 size={14} className="spin" /> : <Play size={14} />}
              {orchRunning ? "Orchestrating..." : "Run Orchestrator"}
            </button>
            {orchResult && (
              <div style={{ border: "1px solid #333", padding: "0.8rem" }}>
                {orchResult.error ? <div style={{ color: "#F87171", fontSize: "0.85rem", fontWeight: 700 }}>{orchResult.error}</div> : (
                  <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.85rem" }}>
                    <div><span style={{ ...brutalEyebrow, fontSize: "0.62rem", color: "#F18B25" }}>Routed to:</span> <strong style={{ color: "#FFFFFF" }}>{orchResult.classification || "—"}</strong></div>
                    {orchResult.plan && orchResult.plan.reply ? <p style={{ margin: 0, color: "#E5E5E5", lineHeight: 1.5 }}>{orchResult.plan.reply}</p> : orchResult.plan ? <pre style={{ fontSize: "0.72rem", color: "#E5E5E5", overflow: "auto" }}>{JSON.stringify(orchResult.plan, null, 2)}</pre> : null}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}