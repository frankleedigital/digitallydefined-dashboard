import React, { createContext, useContext, useState, useEffect } from "react";

const OnboardingContext = createContext();
const STEPS = ["score", "start", "ideas", "choose", "build", "portfolio", "money", "monthly"];

export function OnboardingProvider({ children }) {
  const [step, setStep] = useState(() => Number(localStorage.getItem("onboarding.step") || 0));
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("onboarding.completed") || "[]"));
  useEffect(() => { localStorage.setItem("onboarding.step", step); }, [step]);
  useEffect(() => { localStorage.setItem("onboarding.completed", JSON.stringify(completed)); }, [completed]);
  const complete = (s) => setCompleted((c) => (c.includes(s) ? c : [...c, s]));
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  return (
    <OnboardingContext.Provider value={{ step, steps: STEPS, completed, complete, next, prev, setStep }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() { return useContext(OnboardingContext); }
