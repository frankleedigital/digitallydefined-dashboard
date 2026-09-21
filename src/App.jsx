import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import CONFIG from "./config";
import DashboardPage from "./pages/DashboardPage";
import DigitalSuperpowerQuiz from "./pages/DigitalSuperpowerQuiz";
import AssistantPage from "./pages/AssistantPage";
import ThankYouCalculatorPage from "./pages/ThankYouCalculatorPage";
import IntelligencePage from "./pages/IntelligencePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatWidget from "./components/ChatWidget";
import ScrollProgress from "./components/ScrollProgress";
import LandingPage from "./pages/LandingPage";
import PremiumGate from "./components/PremiumGate";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";
import DebugAuth from "./pages/DebugAuth"; // TEMPORARY debug route — see /debug-auth

function App() {
  const hostname = window.location.hostname;
  const isDashboardDomain = hostname === "dashboard.digitallydefined.online";

  const homePage = isDashboardDomain ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <LandingPage />
  );

  return (
    <>
      <SpeedInsights />
      <ScrollProgress />

      {/* Show chat ONLY on the main site */}
      {!isDashboardDomain && <ChatWidget />}

      <Routes>
        <Route path="/" element={homePage} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* OAuth callback — now a no-op redirect, kept for backwards compatibility */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        {/* TEMPORARY: remove together with src/pages/DebugAuth.jsx */}
        <Route path="/debug-auth" element={<DebugAuth />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/quiz" element={<DigitalSuperpowerQuiz />} />
        <Route path="/automations" element={<AssistantPage />} />
        <Route path="/thank-you-calculator" element={<ThankYouCalculatorPage />} />
        <Route
          path="/intelligence"
          element={
            <PremiumGate feature="Intelligence">
              <IntelligencePage />
            </PremiumGate>
          }
        />

        {/* Live website analytics (AI Business Partner data source) */}
        {isDashboardDomain && (
          <Route path="/analytics" element={<AnalyticsPage />} />
        )}

        {/* AI Assistant Page (dashboard only) */}
        {isDashboardDomain && (
          <Route
            path="/assistant"
            element={
              <PremiumGate feature="AI Business Partner">
                <AssistantPage />
              </PremiumGate>
            }
          />
        )}

        <Route
          path="*"
          element={
            isDashboardDomain ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;