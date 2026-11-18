// src/pages/AffiliateFlipperTab.jsx — Affiliate Flipper AI Dashboard Widget
// Purpose: Analyze TRAFFIC → PRODUCT MATCH to flip undervalued traffic into
// high-paying affiliate commissions. Aligned with DigitallyDefined Soft Brutalism.

import React, { useState } from "react";
import {
  TrendingUp,
  Search,
  DollarSign,
  Zap,
  Play,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ExternalLink,
  Layers,
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

const GRADE_COLORS = {
  "ELITE OPPORTUNITY": { bg: "#000000", text: "#FFFFFF" },
  STRONG: { bg: "#2A9D5C", text: "#FFFFFF" },
  GOOD: { bg: "#47B7D4", text: "#000000" },
  WEAK: { bg: "#F18B25", text: "#000000" },
  AVOID: { bg: "#C20F0A", text: "#FFFFFF" },
};

export default function AffiliateFlipperTab() {
  const [keyword, setKeyword] = useState("AI Headshot Generator");
  const [niche, setNiche] = useState("SaaS & Marketing");
  const [productName, setProductName] = useState("PixelPerfect AI");
  const [productUrl, setProductUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [commission, setCommission] = useState("30");
  const [cookie, setCookie] = useState("60");
  const [recurring, setRecurring] = useState("recurring");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const runFlipper = async (e) => {
    e?.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await ddPost("agents.run", {
        agent: "affiliateFlipper",
        params: {
          keyword,
          niche,
          productName,
          productUrl,
          affiliateUrl,
          commission: Number(commission) || 30,
          cookie: Number(cookie) || 60,
          recurring: recurring === "recurring",
        },
      });
      if (res && res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res?.error || "Affiliate flip analysis failed.");
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
          <span style={{ ...brutalEyebrow, color: "#D4A017", fontSize: "0.68rem" }}>
            Revenue & Traffic Asset Engine
          </span>
          <h2 style={{ ...brutalHeading, fontSize: "1.4rem", color: "#FFFFFF", margin: "0.25rem 0 0" }}>
            AFFILIATE FLIPPER AI
          </h2>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.82rem", color: "#BFBFBF" }}>
            Analyze TRAFFIC → PRODUCT MATCH to find undervalued keyword demand and flip it into high-paying affiliate commissions.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span style={{ ...brutalEyebrow, fontSize: "0.7rem", color: "#FFFFFF", border: "1px solid #444", padding: "4px 8px" }}>
            Traffic ⇄ Commission
          </span>
        </div>
      </div>

      {/* INPUT FORM */}
      <form onSubmit={runFlipper} style={{ ...cardStyle, display: "grid", gap: "0.8rem", borderTop: "4px solid #D4A017" }}>
        <h3 style={{ ...brutalHeading, fontSize: "0.95rem", margin: 0 }}>Configure Affiliate Opportunity</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Keyword *</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. AI Headshot Generator"
              required
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Niche</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. SaaS & Marketing"
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. PixelPerfect AI"
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.8rem" }}>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Commission (%)</label>
            <input
              type="number"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              min="1"
              max="100"
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Cookie Duration (days)</label>
            <input
              type="number"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              min="1"
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase" }}>Model Type</label>
            <select
              value={recurring}
              onChange={(e) => setRecurring(e.target.value)}
              style={{ ...cardStyle, backgroundColor: "#FFFFFF", marginTop: "0.25rem", width: "100%", fontWeight: 600 }}
            >
              <option value="recurring">Recurring (SaaS / MRR)</option>
              <option value="one-time">One-Time Commission</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              border: brutalBorder,
              backgroundColor: "#D4A017",
              color: "#111",
              fontWeight: 900,
              textTransform: "uppercase",
              padding: "0.7rem 1.2rem",
              cursor: loading ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? <Loader2 size={16} className="spin" /> : <Play size={16} />}
            {loading ? "Analyzing Traffic & Offer Match..." : "Run Affiliate Flip Analysis"}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ ...cardStyle, backgroundColor: theme.colors.dangerTint, color: theme.colors.darkRed, fontWeight: 700 }}>
          {error}
        </div>
      )}

      {/* RESULTS SECTION */}
      {result && result.scores && (
        <div style={{ display: "grid", gap: "1rem" }}>
          {/* TOP SCORE BANNER */}
          <div style={{ ...cardStyle, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", backgroundColor: "#FFFCF9" }}>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Traffic Opportunity</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: theme.colors.textPrimary }}>
                {result.scores.trafficOpportunityScore}
                <span style={{ fontSize: "0.9rem", color: theme.colors.muted }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Monetization Score</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: theme.colors.textPrimary }}>
                {result.scores.monetizationScore}
                <span style={{ fontSize: "0.9rem", color: theme.colors.muted }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Affiliate Flip Score</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: theme.colors.orange }}>
                {result.scores.affiliateFlipScore}
                <span style={{ fontSize: "0.9rem", color: theme.colors.muted }}>/100</span>
              </div>
            </div>
            <div>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Opportunity Grade</div>
              <div
                style={{
                  display: "inline-block",
                  marginTop: "0.2rem",
                  padding: "0.3rem 0.6rem",
                  backgroundColor: GRADE_COLORS[result.scores.grade]?.bg || "#000",
                  color: GRADE_COLORS[result.scores.grade]?.text || "#FFF",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  border: brutalBorder,
                }}
              >
                {result.scores.grade}
              </div>
            </div>
          </div>

          {/* RECOMMENDATION & VERDICT */}
          <div style={{ ...cardStyle, borderLeft: "5px solid #D4A017" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ ...brutalEyebrow, color: "#D4A017" }}>AI Strategic Verdict</span>
              <span style={{ ...brutalEyebrow, fontWeight: 900 }}>{result.recommendation}</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5, fontWeight: 600 }}>{result.verdict}</p>
          </div>

          {/* REVENUE ESTIMATE */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div style={cardStyle}>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Conservative (50%)</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, marginTop: "0.2rem" }}>
                ${result.revenue?.conservative?.toLocaleString() || 0}
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: theme.colors.muted }}> /mo</span>
              </div>
            </div>
            <div style={{ ...cardStyle, backgroundColor: "#FFFCF9", border: "2px solid #D4A017" }}>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem", color: "#D4A017" }}>Realistic Target</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 900, marginTop: "0.2rem" }}>
                ${result.revenue?.realistic?.toLocaleString() || 0}
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: theme.colors.muted }}> /mo</span>
              </div>
            </div>
            <div style={cardStyle}>
              <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Aggressive Upside</div>
              <div style={{ fontSize: "1.3rem", fontWeight: 900, marginTop: "0.2rem" }}>
                ${result.revenue?.aggressive?.toLocaleString() || 0}
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: theme.colors.muted }}> /mo</span>
              </div>
            </div>
          </div>

          {/* WHY TRAFFIC & WHY MONETIZATION */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div style={cardStyle}>
              <h4 style={{ ...brutalHeading, fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Traffic Analysis WHY</h4>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", display: "grid", gap: "0.3rem" }}>
                {(result.whyTraffic || []).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
            <div style={cardStyle}>
              <h4 style={{ ...brutalHeading, fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Monetization Analysis WHY</h4>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", display: "grid", gap: "0.3rem" }}>
                {(result.whyMonetization || []).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CONTENT OPPORTUNITY MATRIX */}
          {result.contentOpportunities && (
            <div style={{ ...cardStyle, display: "grid", gap: "0.8rem" }}>
              <h3 style={{ ...brutalHeading, fontSize: "0.95rem", margin: 0 }}>Content & Traffic Asset Opportunities</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>
                <div style={{ border: brutalBorder, padding: "0.7rem", backgroundColor: "#FFF" }}>
                  <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Top Keywords</div>
                  <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", fontSize: "0.8rem" }}>
                    {(result.contentOpportunities.topKeywords || []).map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ border: brutalBorder, padding: "0.7rem", backgroundColor: "#FFF" }}>
                  <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Blog & Review Ideas</div>
                  <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", fontSize: "0.8rem" }}>
                    {(result.contentOpportunities.blogIdeas || []).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ border: brutalBorder, padding: "0.7rem", backgroundColor: "#FFF" }}>
                  <div style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>Social & Email Funnels</div>
                  <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", fontSize: "0.8rem" }}>
                    {(result.contentOpportunities.threadsPosts || []).slice(0, 2).map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                    {(result.contentOpportunities.emailFunnelIdeas || []).slice(0, 1).map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* NEXT ACTIONS */}
          <div style={{ ...cardStyle, backgroundColor: "#FFFCF9" }}>
            <h4 style={{ ...brutalHeading, fontSize: "0.9rem", margin: "0 0 0.5rem" }}>Immediate Execution Plan</h4>
            <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", display: "grid", gap: "0.3rem", fontWeight: 600 }}>
              {(result.nextActions || []).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
