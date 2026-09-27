import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import DashboardPage from "./pages/DashboardPage";
import AssistantPage from "./pages/AssistantPage";
import ThankYouCalculatorPage from "./pages/ThankYouCalculatorPage";
import IntelligencePage from "./pages/IntelligencePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatWidget from "./components/ChatWidget";
import ScrollProgress from "./components/ScrollProgress";
import PremiumGate from "./components/PremiumGate";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";

// The public marketing site and quiz live in digitallydefined-online-local.
// The dashboard does not duplicate them — it links out. See the workspace
// audit: online-local is the single production website.
const PUBLIC_SITE = "https://digitallydefined.online";
const PUBLIC_QUIZ = `${PUBLIC_SITE}/quiz`;

function App() {
  const hostname = window.location.hostname;
  const isDashboardDomain = hostname === "dashboard.digitallydefined.online";

  // On the dashboard domain "/" is the dashboard. On any other host (Vercel
  // preview URLs) send the visitor to the real public site rather than
  // rendering a second, divergent copy of it.
  const homePage = isDashboardDomain ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to={PUBLIC_SITE} replace />
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
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Quiz is owned by the public site — redirect, do not reimplement. */}
        <Route path="/quiz" element={<Navigate to={PUBLIC_QUIZ} replace />} />
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