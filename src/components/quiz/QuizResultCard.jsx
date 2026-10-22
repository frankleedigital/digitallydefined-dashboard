// src/components/quiz/QuizResultCard.jsx
// The payoff screen. This is the lead magnet delivering its value — the roadmap,
// the business model, and the first step, on screen, no email required.

import React from "react";
import { brutalBorder, brutalHeading, theme } from "../../theme";

const styles = {
  wrap: { maxWidth: "680px", margin: "0 auto", padding: "1.5rem 1.25rem 2.5rem" },
  eyebrow: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: theme.colors.orange,
    fontFamily: theme.fonts.heading,
    display: "block",
    marginBottom: "0.5rem",
  },
  title: {
    ...brutalHeading,
    fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)",
    lineHeight: 1.1,
    margin: "0 0 0.6rem",
  },
  tagline: {
    fontFamily: theme.fonts.heading,
    fontWeight: 700,
    fontStyle: "italic",
    fontSize: "1rem",
    color: theme.colors.aquaBlue,
    margin: "0 0 1rem",
  },
  description: {
    fontSize: "1rem",
    lineHeight: 1.65,
    margin: "0 0 1.5rem",
  },
  block: {
    border: brutalBorder,
    backgroundColor: theme.colors.panel,
    padding: "1.1rem 1.25rem",
    marginBottom: "1rem",
  },
  blockTitle: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: theme.colors.muted,
    fontFamily: theme.fonts.heading,
    margin: "0 0 0.75rem",
  },
  step: {
    display: "flex",
    gap: "0.75rem",
    padding: "0.5rem 0",
    borderBottom: "1px solid rgba(17,17,17,0.08)",
    fontSize: "0.95rem",
    lineHeight: 1.55,
  },
  stepLast: { borderBottom: "none" },
  stepNum: {
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    color: theme.colors.orange,
    minWidth: "1.2rem",
  },
  firstStep: {
    fontSize: "1rem",
    lineHeight: 1.6,
    fontWeight: 700,
    margin: 0,
  },
  pathItem: {
    fontSize: "0.92rem",
    lineHeight: 1.6,
    padding: "0.3rem 0",
    display: "flex",
    gap: "0.6rem",
  },
  pathTick: { color: theme.colors.orange, fontWeight: 800 },
  ctaRow: { display: "grid", gap: "0.65rem", marginTop: "1.5rem" },
  cta: {
    display: "block",
    textAlign: "center",
    padding: "0.95rem 1.5rem",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "0.95rem",
    textDecoration: "none",
    cursor: "pointer",
  },
  ctaSecondary: {
    display: "block",
    textAlign: "center",
    padding: "0.9rem 1.5rem",
    backgroundColor: theme.colors.card,
    color: theme.colors.textPrimary,
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.body,
    fontWeight: 700,
    fontSize: "0.9rem",
    textDecoration: "none",
  },
  fine: {
    fontSize: "0.75rem",
    color: theme.colors.muted,
    marginTop: "1rem",
    lineHeight: 1.55,
  },
};

export default function QuizResultCard({ persona, confidence, onRestart }) {
  if (!persona) return null;

  const steps = Array.isArray(persona.steps) ? persona.steps : [];

  return (
    <div style={styles.wrap}>
      <span style={styles.eyebrow}>Your result</span>
      <h1 style={styles.title}>{persona.title}</h1>
      {persona.tagline && <p style={styles.tagline}>{persona.tagline}</p>}
      <p style={styles.description}>{persona.description}</p>

      {persona.recommendedFirstStep && (
        <div style={styles.block}>
          <p style={styles.blockTitle}>Your first move</p>
          <p style={styles.firstStep}>{persona.recommendedFirstStep}</p>
        </div>
      )}

      {persona.businessModel && (
        <div style={styles.block}>
          <p style={styles.blockTitle}>Your business model</p>
          <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6 }}>{persona.businessModel}</p>
        </div>
      )}

      {steps.length > 0 && (
        <div style={styles.block}>
          <p style={styles.blockTitle}>Your roadmap</p>
          {steps.map((step, i) => (
            <p key={step + i} style={{ ...styles.step, ...(i === steps.length - 1 ? styles.stepLast : null) }}>
              <span style={styles.stepNum}>{i + 1}</span>
              <span>{step}</span>
            </p>
          ))}
        </div>
      )}

      {Array.isArray(persona.recommendedPathways) && persona.recommendedPathways.length > 0 && (
        <div style={styles.block}>
          <p style={styles.blockTitle}>Ways to take it further</p>
          {persona.recommendedPathways.map((p) => (
            <p key={p} style={styles.pathItem}>
              <span style={styles.pathTick}>→</span>
              <span>{p}</span>
            </p>
          ))}
        </div>
      )}

      <div style={styles.ctaRow}>
        <a
          href="https://francescaonline.gumroad.com/l/digital-business-os"
          style={styles.cta}
        >
          Get the full Digital Business OS
        </a>
        <a
          href="https://dashboard.digitallydefined.agency/dashboard"
          style={styles.ctaSecondary}
        >
          Open my dashboard
        </a>
        {onRestart && (
          <a href="/quiz" onClick={onRestart} style={styles.ctaSecondary}>
            Retake the quiz
          </a>
        )}
      </div>

      {typeof confidence === "number" && confidence > 0 && (
        <p style={styles.fine}>
          Your answers pointed {Math.round(confidence * 100)}% toward this path.
          {" "}Your roadmap and first three steps are also in your inbox if you
          added an email.
        </p>
      )}
    </div>
  );
}
