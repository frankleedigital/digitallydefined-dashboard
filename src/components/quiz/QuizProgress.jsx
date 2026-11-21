// src/components/quiz/QuizProgress.jsx
// Progress bar for the quiz. One question per screen, mobile-first.

import React from "react";
import { theme } from "../../theme";

export default function QuizProgress({ current, total }) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: theme.colors.muted,
          marginBottom: "0.45rem",
        }}
      >
        <span>
          Question {current + 1} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div
        style={{
          height: "6px",
          backgroundColor: theme.colors.panel,
          border: "1px solid #111111",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: theme.colors.orange,
            transition: "width 0.25s ease",
          }}
        />
      </div>
    </div>
  );
}
