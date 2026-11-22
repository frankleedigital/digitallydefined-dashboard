// src/pages/StorePage.jsx
// The public storefront for digitallydefined.store
// Displays ONLY live, verified Gumroad products with the DigitallyDefined brand logo/header.

import React from "react";
import { brutalBorder, brutalHeading, theme } from "../theme";
import Logo from "../components/Logo";

const STORE_PRODUCTS = [
  {
    id: "legacy-os",
    name: "The Legacy OS Bundle",
    price: "$297",
    blurb:
      "Financial Autonomy Planner, Caregiver's Survival Kit & Legacy Command Center. The complete setup for Gen X women building permanent digital wealth.",
    forWho: "You want the flagship suite for long-term legacy and financial security.",
    href: "https://shop.digitallydefined.store/l/legacy_os_bundle",
    badge: "Live on Gumroad",
    isLive: true,
  },
  {
    id: "digital-business-os",
    name: "Digital Business OS",
    price: "Coming Soon",
    blurb:
      "The complete operating system for running a faceless digital real estate business on Notion.",
    forWho: "Being built by Notion OS Architect for release.",
    href: "#",
    badge: "In Development",
    isLive: false,
  },
  {
    id: "digital-property-starter-kit",
    name: "Digital Property Starter Kit",
    price: "Coming Soon",
    blurb:
      "Beginner step-by-step kit for claiming, structuring, and launching your first faceless digital asset.",
    forWho: "Coming soon to Gumroad store.",
    href: "#",
    badge: "In Development",
    isLive: false,
  },
  {
    id: "superpower-quiz",
    name: "Digital Superpower Quiz",
    price: "$0",
    blurb:
      "Find your unfair advantage. Discover your persona, get your personalized roadmap, and unlock your first three moves.",
    forWho: "You are at the start and need to know where you fit in the digital economy.",
    href: "/quiz",
    badge: "Free Funnel Start",
    isLive: true,
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

const styles = {
  wrap: { maxWidth: "960px", margin: "0 auto", padding: "clamp(2rem, 6vw, 3.5rem) 1.25rem 3rem" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" },
  eyebrow: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: theme.colors.orange,
    fontFamily: theme.fonts.heading,
    display: "block",
    marginBottom: "0.6rem",
  },
  title: {
    ...brutalHeading,
    fontSize: "clamp(1.9rem, 6vw, 3rem)",
    lineHeight: 1.08,
    margin: "0 0 0.9rem",
  },
  lede: {
    fontSize: "1.05rem",
    lineHeight: 1.65,
    color: theme.colors.textPrimary,
    margin: "0 0 1.75rem",
    maxWidth: "62ch",
  },
  quizCta: {
    display: "block",
    padding: "1.25rem 1.5rem",
    backgroundColor: theme.colors.panel,
    border: brutalBorder,
    marginBottom: "2.25rem",
  },
  quizCtaTitle: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: theme.colors.aquaBlue,
    fontFamily: theme.fonts.heading,
    margin: "0 0 0.5rem",
  },
  quizCtaText: { fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 1rem" },
  quizBtn: {
    display: "inline-block",
    padding: "0.8rem 1.4rem",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  grid: { display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" },
  card: {
    border: brutalBorder,
    backgroundColor: theme.colors.card,
    padding: "1.4rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: "0.62rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "0.2rem 0.45rem",
    backgroundColor: theme.colors.aquaBlue,
    color: "#111111",
    border: "1px solid #111111",
  },
  cardName: {
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "1.15rem",
    letterSpacing: "-0.02em",
    margin: 0,
  },
  price: {
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "1.4rem",
    margin: 0,
  },
  blurb: { fontSize: "0.92rem", lineHeight: 1.6, margin: 0, color: theme.colors.textPrimary },
  forWho: { fontSize: "0.83rem", lineHeight: 1.55, margin: 0, color: theme.colors.muted, fontStyle: "italic" },
  buy: {
    marginTop: "auto",
    display: "block",
    textAlign: "center",
    padding: "0.75rem 1.25rem",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "0.88rem",
    textDecoration: "none",
  },
  note: {
    marginTop: "2rem",
    fontSize: "0.8rem",
    color: theme.colors.muted,
    lineHeight: 1.6,
  },
};

export default function StorePage() {
  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <Logo />
        <a 
          href="/dashboard" 
          style={{ 
            fontSize: "0.8rem", 
            fontWeight: 800, 
            textTransform: "uppercase", 
            color: "#111111", 
            textDecoration: "none",
            border: brutalBorder,
            padding: "0.4rem 0.8rem",
            backgroundColor: "#ffffff"
          }}
        >
          OS Dashboard →
        </a>
      </div>

      <span style={styles.eyebrow}>DigitallyDefined Store</span>
      <h1 style={styles.title}>Build income with the hours you actually have.</h1>
      <p style={styles.lede}>
        Digital products for women building a business with limited energy,
        limited time, and no interest in hustle culture. Start free, buy the
        one that fits, and get told exactly what to do next.
      </p>

      <div style={styles.quizCta}>
        <p style={styles.quizCtaTitle}>Not sure where to start?</p>
        <p style={styles.quizCtaText}>
          Take the free Digital Superpower Quiz. Three minutes, and you get
          the business model that fits the way you work, your first three
          steps, and the asset to build first.
        </p>
        <a href="/quiz" style={styles.quizBtn}>
          Take the free quiz
        </a>
      </div>

      <div style={styles.grid}>
        {STORE_PRODUCTS.map((p) => (
          <div key={p.id} style={styles.card}>
            {p.badge && <span style={styles.badge}>{p.badge}</span>}
            <h2 style={styles.cardName}>{p.name}</h2>
            <p style={styles.price}>{p.price}</p>
            <p style={styles.blurb}>{p.blurb}</p>
            <p style={styles.forWho}>{p.forWho}</p>
            {p.isLive ? (
              <a href={p.href} style={styles.buy}>
                Get {p.name}
              </a>
            ) : (
              <span style={styles.disabledBuy}>In Architecture (Notion OS)</span>
            )}
          </div>
        ))}
      </div>

      {/* HTML Tools Profitability Scorecard */}
      <div style={styles.scorecardWrap}>
        <span style={{ ...styles.eyebrow, color: "#7c3aed" }}>AI Market Intelligence</span>
        <h2 style={{ fontFamily: theme.fonts.heading, fontWeight: 800, fontSize: "1.2rem", margin: "0.2rem 0 0 0", textTransform: "uppercase" }}>
          Interactive Tools Profitability Scorecard (1-10)
        </h2>
        <p style={{ fontSize: "0.85rem", color: theme.colors.muted, margin: "0.4rem 0 1rem 0" }}>
          AI-backed demand, competition, and conversion scoring for our standalone HTML utility tools.
        </p>

        <div style={{ overflowX: "auto" }}>
          <table style={styles.scorecardTable}>
            <thead>
              <tr>
                <th style={styles.th}>Tool Name</th>
                <th style={styles.th}>Profitability Score</th>
                <th style={styles.th}>Demand & Monetization Angle</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {STYLING_TOOLS_SCORECARD.map((tool, idx) => (
                <tr key={idx}>
                  <td style={{ ...styles.td, fontWeight: 700 }}>{tool.name}</td>
                  <td style={{ ...styles.td, fontWeight: 900, color: theme.colors.orange }}>{tool.profitability}</td>
                  <td style={{ ...styles.td, color: "#374151" }}>{tool.demand}</td>
                  <td style={{ ...styles.td }}>
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

      <p style={styles.note}>
        All purchases are securely processed via Gumroad. Need help?{" "}
        <a href="mailto:francesca@digitallydefined.agency" style={{ color: theme.colors.orange, fontWeight: 700 }}>
          francesca@digitallydefined.agency
        </a>
      </p>
    </div>
  );
}
