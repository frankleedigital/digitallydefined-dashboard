// src/components/quiz/QuizPersonaOfferCard.jsx
// Displays the high-converting first purchase uniquely tailored to the quiz persona.
// Directly addresses the persona's core needs with an instant Gumroad checkout CTA.

import React from "react";
import { brutalBorder, brutalHeading, theme } from "../../theme";
import { ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

const PERSONA_OFFERS = {
  builder: {
    badge: "Recommended First Step · The Builder",
    productName: "Digital Business OS (Notion Edition)",
    price: "$27",
    regularPrice: "$97",
    headline: "The Complete Operating System for Your Faceless Real Estate",
    description:
      "A complete, pre-built Notion workspace that organizes every digital property, SOP, workflow, and metric in one place. Built specifically to run on autopilot even on days you're offline.",
    bullets: [
      "8 Canonical Notion OS Databases (Assets, Ideas, Money, Automations)",
      "Pre-built SOP library for local rank-and-rent & digital property flips",
      "Automated asset tracking and monthly cash flow forecasting",
      "One-click duplicate into your personal Notion workspace",
    ],
    ctaText: "Claim Your Digital Business OS ($27)",
    gumroadUrl: "https://francescaonline.gumroad.com/l/digital-business-os",
    guarantee: "Instant digital delivery via Gumroad. Works with free Notion accounts.",
  },

  creator: {
    badge: "Recommended First Step · The Creator",
    productName: "50 AI Prompts Pack & Faceless Content Engine",
    price: "$27",
    regularPrice: "$67",
    headline: "Create High-Demand Digital Products & Content in Minutes",
    description:
      "50 precision-crafted AI prompts engineered for Gen X women to build, write, and launch faceless digital products, lead magnets, and newsletters without ever being on camera.",
    bullets: [
      "50 battle-tested prompts for high-converting digital products",
      "Faceless content repurposing pipeline (1 idea → 10 assets)",
      "High-Demand, Low-Supply niche validation frameworks",
      "Plug-and-play templates for Claude, ChatGPT, and Gemini",
    ],
    ctaText: "Get the 50 AI Prompts Pack ($27)",
    gumroadUrl: "https://francescaonline.gumroad.com/l/digital-business-os",
    guarantee: "Instant PDF & interactive HTML browser delivery via Gumroad.",
  },

  educator: {
    badge: "Recommended First Step · The Educator",
    productName: "Retirement Mastery & Financial Freedom Hub",
    price: "$17",
    regularPrice: "$47",
    headline: "The Step-by-Step Digital Asset Cash Flow Blueprint",
    description:
      "A 2-part strategy guide and financial calculation hub specifically engineered for Gen X women starting after 45 to close their retirement gap through faceless digital real estate.",
    bullets: [
      "2-Part Ebook & Execution Roadmap for digital asset cash flow",
      "Freedom Number Calculator framework (know your exact exit number)",
      "Low-risk catch-up playbook tailored to women starting over",
      "Checklists and execution templates you can follow step-by-step",
    ],
    ctaText: "Get Retirement Mastery ($17)",
    gumroadUrl: "https://lavignefrancesca.gumroad.com/l/ycaru",
    guarantee: "Instant digital access via Gumroad. 100% self-paced.",
  },

  strategist: {
    badge: "Recommended First Step · The Strategist",
    productName: "Unfiltered Balance Sheet & Niche Viability Suite",
    price: "$27",
    regularPrice: "$77",
    headline: "The No-Fluff Digital Asset Truth Machine & Niche Audit",
    description:
      "Total financial clarity before you build. Calculate your true net worth trajectory and score your niche viability in 60 seconds before spending a dollar on domains or hosting.",
    bullets: [
      "Interactive Unfiltered Balance Sheet calculator",
      "60-Second Niche Viability Scoring Model (Excel & Interactive)",
      "Digital Asset Payback & 10X ROI projection frameworks",
      "Decision checklists that eliminate guesswork and wasted effort",
    ],
    ctaText: "Get the Strategy & Balance Sheet Suite ($27)",
    gumroadUrl: "https://francescaonline.gumroad.com/l/digital-business-os",
    guarantee: "Instant download & tool access via Gumroad secure checkout.",
  },

  connector: {
    badge: "Recommended First Step · The Connector",
    productName: "High-Ticket Affiliate Blueprint for Gen X Women",
    price: "$27",
    regularPrice: "$67",
    headline: "Monetize Community Trust Without Showing Your Face",
    description:
      "The exact blueprint to recommend high-value software and business services that pay $100–$500 per sale, turning genuine helpfulness into recurring commissions on autopilot.",
    bullets: [
      "Curated directory of 36 high-paying, vetted affiliate programs",
      "Trust-first email and social templates that don't feel salesy",
      "Step-by-step setup for faceless recommendation funnels",
      "Automated follow-up sequences that convert over time",
    ],
    ctaText: "Get the High-Ticket Blueprint ($27)",
    gumroadUrl: "https://lavignefrancesca.gumroad.com/l/ycaru",
    guarantee: "Instant digital delivery via Gumroad. Lifetime access.",
  },
};

const styles = {
  container: {
    maxWidth: "680px",
    margin: "0 auto 2.5rem",
    padding: "0 1.25rem",
  },
  card: {
    border: `2px solid #111111`,
    backgroundColor: "#FFFFFF",
    padding: "1.75rem 1.5rem",
    boxShadow: "4px 4px 0px #111111",
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  },
  badge: {
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    padding: "0.3rem 0.65rem",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
  },
  pricing: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.5rem",
  },
  priceCurrent: {
    fontSize: "1.6rem",
    fontWeight: 900,
    color: "#111111",
    fontFamily: theme.fonts.heading,
  },
  priceRegular: {
    fontSize: "0.95rem",
    color: "#888888",
    textDecoration: "line-through",
  },
  title: {
    ...brutalHeading,
    fontSize: "1.35rem",
    lineHeight: 1.25,
    margin: "0 0 0.5rem",
  },
  headline: {
    fontSize: "1rem",
    fontWeight: 700,
    color: theme.colors.aquaBlue,
    margin: "0 0 0.75rem",
  },
  description: {
    fontSize: "0.93rem",
    lineHeight: 1.6,
    color: "#333333",
    margin: "0 0 1.25rem",
  },
  bulletsList: {
    borderTop: "1px solid #EEEEEE",
    borderBottom: "1px solid #EEEEEE",
    padding: "1rem 0",
    marginBottom: "1.5rem",
    display: "grid",
    gap: "0.6rem",
  },
  bulletItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.6rem",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    color: "#222222",
  },
  bulletIcon: {
    color: theme.colors.orange,
    flexShrink: 0,
    marginTop: "2px",
  },
  ctaButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    width: "100%",
    padding: "1rem 1.5rem",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    border: "2px solid #111111",
    boxShadow: "3px 3px 0px #111111",
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "1.05rem",
    textDecoration: "none",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.1s ease, box-shadow 0.1s ease",
  },
  guaranteeText: {
    fontSize: "0.78rem",
    color: "#666666",
    textAlign: "center",
    marginTop: "0.85rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.35rem",
  },
};

export default function QuizPersonaOfferCard({ personaKey }) {
  const offer = PERSONA_OFFERS[personaKey] || PERSONA_OFFERS.builder;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badgeRow}>
          <span style={styles.badge}>
            <Zap size={13} /> {offer.badge}
          </span>
          <div style={styles.pricing}>
            <span style={styles.priceCurrent}>{offer.price}</span>
            <span style={styles.priceRegular}>{offer.regularPrice}</span>
          </div>
        </div>

        <h3 style={styles.title}>{offer.productName}</h3>
        <p style={styles.headline}>{offer.headline}</p>
        <p style={styles.description}>{offer.description}</p>

        <div style={styles.bulletsList}>
          {offer.bullets.map((bullet, idx) => (
            <div key={idx} style={styles.bulletItem}>
              <CheckCircle2 size={16} style={styles.bulletIcon} />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        <a
          href={offer.gumroadUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.ctaButton}
        >
          <ShoppingBag size={18} />
          <span>{offer.ctaText}</span>
          <ArrowRight size={18} />
        </a>

        <div style={styles.guaranteeText}>
          <ShieldCheck size={14} color="#2E7D32" />
          <span>{offer.guarantee}</span>
        </div>
      </div>
    </div>
  );
}
