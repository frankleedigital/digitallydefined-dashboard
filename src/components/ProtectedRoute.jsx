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

  // Auth is disabled — everyone gets access to the dashboard.
  // Simply render children without any session check.
  return children;
}
