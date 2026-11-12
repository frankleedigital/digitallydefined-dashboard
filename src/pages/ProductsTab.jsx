import React, { useState } from "react";
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
} from "lucide-react";
import {
  brutalBorder,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";

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
    gumroadUrl: "https://francescaonline.gumroad.com/l/digital-business-os",
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
    gumroadUrl: "https://lavignefrancesca.gumroad.com/l/ycaru",
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
    gumroadUrl: "https://lavignefrancesca.gumroad.com/l/noodsi",
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

export default function ProductsTab({ onAskHermes }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredProducts = PRODUCT_CATALOG.filter((p) => {
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

  const liveCount = PRODUCT_CATALOG.filter((p) => p.status.toLowerCase().includes("live")).length;
  const readyCount = PRODUCT_CATALOG.filter((p) => p.status.toLowerCase().includes("ready")).length;

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
          <strong style={{ fontSize: "1.2rem" }}>{PRODUCT_CATALOG.length} Products</strong>
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
                  {onAskHermes && (
                    <button
                      type="button"
                      onClick={() =>
                        onAskHermes(
                          `How should I position and market "${p.name}" (${p.price}) to Gen X women and women over 50 looking for digital cash flow? Give me a 3-step action plan.`
                        )
                      }
                      style={{
                        border: brutalBorder,
                        backgroundColor: theme.colors.card,
                        color: theme.colors.textPrimary,
                        padding: "0.35rem 0.65rem",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      <Sparkles size={13} color="#7c3aed" />
                      Ask Hermes to Market This
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
    </div>
  );
}
