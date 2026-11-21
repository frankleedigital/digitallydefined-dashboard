// src/pages/StorePage.jsx
// The public storefront for digitallydefined.store
// Displays ONLY live, verified Gumroad products with the DigitallyDefined brand logo/header.

import React from "react";
import { brutalBorder, brutalHeading, theme } from "../theme";
import Logo from "../components/Logo";

const LIVE_STORE_PRODUCTS = [
  {
    id: "legacy-os",
    name: "The Legacy OS Bundle",
    price: "$297",
    blurb:
      "Financial Autonomy Planner, Caregiver's Survival Kit & Legacy Command Center. The complete setup for Gen X women building permanent digital wealth.",
    forWho: "You want the flagship suite for long-term legacy and financial security.",
    href: "https://legacyos.digitallydefined.store",
    badge: "Flagship Bundle",
  },
  {
    id: "digital-business-os",
    name: "Digital Business OS",
    price: "$49 - $197",
    blurb:
      "The complete operating system for running a faceless digital real estate business on Notion.",
    forWho: "You want to organize your entire digital asset portfolio in one place.",
    href: "https://shop.digitallydefined.store/l/digital-business-os",
    badge: "Live on Gumroad",
  },
  {
    id: "digital-property-starter-kit",
    name: "Digital Property Starter Kit",
    price: "$17",
    blurb:
      "Beginner step-by-step kit for claiming, structuring, and launching your first faceless digital asset.",
    forWho: "You are starting out and need a low-friction entry point.",
    href: "https://shop.digitallydefined.store/l/ycaru",
    badge: "Starter Kit",
  },
  {
    id: "local-seo-checklist",
    name: "Local SEO Quick-Start Checklist",
    price: "FREE ($0)",
    blurb:
      "High-converting free checklist that captures emails and funnels into the Digital Business OS.",
    forWho: "You want an instant free framework to audit your search footprint.",
    href: "https://shop.digitallydefined.store/l/noodsi",
    badge: "Free Download",
  },
  {
    id: "superpower-quiz",
    name: "Digital Superpower Quiz",
    price: "$0",
    blurb:
      "Find your unfair advantage. Discover your persona, get your personalized roadmap, and unlock your first three moves.",
    forWho: "You are at the start and need to know where you fit in the digital economy.",
    href: "/quiz",
    badge: "Start Here",
  },
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
        {LIVE_STORE_PRODUCTS.map((p) => (
          <div key={p.id} style={styles.card}>
            {p.badge && <span style={styles.badge}>{p.badge}</span>}
            <h2 style={styles.cardName}>{p.name}</h2>
            <p style={styles.price}>{p.price}</p>
            <p style={styles.blurb}>{p.blurb}</p>
            <p style={styles.forWho}>{p.forWho}</p>
            <a href={p.href} style={styles.buy}>
              Get {p.name}
            </a>
          </div>
        ))}
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
