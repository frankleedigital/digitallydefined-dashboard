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
    "Let's get real. Stop making excuses and build your digital asset empire today. Click here to buy our course."
  );
  const [contentType, setContentType] = useState("copy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runAudit = async (e) => {
    e?.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ddPost("agents.run", {
        agent: "brandSupervisor",
        params: { content, contentType },
      });
      if (res && res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res?.error || "Brand audit failed.");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
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
            Governance & Quality Assurance
          </span>
          <h2 style={{ ...brutalHeading, fontSize: "1.4rem", color: "#FFFFFF", margin: "0.25rem 0 0" }}>
            BRAND SUPERVISOR AI
          </h2>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#BFBFBF" }}>
            Audits copy, landing pages, social posts, and product specs against DigitallyDefined Brand Guidelines before you publish.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span style={{ ...brutalEyebrow, fontSize: "0.7rem", color: "#FFFFFF", border: "1px solid #444", padding: "4px 8px" }}>
            No-BS Voice ⇄ Soft Brutalism
          </span>
        </div>
      </div>

      {/* INPUT FORM */}
      <form onSubmit={runAudit} style={{ ...cardStyle, display: "grid", gap: "0.8rem", borderTop: "4px solid #2A9D5C" }}>
        <h3 style={{ ...brutalHeading, fontSize: "0.95rem", margin: 0 }}>Content & Asset Audit Input</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.8rem" }}>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Content Type</label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            >
              <option value="copy">Marketing Copy / Email</option>
              <option value="product">Product Description / Offer</option>
              <option value="landing-page">Landing Page Copy / Spec</option>
              <option value="social">Social Media / Threads Post</option>
              <option value="image-spec">Image / Visual Asset Spec</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Content / Copy / Pitch to Audit *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            placeholder="Paste your draft copy, social post, or product description here..."
            style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600, fontFamily: "inherit" }}
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
            {loading ? "Auditing Brand Constitution..." : "Run Brand Supervisor Audit"}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ ...cardStyle, backgroundColor: theme.colors.dangerTint, color: theme.colors.darkRed, fontWeight: 700 }}>
          {error}
        </div>
      )}

      {/* RESULTS SECTION */}
      {result && result.complianceScore != null && (
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
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Brand Verdict</div>
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
                {result.verdict}
              </div>
            </div>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Pillar Alignment</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 800, marginTop: "0.3rem" }}>
                {result.pillarAlignment}
              </div>
            </div>
          </div>

          {/* AUDIT DETAILS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div style={cardStyle}>
              <h4 style={{ ...brutalHeading, fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Voice Check (No-BS Big Bestie)</h4>
              <p style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", fontWeight: 600 }}>{result.voiceAudit?.critique}</p>
              {result.voiceAudit?.suggestedRewrite && (
                <div style={{ marginTop: "0.5rem", borderTop: brutalBorder, paddingTop: "0.5rem" }}>
                  <span style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>Suggested Rewrite</span>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", fontStyle: "italic", background: "#FFFCF9", padding: "0.5rem", border: brutalBorder }}>
                    "{result.voiceAudit.suggestedRewrite}"
                  </p>
                </div>
              )}
            </div>
            <div style={cardStyle}>
              <h4 style={{ ...brutalHeading, fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Aesthetic & Architecture Check</h4>
              <p style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", fontWeight: 600 }}>{result.aestheticAudit?.critique}</p>
              <div style={{ marginTop: "0.8rem" }}>
                <span style={{ ...brutalEyebrow, fontSize: "0.6rem" }}>Detected Violations</span>
                {Array.isArray(result.violations) && result.violations.length > 0 ? (
                  <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", fontSize: "0.82rem", color: theme.colors.darkRed }}>
                    {result.violations.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: "0.82rem", color: theme.colors.success, fontWeight: 700, marginTop: "0.2rem" }}>
                    ✓ Zero brand violations detected.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* REMEDIATION STEPS */}
          <div style={{ ...cardStyle, backgroundColor: "#FFFCF9" }}>
            <h4 style={{ ...brutalHeading, fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Remediation & Publishing Steps</h4>
            <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", display: "grid", gap: "0.3rem", fontWeight: 600 }}>
              {(result.remediationSteps || []).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
