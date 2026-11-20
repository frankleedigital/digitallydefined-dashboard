// src/components/quiz/QuizQuestion.jsx
// One question per screen. Big tap targets, no horizontal scrolling on mobile.

import React from "react";
import { brutalBorder, brutalHeading, theme } from "../../theme";

const styles = {
  wrap: { maxWidth: "640px", margin: "0 auto", padding: "1.5rem 1.25rem" },
  question: {
    ...brutalHeading,
    fontSize: "clamp(1.15rem, 4.5vw, 1.5rem)",
    lineHeight: 1.25,
    margin: "0 0 1.25rem",
  },
  options: { display: "grid", gap: "0.6rem", marginBottom: "1.5rem" },
  option: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "0.9rem 1rem",
    border: brutalBorder,
    borderRadius: 0,
    backgroundColor: theme.colors.card,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
    fontSize: "0.95rem",
    lineHeight: 1.5,
    cursor: "pointer",
  },
  optionSelected: {
    backgroundColor: theme.colors.orange,
    color: "#111111",
    fontWeight: 700,
  },
  actions: { display: "flex", gap: "0.75rem", flexWrap: "wrap" },
  next: {
    flex: "1 1 200px",
    padding: "0.85rem 1.5rem",
    backgroundColor: theme.colors.orange,
    color: "#111111",
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.heading,
    fontWeight: 800,
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  nextDisabled: { opacity: 0.45, cursor: "not-allowed" },
  back: {
    padding: "0.85rem 1.25rem",
    backgroundColor: theme.colors.card,
    color: theme.colors.textPrimary,
    border: brutalBorder,
    borderRadius: 0,
    fontFamily: theme.fonts.body,
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default function QuizQuestion({ question, selected, onSelect, onNext, onBack, index, total }) {
  if (!question) return null;
  const isLast = index === total - 1;

  return (
    <div style={styles.wrap}>
      <h2 style={styles.question}>{question.label}</h2>

      <div style={styles.options} role="radiogroup" aria-label={question.label}>
        {question.options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(option.value)}
              style={{
                ...styles.option,
                ...(isSelected ? styles.optionSelected : null),
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div style={styles.actions}>
        {index > 0 && (
          <button type="button" onClick={onBack} style={styles.back}>
            Back
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          style={{
            ...styles.next,
            ...(!selected ? styles.nextDisabled : null),
          }}
        >
          {isLast ? "See my result" : "Next"}
        </button>
      </div>
    </div>
  );
}
