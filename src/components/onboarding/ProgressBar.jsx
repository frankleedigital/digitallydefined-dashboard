import React from "react";
import { useOnboarding } from "../../context/OnboardingContext";

export default function ProgressBar() {
  const { step, steps } = useOnboarding();
  const pct = Math.round(((step + 1) / steps.length) * 100);
  return (
    <div style={{ width: "100%", height: 8, background: "#eee", borderRadius: 0, border: "1px solid #1F2937" }}>
      <div style={{ width: pct + "%", height: "100%", background: "#F18B25" }} />
    </div>
  );
}
