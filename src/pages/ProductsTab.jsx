import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  Calculator,
  FileText,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Tag,
  RefreshCw,
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

// Canonical 28 Products & Interactive Tools Catalog
const PRODUCT_CATALOG = [
  {
    id: "001",
    name: "Digital Business OS",
    category: "Flagship / Notion",
    type: "Notion System",
    price: "$49 - $197",
    tier: "Core / Flagship",
    status: "Live on Gumroad",
    gumroadUrl: "https://shop.digitallydefined.store/l/digital-business-os",
    persona: "Gen X Women / Women 50+",
    demandScore: "5/5",
    description: "The complete operating system for running a faceless digital real estate business on Notion.",
    profitability: "Highest LTV — powers the $29/mo AI Partner subscription upsell.",
  },
  {
    id: "002",
    name: "Retirement Mastery for Gen X Women",
    category: "Guides / Strategy",
    type: "2-Part Ebook + Plan",
    price: "$47 - $67",
    tier: "Core Offer",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Women 50+ closing retirement gap",
    demandScore: "5/5",
    description: "Financial reset & digital asset cash flow strategy specifically engineered for Gen X women starting after 45.",
    profitability: "High conversion pairing with the Unfiltered Balance Sheet calculator.",
  },
  {
    id: "003",
    name: "Rank & Rent Academy Suite",
    category: "Interactive Tools",
    type: "7-Tool Software Suite",
    price: "$47 - $97",
    tier: "Core / Software",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Asset Builders / Solopreneurs",
    demandScore: "5/5",
    description: "7 interactive HTML calculators and analyzers for picking local niches, evaluating aged domains, and leasing digital assets.",
    profitability: "Software utility creates high perceived value and low refund rates.",
  },
  {
    id: "004",
    name: "Affiliate Flip Calculator",
    category: "Interactive Tools",
    type: "Standalone HTML Tool",
    price: "$27",
    tier: "Entry / Tool",
    status: "Live Hosted",
    gumroadUrl: "https://dashboard.digitallydefined.agency/affiliate-flip-calculator.html",
    persona: "Affiliate Creators & Beginners",
    demandScore: "5/5",
    description: "Interactive ROI and profit modeling calculator for affiliate funnels and digital property flips.",
    profitability: "Fast entry conversion from quiz roadmap traffic.",
  },
  {
    id: "005",
    name: "10X ROI Calculator & System",
    category: "Interactive Tools",
    type: "Interactive Calculator + Email Gate",
    price: "$27 - $47",
    tier: "Entry / Tool",
    status: "Live Hosted",
    gumroadUrl: "https://dashboard.digitallydefined.agency/10x-roi-calculator.html",
    persona: "Women 50+ evaluating asset ROI",
    demandScore: "5/5",
    description: "Calculates digital asset payback period and 10X revenue scaling pathways for solopreneurs.",
    profitability: "Proven lead magnet + instant tripwire upgrade.",
  },
  {
    id: "006",
    name: "Unfiltered Balance Sheet",
    category: "Interactive Tools",
    type: "Financial Calculator Suite",
    price: "$27 - $47",
    tier: "Core / Software",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Women 50+ tracking digital net worth",
    demandScore: "5/5",
    description: "Brutally honest digital net worth & monthly cash-flow runway calculator tailored for Gen X women.",
    profitability: "Natural upsell inside the Retirement Mastery funnel.",
  },
  {
    id: "007",
    name: "Catch-Up OS (Optimization Tool)",
    category: "Interactive Tools",
    type: "Interactive App + 2 Ad Frames",
    price: "$27 - $47",
    tier: "Core / Software",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Women 50+ accelerating retirement timeline",
    demandScore: "5/5",
    description: "Speed-to-launch roadmap calculator with pre-built social ad hooks to jumpstart cash flow.",
    profitability: "Highest urgent-need hook for women seeking fast digital cash flow.",
  },
  {
    id: "008",
    name: "Digital Property Starter Kit",
    category: "Starter Kits",
    type: "Asset Kit",
    price: "$17",
    tier: "Entry Offer",
    status: "Live on Gumroad",
    gumroadUrl: "https://shop.digitallydefined.store/l/ycaru",
    persona: "Beginners entering digital real estate",
    demandScore: "4/5",
    description: "Beginner step-by-step kit for claiming, structuring, and launching your first faceless digital asset.",
    profitability: "Low-friction impulse buy for cold traffic.",
  },
  {
    id: "009",
    name: "High-Ticket Affiliate Kit + 36 Programs",
    category: "Affiliate Data",
    type: "Guide + 36-Program Dataset",
    price: "$27 - $47",
    tier: "Core Offer",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Creators / Connectors",
    demandScore: "4/5",
    description: "Verified 36 high-paying affiliate programs for tech, SaaS, and wellness with recurring commission ladders.",
    profitability: "Immediate double monetization: product sale + affiliate recurring revenue.",
  },
  {
    id: "010",
    name: "50 AI Prompts for Digital Products",
    category: "Prompt Systems",
    type: "Prompt Architecture Pack",
    price: "$17 - $27",
    tier: "Entry Offer",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Women building faceless products",
    demandScore: "4/5",
    description: "Tested prompt frameworks for generating ebooks, calculators, checklists, and templates with Claude/Gemini.",
    profitability: "Zero fulfillment cost, high volume entry point.",
  },
  {
    id: "011",
    name: "Keyword Suite: Advantage + Trigger Banks",
    category: "SEO / Keywords",
    type: "3-Part PDF Suite",
    price: "$27 - $37",
    tier: "Core Offer",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Women ranking faceless websites",
    demandScore: "4/5",
    description: "Niche keyword selection cheat sheet + buyer-intent trigger word database.",
    profitability: "Essential add-on for everyone buying Rank & Rent guides.",
  },
  {
    id: "012",
    name: "Local SEO Quick-Start Checklist",
    category: "Lead Magnets",
    type: "Interactive Checklist",
    price: "FREE ($0)",
    tier: "Lead Magnet",
    status: "Live on Gumroad",
    gumroadUrl: "https://shop.digitallydefined.store/l/noodsi",
    persona: "All cold traffic",
    demandScore: "5/5",
    description: "High-converting free checklist that captures emails and funnels into the Digital Business OS.",
    profitability: "Primary email list builder.",
  },
  {
    id: "013",
    name: "Digital Superpower Quiz + Roadmap",
    category: "Funnel / Assessment",
    type: "Interactive Assessment",
    price: "FREE → $47",
    tier: "Lead Magnet / Frontend",
    status: "Live on Site",
    gumroadUrl: "https://dashboard.digitallydefined.agency/quiz",
    persona: "All 5 Gen X archetypes",
    demandScore: "5/5",
    description: "Identifies visitor superpower archetype and generates an AI roadmap with targeted product recommendations.",
    profitability: "The primary growth engine for the entire ecosystem.",
  },
  {
    id: "014",
    name: "The 5 Estate Documents Gen X Women Need",
    category: "Lead Magnets",
    type: "Interactive HTML Guide",
    price: "FREE ($0)",
    tier: "Lead Magnet",
    status: "Ready to List",
    gumroadUrl: "",
    persona: "Solo Gen X women / Women 50+",
    demandScore: "5/5",
    description: "Crucial legal protection checklist addressing digital asset inheritance and security.",
    profitability: "Captures high-intent, mature demographic leads.",
  },
];

const STYLING_TOOLS_SCORECARD = [
  { name: "Affiliate Flip Calculator", profitability: "9/10", demand: "High intent, fast monetization", status: "Live Tool" },
  { name: "10X ROI Calculator & System", profitability: "9.5/10", demand: "Proven lead magnet + tripwire", status: "Live Tool" },
  { name: "Unfiltered Balance Sheet", profitability: "8.5/10", demand: "Urgent transition & divorce math", status: "Ready to List" },
  { name: "Catch-Up OS (Optimization Tool)", profitability: "10/10", demand: "Highest urgency for Gen X retirement gap", status: "Ready to List" },
  { name: "High-Ticket Affiliate Kit + 36 Programs", profitability: "9/10", demand: "Double monetization (product + recurring)", status: "Ready to List" },
  { name: "Keyword Suite: Advantage + Trigger Banks", profitability: "8/10", demand: "Essential SEO utility for rankings", status: "Ready to List" },
];

export default function ProductsTab({ onAskHermes }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [gumroadProducts, setGumroadProducts] = useState([]);
  const [loadingGumroad, setLoadingGumroad] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [productsList, setProductsList] = useState(PRODUCT_CATALOG);

  useEffect(() => {
    let isMounted = true;
    setLoadingGumroad(true);
    ddPost("gumroad.products", {})
      .then((res) => {
        if (isMounted && res && res.success && Array.isArray(res.products)) {
          setGumroadProducts(res.products);
        }
      })
      .catch((err) => console.warn("[ProductsTab] Live Gumroad fetch:", err))
      .finally(() => {
        if (isMounted) setLoadingGumroad(false);
      });
    return () => { isMounted = false; };
  }, []);

  const mergedCatalog = productsList.map((p) => {
    const realGumroad = gumroadProducts.find(
      (gp) =>
        (gp.short_url && p.gumroadUrl && gp.short_url.toLowerCase().includes(p.gumroadUrl.toLowerCase())) ||
        (gp.name && p.name && gp.name.toLowerCase().includes(p.name.toLowerCase())) ||
        (p.name && gp.name && p.name.toLowerCase().includes(gp.name.toLowerCase()))
    );

    if (realGumroad) {
      return {
        ...p,
        status: realGumroad.published ? "Live on Gumroad" : "Draft on Gumroad",
        price: realGumroad.formatted_price || p.price,
        gumroadUrl: realGumroad.short_url || p.gumroadUrl,
      };
    }

    return {
      ...p,
      status: p.status.toLowerCase().includes("live") ? "Ready to List" : p.status,
    };
  });

  const filteredProducts = mergedCatalog.filter((p) => {
    if (filter === "live" && !p.status.toLowerCase().includes("live")) return false;
    if (filter === "tools" && p.category !== "Interactive Tools") return false;
    if (filter === "magnets" && p.tier !== "Lead Magnet") return false;
    if (filter === "core" && !p.tier.toLowerCase().includes("core") && !p.tier.toLowerCase().includes("flagship")) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.persona.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const liveCount = mergedCatalog.filter((p) => p.status.toLowerCase().includes("live")).length;
  const readyCount = mergedCatalog.filter((p) => p.status.toLowerCase().includes("ready")).length;
  const draftCount = mergedCatalog.filter((p) => p.status.toLowerCase().includes("draft")).length;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {/* Top Banner / Summary */}
      <div
        style={{
          ...cardStyle,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.75rem",
          backgroundColor: theme.colors.card,
        }}
      >
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>
            Total Catalog SKUs
          </div>
          <strong style={{ fontSize: "1.2rem" }}>{productsList.length} Products</strong>
        </div>
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.success, fontSize: "0.62rem" }}>
            Live & Selling
          </div>
          <strong style={{ fontSize: "1.2rem", color: theme.colors.success }}>
            {liveCount} SKUs Live
          </strong>
        </div>
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.orange, fontSize: "0.62rem" }}>
            Ready to List (90-Day Plan)
          </div>
          <strong style={{ fontSize: "1.2rem", color: theme.colors.orange }}>
            {readyCount} Ready Now
          </strong>
        </div>
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.aquaBlue, fontSize: "0.62rem" }}>
            Core Target Demographic
          </div>
          <strong style={{ fontSize: "1.05rem" }}>Gen X Women / 50+</strong>
        </div>
      </div>

      {/* Strategy Hook / Hermes AI Bar */}
      <div
        style={{
          ...cardStyle,
          backgroundColor: "#faf5ff",
          border: `1px solid ${theme.colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Sparkles size={20} color="#7c3aed" />
          <div>
            <strong style={{ fontSize: "0.92rem", color: "#4c1d95" }}>
              Hermes Product Intelligence
            </strong>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#6b21a8" }}>
              Hermes monitors demographic demand for Women 50+ to rank the most profitable tools to list.
            </p>
          </div>
        </div>
        {onAskHermes && (
          <button
            type="button"
            onClick={() =>
              onAskHermes(
                "Based on my 28 products and market demand for women over 50 closing the retirement gap, which 2 tools should I list next on Gumroad and what social hooks will drive the highest conversions?"
              )
            }
            style={{
              border: brutalBorder,
              backgroundColor: "#7c3aed",
              color: "#ffffff",
              padding: "0.45rem 0.8rem",
              fontWeight: 800,
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Sparkles size={14} />
            Ask Hermes Next Move
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.6rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All Products" },
            { id: "live", label: "Live on Gumroad" },
            { id: "tools", label: "Interactive Calculators" },
            { id: "magnets", label: "Free Magnets" },
            { id: "core", label: "Core & Flagships" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              style={{
                border: brutalBorder,
                backgroundColor: filter === tab.id ? theme.colors.orange : theme.colors.card,
                color: "#000000",
                padding: "0.35rem 0.65rem",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Filter by keyword or persona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            border: brutalBorder,
            padding: "0.35rem 0.65rem",
            fontSize: "0.82rem",
            minWidth: "220px",
            backgroundColor: theme.colors.card,
          }}
        />
      </div>

      {/* Products Grid */}
      <div style={{ display: "grid", gap: "0.85rem" }}>
        {filteredProducts.map((p) => {
          const isLive = p.status.toLowerCase().includes("live");
          return (
            <article
              key={p.id}
              style={{
                ...cardStyle,
                display: "grid",
                gap: "0.65rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span
                      style={{
                        ...brutalEyebrow,
                        fontSize: "0.62rem",
                        backgroundColor: "#f3f4f6",
                        padding: "0.15rem 0.4rem",
                        border: "1px solid #d1d5db",
                      }}
                    >
                      SKU #{p.id} • {p.category}
                    </span>
                    <span
                      style={{
                        ...brutalEyebrow,
                        fontSize: "0.62rem",
                        color: isLive ? theme.colors.success : theme.colors.orange,
                        fontWeight: 800,
                      }}
                    >
                      ● {p.status}
                    </span>
                  </div>
                  <h3 style={{ ...brutalHeading, fontSize: "1.02rem", margin: "0 0 0.25rem" }}>
                    {p.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: theme.colors.muted }}>
                    {p.description}
                  </p>
                </div>

                <div style={{ textAlign: "right", minWidth: "130px" }}>
                  <div style={{ fontSize: "1.15rem", fontWeight: 900 }}>{p.price}</div>
                  <span style={{ ...brutalEyebrow, fontSize: "0.65rem", color: theme.colors.muted }}>
                    {p.tier}
                  </span>
                </div>
              </div>

              {/* Persona & Profitability Analysis */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.6rem",
                  fontSize: "0.82rem",
                  backgroundColor: "#f9fafb",
                  padding: "0.55rem 0.75rem",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div>
                  <span style={{ fontWeight: 800, color: theme.colors.textPrimary }}>Target Demographic: </span>
                  <span style={{ color: theme.colors.muted }}>{p.persona}</span>
                </div>
                <div>
                  <span style={{ fontWeight: 800, color: theme.colors.textPrimary }}>AI Profit Hook: </span>
                  <span style={{ color: theme.colors.muted }}>{p.profitability}</span>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.6rem",
                  flexWrap: "wrap",
                  paddingTop: "0.3rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ ...brutalEyebrow, fontSize: "0.65rem", color: theme.colors.muted }}>
                    50+ Demand Score:
                  </span>
                  <strong style={{ fontSize: "0.85rem", color: "#059669" }}>
                    {p.demandScore} High Priority
                  </strong>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove "${p.name}" from your catalog?`)) {
                        setProductsList((prev) => prev.filter((item) => item.id !== p.id));
                      }
                    }}
                    style={{
                      border: brutalBorder,
                      backgroundColor: "#fee2e2",
                      color: "#991b1b",
                      padding: "0.35rem 0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                    title="Remove product"
                  >
                    Delete
                  </button>

                  {onAskHermes && (
                    <button
                      type="button"
                      disabled={publishingId === p.id}
                      onClick={async () => {
                        setPublishingId(p.id);
                        const brief = `${p.name}\n${p.description || ''}\n${p.persona || ''}\n${p.profitability || ''}`;
                        try {
                          const res = await ddPost("agents.run", {
                            agent: "gumroadPublisher",
                            params: {
                              name: p.name,
                              brief,
                              price: p.price,
                              persona: p.persona,
                            },
                          });
                          if (res?.success && res?.data) {
                            setPipelineResult({ product: p, ...res.data });
                          } else {
                            alert(res?.error || 'Agent pipeline failed');
                          }
                        } catch (err) {
                          alert(err.message);
                        } finally {
                          setPublishingId(null);
                        }
                      }}
                      style={{
                        border: brutalBorder,
                        backgroundColor: publishingId === p.id ? theme.colors.muted : theme.colors.card,
                        color: theme.colors.textPrimary,
                        padding: "0.35rem 0.65rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: publishingId === p.id ? "wait" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Sparkles size={13} color="#7c3aed" />
                      {publishingId === p.id ? "Running Pipeline..." : "Market on Gumroad"}
                    </button>
                  )}

                  {p.gumroadUrl ? (
                    <a
                      href={p.gumroadUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        border: brutalBorder,
                        backgroundColor: isLive ? theme.colors.card : theme.colors.orange,
                        color: theme.colors.textPrimary,
                        padding: "0.35rem 0.65rem",
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {isLive ? "View on Gumroad" : "Open Live Tool"}
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span
                      style={{
                        border: "1px dashed #9ca3af",
                        padding: "0.35rem 0.65rem",
                        fontSize: "0.75rem",
                        color: theme.colors.muted,
                        fontWeight: 600,
                      }}
                    >
                      Pending Gumroad Listing
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* HTML Tools Profitability Scorecard */}
      <div style={{ border: brutalBorder, backgroundColor: theme.colors.card, padding: "1.5rem", marginTop: "2rem", marginBottom: "2rem" }}>
        <span style={{ ...brutalEyebrow, color: "#7c3aed" }}>AI Market Intelligence</span>
        <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.1rem", margin: "0.2rem 0 0 0", textTransform: "uppercase" }}>
          Interactive Tools Profitability Scorecard (1-10)
        </h3>
        <p style={{ fontSize: "0.85rem", color: theme.colors.muted, margin: "0.4rem 0 1rem 0" }}>
          AI-backed demand, competition, and conversion scoring for standalone HTML utility tools.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "2px solid #111", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase" }}>Tool Name</th>
                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "2px solid #111", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase" }}>Profitability Score</th>
                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "2px solid #111", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase" }}>Demand & Monetization Angle</th>
                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "2px solid #111", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.82rem", textTransform: "uppercase" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {STYLING_TOOLS_SCORECARD.map((tool, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", fontSize: "0.88rem", fontWeight: 700 }}>{tool.name}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", fontSize: "0.88rem", fontWeight: 900, color: theme.colors.orange }}>{tool.profitability}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", fontSize: "0.85rem", color: "#374151" }}>{tool.demand}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", fontSize: "0.85rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "0.15rem 0.4rem", backgroundColor: tool.status === "Live Tool" ? "#d1fae5" : "#fef3c7", color: tool.status === "Live Tool" ? "#065f46" : "#92400e", border: "1px solid #111" }}>
                      {tool.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pipeline Result Modal */}
      {pipelineResult && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            backgroundColor: "#FFFCF9",
            border: brutalBorder,
            maxWidth: "750px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "1.5rem",
            display: "grid",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111", paddingBottom: "0.75rem" }}>
              <div>
                <span style={{ ...brutalEyebrow, color: theme.colors.orange }}>DIGITALLYDEFINED AI PIPELINE</span>
                <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.3rem", margin: "0.2rem 0 0 0" }}>
                  {pipelineResult.listing?.title || pipelineResult.product?.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPipelineResult(null)}
                style={{ border: brutalBorder, backgroundColor: "#C20F0A", color: "#fff", padding: "0.3rem 0.6rem", fontWeight: 800, cursor: "pointer" }}
              >
                CLOSE ✕
              </button>
            </div>

            {/* Status & Publish */}
            <div style={{ border: brutalBorder, backgroundColor: "#fff", padding: "1rem" }}>
              <h3 style={{ ...brutalEyebrow, color: theme.colors.success, marginBottom: "0.5rem" }}>GUMROAD PUBLISH STATUS</h3>
              <p style={{ margin: "0 0 0.5rem 0", fontWeight: 700 }}>Status: {pipelineResult.publish?.status}</p>
              <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.85rem", color: "#4b5563" }}>{pipelineResult.publish?.reason}</p>
              {pipelineResult.publish?.url && (
                <a
                  href={pipelineResult.publish.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", border: brutalBorder, backgroundColor: theme.colors.orange, color: "#111", padding: "0.4rem 0.8rem", fontWeight: 800, textDecoration: "none", fontSize: "0.85rem" }}
                >
                  OPEN GUMROAD DRAFT ↗
                </a>
              )}
            </div>

            {/* Brand Audit */}
            <div style={{ border: brutalBorder, backgroundColor: "#fff", padding: "1rem" }}>
              <h3 style={{ ...brutalEyebrow, color: "#7c3aed", marginBottom: "0.5rem" }}>BRAND SUPERVISOR AUDIT</h3>
              <p style={{ margin: "0 0 0.4rem 0", fontSize: "0.85rem" }}>Verdict: <strong>{pipelineResult.brand?.verdict}</strong> ({pipelineResult.brand?.complianceScore}% compliant)</p>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.82rem", color: "#374151" }}>
                {(pipelineResult.brand?.modificationsApplied || []).map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            {/* Listing Copy */}
            <div style={{ border: brutalBorder, backgroundColor: "#fff", padding: "1rem", display: "grid", gap: "0.5rem" }}>
              <h3 style={{ ...brutalEyebrow, color: "#111", marginBottom: "0.2rem" }}>NO-BS GUMROAD COPY</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 700 }}>Price: ${pipelineResult.listing?.price}</p>
              <div style={{ fontSize: "0.85rem", whiteSpace: "pre-line", backgroundColor: "#FFFCF9", border: "1px solid #e5e7eb", padding: "0.75rem" }}>
                {pipelineResult.listing?.description}
              </div>
              <h4 style={{ margin: "0.5rem 0 0.2rem 0", fontSize: "0.85rem", fontWeight: 800 }}>Benefit Bullets:</h4>
              <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.82rem" }}>
                {(pipelineResult.listing?.bullets || []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Visual Assets */}
            {pipelineResult.assets?.cover && (
              <div style={{ border: brutalBorder, backgroundColor: "#fff", padding: "1rem" }}>
                <h3 style={{ ...brutalEyebrow, color: "#111", marginBottom: "0.5rem" }}>FLAT SOFT BRUTALISM COVER SVG</h3>
                <div style={{ border: "1px solid #111", maxHeight: "200px", overflow: "hidden", backgroundColor: "#FFFCF9", display: "flex", justifyContent: "center" }} dangerouslySetInnerHTML={{ __html: pipelineResult.assets.cover.svgCode }} />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(pipelineResult.assets.cover.svgCode);
                    alert("Cover SVG copied to clipboard!");
                  }}
                  style={{ marginTop: "0.5rem", border: brutalBorder, backgroundColor: "#47B7D4", color: "#111", padding: "0.3rem 0.6rem", fontWeight: 800, fontSize: "0.78rem", cursor: "pointer" }}
                >
                  COPY COVER SVG CODE
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
