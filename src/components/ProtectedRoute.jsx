import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AUTHORIZED_EMAIL = "francesca@digitallydefined.online";

export default function ProtectedRoute({ children }) {
  const { session, currentUser, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading…</div>;
  }
  if (!session || !currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.email !== AUTHORIZED_EMAIL) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
