// src/components/quiz/QuizIntro.jsx
// Landing screen for the Digital Superpower Quiz (the funnel's lead magnet).
// Mobile-first: this is the first thing a stranger sees, often on a phone.

import React from "react";
import { brutalBorder, brutalHeading, theme } from "../../theme";

const styles = {
  wrap: {
    maxWidth: "640px",
    margin: "0 auto",
    padding: "clamp(1.5rem, 5vw, 3rem) 1.25rem",
  },
  eyebrow: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: theme.colors.orange,
    fontFamily: theme.fonts.heading,
    display: "block",
    marginBottom: "0.75rem",
  },
  title: {
    ...brutalHeading,
    fontSize: "clamp(1.75rem, 6vw, 2.75rem)",
    lineHeight: 1.1,
    margin: "0 0 1rem",
  },
  lede: {
    fontSize: "1.05rem",
    lineHeight: 1.65,
    color: theme.colors.textPrimary,
    margin: "0 0 1.25rem",
  },
  meta: {
    fontSize: "0.85rem",
    lineHeight: 1.6,
    color: theme.colors.muted,
    margin: "0 0 1.75rem",
  },
  promise: {
    border: brutalBorder,
    backgroundColor: theme.colors.panel,
    padding: "1rem 1.25rem",
    marginBottom: "1.75rem",
  },
  promiseTitle: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: theme.colors.aquaBlue,
    fontFamily: theme.fonts.heading,
    margin: "0 0 0.6rem",
  },
  promiseItem: {
    fontSize: "0.9rem",
    lineHeight: 1.6,
    padding: "0.3rem 0",
    display: "flex",
    gap: "0.6rem",
  },
  tick: { color: theme.colors.orange, fontWeight: 800 },
  cta: {
    display: "block",
    width: "100%",
    padding: "1rem 1.5rem",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "1rem",
    letterSpacing: "-0.01em",
    cursor: "pointer",
  },
  fine: {
    fontSize: "0.75rem",
    color: theme.colors.muted,
    marginTop: "0.9rem",
    lineHeight: 1.5,
  },
};

export default function QuizIntro({ onStart }) {
  return (
    <div style={styles.wrap}>
      <span style={styles.eyebrow}>Free · 3 minutes</span>
      <h1 style={styles.title}>
        Find the business model that fits the energy you actually have.
      </h1>
      <p style={styles.lede}>
        Seven questions. No signup to start. You get the business model, the first
        three steps, and the asset to build first — for the way you work, not the
        way someone with more hours works.
      </p>

      <div style={styles.promise}>
        <p style={styles.promiseTitle}>You will walk away with</p>
        {[
          "Your business model — what to sell and how it earns",
          "Your first three steps, in the order that actually works",
          "The one asset to build first (and the ones to ignore for now)",
        ].map((item) => (
          <p key={item} style={styles.promiseItem}>
            <span style={styles.tick}>→</span>
            <span>{item}</span>
          </p>
        ))}
      </div>

      <button type="button" onClick={onStart} style={styles.cta}>
        Start the quiz
      </button>
      <p style={styles.fine}>
        Free. No credit card. We will ask for your email at the end so we can
        send the roadmap — you can skip that and still see everything.
      </p>
    </div>
  );
}
