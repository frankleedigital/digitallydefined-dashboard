// src/pages/quiz/QuizResultsPage.jsx
// The payoff screen: the roadmap is delivered on screen, first.
//
// The email opt-in sits BELOW the result and is best-effort. Submitting it
// captures the contact (Brevo) with the persona, persists the quiz and sends
// the roadmap email. If any of that fails, the visitor still has their
// roadmap — we just say so quietly.

import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import QuizResultCard from "../../components/quiz/QuizResultCard.jsx";
import QuizEmailCapture from "../../components/quiz/QuizEmailCapture.jsx";
import { getPersona } from "../../lib/quiz/personas.js";
import api from "../../services/api";

const RESULT_KEY = "dd-quiz-results";

export default function QuizResultsPage() {
  const location = useLocation();
  const [state] = useState(location.state || null);
  const [stored] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RESULT_KEY) || "null");
    } catch {
      return null;
    }
  });

  const payload = state || stored;

  const persona = useMemo(() => {
    if (!payload?.persona) return null;
    const base = getPersona(payload.persona);
    return {
      ...base,
      steps: base.recommendedPathways || [],
    };
  }, [payload]);

  const [email, setEmail] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!payload) {
      // No result in state or storage — send them back to the start.
      window.location.replace("/quiz");
    }
  }, [payload]);

  async function handleSubmit({ name, email: address }) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post("quiz.submit", {
        answers: payload.answers || {},
        persona: payload.persona,
        name,
        email: address,
        source: "digital-superpower-quiz",
        mode: "freeMode",
      });
      setEmail(address);
      setSent(true);
    } catch (err) {
      // Never block the result on this. The roadmap is already on screen.
      setSubmitError(
        "We could not save that just now — your roadmap above is already yours. Try again later if you want it emailed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!persona) return null;

  return (
    <div>
      <QuizResultCard persona={persona} confidence={payload.confidence} />

      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "0 1.25rem 3rem",
        }}
      >
        {sent ? (
          <div
            style={{
              border: "1px solid #111111",
              backgroundColor: "#FFFFFF",
              padding: "1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#47B7D4",
                margin: "0 0 0.5rem",
              }}
            >
              On its way
            </p>
            <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.6 }}>
              Your roadmap is on its way to <strong>{email}</strong>. Check your
              inbox for the next three moves, and expect one useful email a
              week — no noise.
            </p>
          </div>
        ) : (
          <QuizEmailCapture
            onSubmit={handleSubmit}
            submitting={submitting}
            error={submitError}
          />
        )}
      </div>
    </div>
  );
}
