// src/pages/BrandSupervisorTab.jsx — Brand Supervisor AI Dashboard Widget
// Purpose: Audit copy, landing pages, social posts, and product descriptions
// against DigitallyDefined Brand Guidelines (No-BS Big Bestie voice, Flat Soft Brutalism, 6 Pillars).

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Loader2,
  XCircle,
  FileText,
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

const VERDICT_COLORS = {
  APPROVED: { bg: "#2A9D5C", text: "#FFFFFF" },
  REVISE: { bg: "#F18B25", text: "#000000" },
  REJECT: { bg: "#C20F0A", text: "#FFFFFF" },
};

export default function BrandSupervisorTab() {
  const [content, setContent] = useState(
    "<div className=\"rounded-xl shadow-lg bg-blue-500 p-6 text-center\">\n  <h2 className=\"text-2xl font-sans text-white\">Learn how to grow your business today</h2>\n  <p className=\"text-gray-200 mt-2\">Click here to check out our helpful guide.</p>\n  <button className=\"rounded-full shadow bg-emerald-400 text-black px-6 py-2 mt-4\">Get Started</button>\n</div>"
  );
  const [contentType, setContentType] = useState("ui-component");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const runAudit = async (e) => {
    e?.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const res = await ddPost("agents.run", {
        agent: "brandSupervisor",
        params: { content, contentType },
      });
      if (res && res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res?.error || "Brand enforcement failed.");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.enforcedOutput) return;
    navigator.clipboard.writeText(result.enforcedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          <span style={{ ...brutalEyebrow, color: "#2A9D5C", fontSize: "0.68rem" }}>
            Active Brand Enforcement & Implementation Engine
          </span>
          <h2 style={{ ...brutalHeading, fontSize: "1.4rem", color: "#FFFFFF", margin: "0.25rem 0 0" }}>
            BRAND ENFORCEMENT AI
          </h2>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#BFBFBF" }}>
            Builder agent: automatically rewrites copy, refactors UI code to Flat Soft Brutalism tokens, and outputs production-ready assets.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span style={{ ...brutalEyebrow, fontSize: "0.7rem", color: "#FFFFFF", border: "1px solid #444", padding: "4px 8px" }}>
            Never Analyzes Without Fixing
          </span>
        </div>
      </div>

      {/* INPUT FORM */}
      <form onSubmit={runAudit} style={{ ...cardStyle, display: "grid", gap: "0.8rem", borderTop: "4px solid #2A9D5C" }}>
        <h3 style={{ ...brutalHeading, fontSize: "0.95rem", margin: 0 }}>Asset / Code Input to Enforce</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.8rem" }}>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Asset Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            >
              <option value="ui-component">UI Component / Code (HTML / React / CSS)</option>
              <option value="copy">Marketing Copy / Email</option>
              <option value="product">Product Description / Offer</option>
              <option value="landing-page">Landing Page Section</option>
              <option value="social">Social Media / Threads Post</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>
            Content / Markup / Spec to Enforce *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
            placeholder="Paste draft copy or UI code with rounded corners, drop shadows, or generic voice..."
            style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600, fontFamily: contentType === "ui-component" ? "monospace" : "inherit", fontSize: "0.85rem" }}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              border: brutalBorder,
              backgroundColor: "#2A9D5C",
              color: "#FFF",
              fontWeight: 900,
              textTransform: "uppercase",
              padding: "0.7rem 1.2rem",
              cursor: loading ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? <Loader2 size={16} className="spin" /> : <ShieldCheck size={16} />}
            {loading ? "Enforcing Brand Standards & Refactoring..." : "Enforce & Output Production Asset"}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ ...cardStyle, backgroundColor: theme.colors.dangerTint, color: theme.colors.darkRed, fontWeight: 700 }}>
          {error}
        </div>
      )}

      {/* RESULTS SECTION */}
      {result && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {/* TOP SCORE BANNER */}
          <div style={{ ...cardStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", backgroundColor: "#FFFCF9" }}>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Compliance Score</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: theme.colors.textPrimary }}>
                {result.complianceScore}
                <span style={{ fontSize: "0.9rem", color: theme.colors.muted }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Enforcement Status</div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: "0.2rem",
                  padding: "0.3rem 0.6rem",
                  backgroundColor: VERDICT_COLORS[result.verdict]?.bg || "#000",
                  color: VERDICT_COLORS[result.verdict]?.text || "#FFF",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  border: brutalBorder,
                }}
              >
                {result.verdict || "AUTO_ENFORCED"}
              </div>
            </div>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Pillar Alignment</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 800, marginTop: "0.3rem" }}>
                {result.pillarAlignment || "Digital Assets & Product Creation"}
              </div>
            </div>
          </div>

          {/* PRODUCTION-READY ENFORCED OUTPUT */}
          <div style={{ ...cardStyle, backgroundColor: "#FFFFFF", borderTop: "4px solid #F18B25" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <div>
                <span style={{ ...brutalEyebrow, color: "#F18B25", fontSize: "0.65rem" }}>Ready to Publish</span>
                <h4 style={{ ...brutalHeading, fontSize: "1rem", margin: 0 }}>Enforced Production Output</h4>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  border: brutalBorder,
                  backgroundColor: copied ? "#2A9D5C" : "#FFFCF9",
                  color: copied ? "#FFFFFF" : "#111111",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  padding: "0.35rem 0.8rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  textTransform: "uppercase",
                }}
              >
                {copied ? <CheckCircle2 size={14} /> : <FileText size={14} />}
                {copied ? "Copied!" : "Copy Output"}
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                padding: "0.9rem",
                backgroundColor: "#FFFCF9",
                border: brutalBorder,
                fontSize: "0.85rem",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: contentType === "ui-component" ? "monospace" : "inherit",
                fontWeight: 600,
              }}
            >
              {result.enforcedOutput}
            </pre>
          </div>

          {/* MODIFICATIONS APPLIED */}
          <div style={{ ...cardStyle, backgroundColor: "#FFFCF9" }}>
            <h4 style={{ ...brutalHeading, fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Modifications Applied Automatically</h4>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", display: "grid", gap: "0.3rem", fontWeight: 600, color: theme.colors.textPrimary }}>
              {(result.modificationsApplied || []).map((m, i) => (
                <li key={i}>✓ {m}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
