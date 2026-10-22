// src/pages/quiz/QuizPage.jsx
// The Digital Superpower Quiz — the funnel's lead magnet.
//
// Flow: INTRO -> QUESTIONS -> RESULTS.
// The result is scored locally and rendered immediately. The email opt-in
// happens AFTER the result is on screen and is strictly best-effort: a slow
// or failing API can never strand the visitor on a blank page.

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizIntro from "../../components/quiz/QuizIntro.jsx";
import QuizQuestion from "../../components/quiz/QuizQuestion.jsx";
import QuizProgress from "../../components/quiz/QuizProgress.jsx";
import { QUESTIONS } from "../../lib/quiz/questions.js";
import { scoreQuiz } from "../../lib/quiz/scoring.js";

const STAGES = { INTRO: "intro", QUESTIONS: "questions" };
const RESULT_KEY = "dd-quiz-results";

export default function QuizPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(STAGES.INTRO);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = QUESTIONS[step];
  const selected = answers[question?.key];

  const scored = useMemo(() => scoreQuiz(answers), [answers]);

  function select(value) {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
  }

  function next() {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }
    // Last question: score locally, persist for the dashboard, then show the
    // result. No network call is awaited before the result renders.
    const result = scoreQuiz(answers);
    const payload = {
      answers,
      persona: result.persona,
      confidence: result.confidence,
      counts: result.counts,
      completedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(RESULT_KEY, JSON.stringify(payload));
    } catch {
      /* private mode — the result still renders */
    }
    navigate("/quiz/results", { state: payload });
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else setStage(STAGES.INTRO);
  }

  if (stage === STAGES.INTRO) {
    return <QuizIntro onStart={() => setStage(STAGES.QUESTIONS)} />;
  }

  return (
    <div>
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "1.5rem 1.25rem 0" }}>
        <QuizProgress current={step} total={QUESTIONS.length} />
      </div>
      <QuizQuestion
        question={question}
        selected={selected}
        onSelect={select}
        onNext={next}
        onBack={back}
        index={step}
        total={QUESTIONS.length}
      />
      {scored.persona && step === QUESTIONS.length - 1 && (
        <p
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            padding: "0 1.25rem 2rem",
            fontSize: "0.75rem",
            color: "#5F5F5F",
          }}
        >
          Your result is scored on this device — nothing is sent until you
          choose to add your email.
        </p>
      )}
    </div>
  );
}
