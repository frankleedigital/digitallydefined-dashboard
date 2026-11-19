import React, { useState } from "react";
import { TrendingUp, Target, Shield, Loader2, Play } from "lucide-react";
import { brutalBorder, brutalEyebrow, brutalHeading, theme } from "../theme";
import { postAction as ddPost } from "../lib/api-client";

const cardStyle = { border: brutalBorder, backgroundColor: theme.colors.card, padding: "1rem" };

const PILLAR_INFO = {
  plan: { label: "PLAN", icon: Target, color: "#F18B25", desc: "Freedom number, retirement gap, asset strategy" },
  protect: { label: "PROTECT", icon: Shield, color: "#47B7D4", desc: "Estate documents, caregiving plan, scam defense" },
  operate: { label: "OPERATE", icon: TrendingUp, color: "#16A34A", desc: "Automations, digital infrastructure, daily ops" },
};

export default function WealthCenter({ onOpenAgentHub }) {
  const [gapInputs, setGapInputs] = useState({ currentIncome: "5000", targetRetirementIncome: "8000", currentAssets: "75000", monthlySavings: "1000" });
  const [gapResult, setGapResult] = useState(null);
  const [gapLoading, setGapLoading] = useState(false);
  const [wealthInputs, setWealthInputs] = useState({ netWorth: "150000", monthlyIncome: "5000", monthlyExpense: "4200", digitalAssetValue: "5000", digitalMRR: "200" });
  const [wealthResult, setWealthResult] = useState(null);
  const [wealthLoading, setWealthLoading] = useState(false);

  const runGap = async () => {
    setGapLoading(true); setGapResult(null);
    try {
      const res = await ddPost("agents.run", { agent: "retirementGap", params: gapInputs });
      setGapResult(res && res.success ? res.data : { error: (res && res.error) || "Agent failed" });
    } catch (e) { setGapResult({ error: e.message }); }
    finally { setGapLoading(false); }
  };

  const runWealth = async () => {
    setWealthLoading(true); setWealthResult(null);
    try {
      const res = await ddPost("agents.run", { agent: "wealthCalculator", params: wealthInputs });
      setWealthResult(res && res.success ? res.data : { error: (res && res.error) || "Agent failed" });
    } catch (e) { setWealthResult({ error: e.message }); }
    finally { setWealthLoading(false); }
  };

  const fmt = (n) => typeof n === "number" ? "$" + n.toLocaleString() : n;

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      {/* HEADER */}
      <div style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", backgroundColor: "#111111", color: "#FFFFFF" }}>
        <div>
          <span style={{ ...brutalEyebrow, color: "#8B1A0A", fontSize: "0.68rem" }}>Financial Resilience & Legacy — Pillar 5</span>
          <h2 style={{ ...brutalHeading, fontSize: "1.4rem", color: "#FFFFFF", margin: "0.25rem 0 0" }}>WEALTH CENTER</h2>
          <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#BFBFBF" }}>The retirement gap is the WHY. These agents measure how close you are.</p>
        </div>
        {onOpenAgentHub && <button type="button" onClick={onOpenAgentHub} style={{ border: "2px solid #8B1A0A", backgroundColor: "#8B1A0A", color: "#FFFFFF", fontWeight: 900, textTransform: "uppercase", fontSize: "0.78rem", padding: "0.6rem 1rem", cursor: "pointer" }}>Open Agent Hub</button>}
      </div>

      {/* LEGACY OS PILLARS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {Object.entries(PILLAR_INFO).map(([key, p]) => {
          const Icon = p.icon;
          return (
            <div key={key} style={{ ...cardStyle, borderTop: "5px solid " + p.color }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <Icon size={18} color={p.color} />
                <span style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase" }}>{p.label}</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: theme.colors.muted }}>{p.desc}</div>
            </div>
          );
        })}
      </div>

      {/* RETIREMENT GAP CALCULATOR */}
      <div style={cardStyle}>
        <h3 style={{ ...brutalHeading, fontSize: "1.05rem", marginBottom: "0.7rem" }}>RETIREMENT GAP AGENT</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem" }}>
          {Object.entries(gapInputs).map(([k, v]) => (
            <div key={k}>
              <label style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase" }}>{k.replace(/([A-Z])/g, " $1")}</label>
              <input type="text" value={v} onChange={(e) => setGapInputs((s) => ({ ...s, [k]: e.target.value }))} style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.2rem", fontWeight: 600, width: "100%", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
        <button type="button" onClick={runGap} disabled={gapLoading} style={{ border: brutalBorder, backgroundColor: "#F18B25", color: "#111", fontWeight: 900, textTransform: "uppercase", padding: "0.6rem 1rem", cursor: gapLoading ? "wait" : "pointer", marginTop: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          {gapLoading ? <Loader2 size={14} className="spin" /> : <Play size={14} />}
          {gapLoading ? "Calculating..." : "Calculate Gap"}
        </button>
        {gapResult && !gapResult.error && (
          <div style={{ marginTop: "0.9rem", borderTop: brutalBorder, paddingTop: "0.9rem", display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>Monthly Gap</div><div style={{ fontSize: "1.6rem", fontWeight: 900 }}>{fmt(gapResult.monthlyGap)}</div></div>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>Annual Gap</div><div style={{ fontSize: "1.6rem", fontWeight: 900 }}>{fmt(gapResult.annualGap)}</div></div>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>Target Nest Egg</div><div style={{ fontSize: "1.6rem", fontWeight: 900 }}>{fmt(gapResult.targetNestEgg)}</div></div>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>Years to Close</div><div style={{ fontSize: "1.6rem", fontWeight: 900 }}>{gapResult.yearsToClose}</div></div>
            </div>
            {gapResult.narrative && <p style={{ fontSize: "0.85rem", lineHeight: 1.5, margin: "0.5rem 0 0" }}>{gapResult.narrative}</p>}
            {gapResult.strategicActions && <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", fontSize: "0.82rem" }}>{gapResult.strategicActions.map((a, i) => <li key={i} style={{ marginBottom: "0.2rem" }}>{a}</li>)}</ul>}
          </div>
        )}
        {gapResult && gapResult.error && <div style={{ ...cardStyle, backgroundColor: "#FEF2F2", color: theme.colors.darkRed, fontSize: "0.85rem", fontWeight: 700, marginTop: "0.7rem" }}>{gapResult.error}</div>}
      </div>

      {/* WEALTH TRAJECTORY */}
      <div style={cardStyle}>
        <h3 style={{ ...brutalHeading, fontSize: "1.05rem", marginBottom: "0.7rem" }}>WEALTH TRAJECTORY AGENT</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.6rem" }}>
          {Object.entries(wealthInputs).map(([k, v]) => (
            <div key={k}>
              <label style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase" }}>{k.replace(/([A-Z])/g, " $1")}</label>
              <input type="text" value={v} onChange={(e) => setWealthInputs((s) => ({ ...s, [k]: e.target.value }))} style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.2rem", fontWeight: 600, width: "100%", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>
        <button type="button" onClick={runWealth} disabled={wealthLoading} style={{ border: brutalBorder, backgroundColor: "#47B7D4", color: "#111", fontWeight: 900, textTransform: "uppercase", padding: "0.6rem 1rem", cursor: wealthLoading ? "wait" : "pointer", marginTop: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          {wealthLoading ? <Loader2 size={14} className="spin" /> : <Play size={14} />}
          {wealthLoading ? "Projecting..." : "Project Wealth"}
        </button>
        {wealthResult && !wealthResult.error && (
          <div style={{ marginTop: "0.9rem", borderTop: brutalBorder, paddingTop: "0.9rem", display: "grid", gap: "0.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem" }}>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>Now</div><div style={{ fontSize: "1.4rem", fontWeight: 900 }}>{fmt(wealthResult.currentNetWorth)}</div></div>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>12 Months</div><div style={{ fontSize: "1.4rem", fontWeight: 900 }}>{fmt(wealthResult.projection12mo)}</div></div>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>24 Months</div><div style={{ fontSize: "1.4rem", fontWeight: 900 }}>{fmt(wealthResult.projection24mo)}</div></div>
              <div style={cardStyle}><div style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>36 Months</div><div style={{ fontSize: "1.4rem", fontWeight: 900 }}>{fmt(wealthResult.projection36mo)}</div></div>
            </div>
            {wealthResult.narrative && <p style={{ fontSize: "0.85rem", lineHeight: 1.5, margin: "0.5rem 0 0" }}>{wealthResult.narrative}</p>}
            {wealthResult.accelerators && <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", fontSize: "0.82rem" }}>{wealthResult.accelerators.map((a, i) => <li key={i} style={{ marginBottom: "0.2rem" }}>{a}</li>)}</ul>}
          </div>
        )}
        {wealthResult && wealthResult.error && <div style={{ ...cardStyle, backgroundColor: "#FEF2F2", color: theme.colors.darkRed, fontSize: "0.85rem", fontWeight: 700, marginTop: "0.7rem" }}>{wealthResult.error}</div>}
      </div>
    </div>
  );
}
