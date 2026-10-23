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
import NewsletterSignup from "./components/NewsletterSignup";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/auth/SignUp";
import AuthCallback from "./pages/auth/AuthCallback";
import QuizPage from "./pages/quiz/QuizPage";
import QuizResultsPage from "./pages/quiz/QuizResultsPage";
import OnboardingPage from "./pages/OnboardingPage";
import IntakeWizard from "./pages/IntakeWizard";
import ReviewCenter from "./pages/ReviewCenter";

// Where a visitor who lands on a non-dashboard host should go.
const PUBLIC_SITE = "https://francescaonline.gumroad.com/l/digital-business-os";

function App() {
  const hostname = window.location.hostname;
  const isDashboardDomain = hostname === "dashboard.digitallydefined.agency" || hostname === "dashboard.digitallydefined.online";

  // On the dashboard domain "/" is the dashboard. On any other host (Vercel
  // preview URLs) serve the public storefront instead, so a shared link goes
  // to the funnel rather than bouncing off to a checkout page.
  const homePage = isDashboardDomain ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/store" replace />
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
        {/* The Digital Superpower Quiz — the funnel's lead magnet.
            Served by this app so it works the moment the domain is pointed
            here; the result is scored on-device and delivered on screen, and
            the email opt-in is best-effort (it can never block the result).
            Move to store.digitallydefined.agency by adding that domain to
            this Vercel project and updating the CNAME. */}
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/results" element={<QuizResultsPage />} />
        {/* The storefront. The Gumroad profile shows no products, so this page
            is the shelf: what each product is, who it is for, and the price. */}
        <Route path="/onboarding" element={<OnboardingPage />} />
<Route path="/intake" element={<IntakeWizard />} />
<Route path="/review" element={<ReviewCenter />} />
        <Route path="/automations" element={<AssistantPage />} />
        <Route path="/thank-you-calculator" element={<ThankYouCalculatorPage />} />
        <Route
          path="/intelligence"
element={
    <ProtectedRoute>
      <PremiumGate feature="Intelligence">
        <IntelligencePage />
      </PremiumGate>
    </ProtectedRoute>
  }
        />

        {/* Live website analytics (AI Business Partner data source) */}
        {isDashboardDomain && (
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        )}

        {/* AI Assistant Page (dashboard only) */}
        {isDashboardDomain && (
          <Route
            path="/assistant"
element={
      <ProtectedRoute>
        <PremiumGate feature="AI Business Partner">
          <AssistantPage />
        </PremiumGate>
      </ProtectedRoute>
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

      {/* Email capture — available on every dashboard page. */}
      {isDashboardDomain && (
        <div style={{ width: "min(1100px, 100%)", margin: "0 auto", padding: "0 clamp(1.25rem, 5vw, 2.5rem) 2.5rem" }}>
          <NewsletterSignup />
        </div>
      )}
    </>
  );
}

export default App;