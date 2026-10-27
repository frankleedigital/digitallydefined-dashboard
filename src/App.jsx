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
import ProtectedRoute from "./components/ProtectedRoute";

// Quiz flow: the canonical quiz lives on the production public site at
// https://digitallydefined.store/quiz (NOT in this repo —
// digitallydefined-online-local was removed as legacy).
// The dashboard never reimplements the quiz; IntelligencePage reads the
// quiz result (`dd-quiz-results` in localStorage) and calls the backend
// `intelligence` action via digitallydefined-os-backend.
const PUBLIC_SITE = "https://digitallydefined.store";
const PUBLIC_QUIZ = `${PUBLIC_SITE}/quiz`;

function App() {
  const hostname = window.location.hostname;
  const isDashboardDomain = hostname === "dashboard.digitallydefined.agency" || hostname === "dashboard.digitallydefined.online";

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
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        {/* Quiz is owned by the production public site (https://digitallydefined.store/quiz).
            Redirect, do not reimplement. Replacement route documented in POST_CLEANUP_ARCHITECTURE.md. */}
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