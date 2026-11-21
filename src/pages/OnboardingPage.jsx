import React from "react";
import { useOnboarding } from "../context/OnboardingContext";
import ProgressBar from "../components/onboarding/ProgressBar";
import EmptyState from "../components/onboarding/EmptyState";

export default function OnboardingPage() {
  const { step, steps, next, prev } = useOnboarding();
  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>Onboarding — {steps[step]}</h1>
      <ProgressBar />
      <div style={{ marginTop: "2rem" }}>
        <EmptyState message={`Step: ${steps[step]}. Content coming soon.`} />
      </div>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={prev}>Back</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}
