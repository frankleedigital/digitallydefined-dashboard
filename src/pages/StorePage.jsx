// src/pages/StorePage.jsx
// The storefront.
//
// The Gumroad storefront profile currently shows no products, so a visitor who
// lands there sees an empty shop. This page is the shelf: every product, what
// it is for, who it is for, and the price — with a link to buy.
//
// It also carries the entry point to the free quiz, which is the top of the
// funnel: quiz -> email -> segmented offer.

import React from "react";
import { brutalBorder, brutalHeading, theme } from "../theme";

const PRODUCTS = [
  {
    id: "digital-business-os",
    name: "Digital Business OS",
    price: "$27",
    blurb:
      "The full AI business partner: a plan built from your quiz result, a 90-day roadmap, and your next three moves every morning.",
    forWho: "You know what you want to sell but not what to do next.",
    href: "https://francescaonline.gumroad.com/l/digital-business-os",
    badge: "Most popular",
  },
  {
    id: "annual-financial-dashboard",
    name: "Annual Financial Dashboard",
    price: "$17",
    blurb:
      "Track what your business actually earns, what it costs to run, and what your net position is — for the next 12 months.",
    forWho: "You are making money and cannot see the whole picture.",
    href: "https://lavignefrancesca.gumroad.com/l/ycaru",
  },
  {
    id: "free-starter",
    name: "Free Starter",
    price: "$0",
    blurb:
      "The Digital Business OS free tier: the quiz, your business model, your first three moves, and one useful email a week.",
    forWho: "You are not ready to buy anything, and you should not have to be.",
    href: "https://lavignefrancesca.gumroad.com/l/noodsi",
    badge: "Start here",
  },
];

const styles = {
  wrap: { maxWidth: "960px", margin: "0 auto", padding: "clamp(2rem, 6vw, 3.5rem) 1.25rem 3rem" },
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
      <span style={styles.eyebrow}>DigitallyDefined</span>
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
        {PRODUCTS.map((p) => (
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
        Buying the OS gives you a Gumroad license key. Paste it into the
        dashboard and the premium features unlock. Need help?{" "}
        <a href="mailto:francesca@digitallydefined.agency" style={{ color: theme.colors.orange, fontWeight: 700 }}>
          francesca@digitallydefined.agency
        </a>
      </p>
    </div>
  );
}
