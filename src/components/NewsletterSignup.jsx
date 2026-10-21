import React, { useState } from "react";
import { callSupabaseEdge } from "../lib/supabase-edge";
import { brutalBorder, brutalHeading, theme } from "../theme";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function subscribe(e) {
    e.preventDefault();

    try {
      await callSupabaseEdge("subscribe", {
        email,
        source: "dashboard",
      });
      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error("Newsletter subscription error:", err);
      setStatus("error");
    }
  }

  return (
    <section
      style={{
        border: brutalBorder,
        backgroundColor: theme.colors.panel,
        padding: "1.5rem",
        margin: "1.5rem 0",
        maxWidth: 640,
      }}
    >
      <h3 style={{ ...brutalHeading, fontSize: "0.95rem", margin: "0 0 0.35rem" }}>
        Get the next playbook
      </h3>
      <p style={{ ...brutalHeading, fontSize: "0.8rem", fontWeight: 400, color: theme.colors.muted, margin: "0 0 0.85rem" }}>
        One email a week with a concrete move for your digital real estate. No noise.
      </p>

      <form onSubmit={subscribe} className="dd-signup-form" style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="dd-signup-input"
          required
          style={{
            flex: "1 1 220px",
            minWidth: 0,
            padding: "0.6rem 0.75rem",
            border: brutalBorder,
            borderRadius: 0,
            fontSize: "0.9rem",
            fontFamily: theme.fonts.body,
            backgroundColor: theme.colors.card,
            color: theme.colors.textPrimary,
          }}
        />
        <button
          type="submit"
          className="dd-signup-btn"
          style={{
            padding: "0.6rem 1.1rem",
            backgroundColor: theme.colors.orange,
            color: "#111111",
            border: brutalBorder,
            borderRadius: 0,
            fontSize: "0.85rem",
            fontFamily: theme.fonts.heading,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            cursor: "pointer",
          }}
        >
          Subscribe
        </button>
      </form>

      {status === "success" && (
        <p className="dd-success" style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.colors.success, margin: "0.75rem 0 0" }}>
          You&apos;re in! Welcome to the community.
        </p>
      )}
      {status === "error" && (
        <p className="dd-error" style={{ fontSize: "0.85rem", fontWeight: 700, color: theme.colors.danger, margin: "0.75rem 0 0" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </section>
  );
}
