// src/components/quiz/QuizEmailCapture.jsx
// Email opt-in. Optional by design — the result renders whether or not this
// succeeds, so a slow or failing API can never strand the visitor.

import React, { useState } from "react";
import { brutalBorder, theme } from "../../theme";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = {
  wrap: { maxWidth: "520px", margin: "0 auto", padding: "1.5rem 1.25rem" },
  title: {
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "clamp(1.25rem, 5vw, 1.6rem)",
    letterSpacing: "-0.02em",
    margin: "0 0 0.6rem",
  },
  sub: {
    fontSize: "0.95rem",
    lineHeight: 1.6,
    color: theme.colors.textPrimary,
    margin: "0 0 1.25rem",
  },
  field: { display: "grid", gap: "0.5rem", marginBottom: "1rem" },
  label: {
    fontSize: "0.68rem",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: theme.colors.muted,
    marginBottom: "0.3rem",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "0.8rem 0.9rem",
    border: brutalBorder,
    borderRadius: 0,
    fontSize: "1rem",
    fontFamily: theme.fonts.body,
    backgroundColor: theme.colors.card,
    color: theme.colors.textPrimary,
  },
  error: {
    fontSize: "0.8rem",
    fontWeight: 700,
    color: theme.colors.danger,
    margin: "0 0 0.75rem",
  },
  cta: {
    width: "100%",
    padding: "0.95rem 1.5rem",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
  },
  ctaDisabled: { opacity: 0.5, cursor: "not-allowed" },
  skip: {
    display: "block",
    width: "100%",
    marginTop: "0.75rem",
    padding: "0.7rem",
    backgroundColor: "transparent",
    color: theme.colors.muted,
    border: "none",
    fontFamily: theme.fonts.body,
    fontSize: "0.85rem",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default function QuizEmailCapture({ onSubmit, onSkip, submitting, error }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const valid = EMAIL_RE.test(email.trim());

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({ name: name.trim(), email: email.trim().toLowerCase() });
  }

  return (
    <form onSubmit={handleSubmit} style={styles.wrap} noValidate>
      <h2 style={styles.title}>Where should we send your roadmap?</h2>
      <p style={styles.sub}>
        We will email your personalised roadmap, your first three steps, and the
        asset we recommend for your business model. One email now, one useful
        email a week.
      </p>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="quiz-name">First name (optional)</label>
        <input
          id="quiz-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Francesca"
          style={styles.input}
          autoComplete="given-name"
        />
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="quiz-email">Email address</label>
        <input
          id="quiz-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={styles.input}
          autoComplete="email"
          inputMode="email"
        />
        {touched && !valid && (
          <p style={styles.error}>Please enter a valid email address.</p>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" disabled={submitting} style={{ ...styles.cta, ...(submitting ? styles.ctaDisabled : null) }}>
        {submitting ? "Building your roadmap…" : "Send me my roadmap"}
      </button>

      {onSkip && (
        <button type="button" onClick={onSkip} style={styles.skip}>
          No thanks — show me my result
        </button>
      )}
    </form>
  );
}
