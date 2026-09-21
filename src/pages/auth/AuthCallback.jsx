// src/pages/auth/AuthCallback.jsx
// No-op redirect. Kept as a route so any stray OAuth return doesn't 404,
// but it no longer talks to Supabase at all — just sends the user to /dashboard.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#FFFCF9", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <p className="text-sm font-black uppercase tracking-widest text-[#5F5F5F]">
        Redirecting to dashboard…
      </p>
    </div>
  );
}
