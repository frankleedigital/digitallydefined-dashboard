// src/components/ProtectedRoute.jsx
// Route guard for /dashboard and the other gated pages.
//
// The old guard redirected to /login whenever `currentUser` was null, which is
// also true for the milliseconds while the session is still being restored —
// that was the login loop. The guard now waits for auth initialization to
// finish (`loading`) and only then decides, logging every decision.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authLog } from "../supabase.js";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 1) Session still loading → never redirect. This covers:
  //    - a hard load / refresh of /dashboard (session restored from storage)
  //    - the OAuth return, until /auth/callback has finalized the session
  if (loading) {
    authLog("guard: waiting for the session to load", {
      path: location.pathname,
    });
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#FFFCF9", fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <LoadingSpinner />
        <p className="text-xs font-black uppercase tracking-widest text-[#5F5F5F]">
          Checking your session…
        </p>
      </div>
    );
  }

  // 2) Initialization finished and there is genuinely no session → /login,
  //    carrying the original destination so login can return the user here.
  if (!currentUser) {
    authLog("guard: no session after initialization → redirecting to /login", {
      path: location.pathname,
    });
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }

  // 3) Session exists → allow access.
  authLog("guard: session found → allowing access", {
    path: location.pathname,
    userId: currentUser.id,
  });
  return children;
}
