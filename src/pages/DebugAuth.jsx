// src/pages/DebugAuth.jsx
// TEMPORARY debug route (/debug-auth).
//
// Shows exactly what the Supabase client sees: config, live session, decoded
// user, and the stored session keys. Purpose-built to confirm that a session
// actually persists after sign-in and after a dashboard refresh.
//
// Remove this file and its route in src/App.jsx once the login loop is closed.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, authLog, describeSupabaseConfig, getActualOAuthRedirectTo } from "../supabase.js";
import { useAuth } from "../context/AuthContext";

function Row({ label, value }) {
  return (
    <div className="flex gap-3 border-b border-[#E5E7EB] py-2 text-sm">
      <span className="w-56 shrink-0 font-black uppercase tracking-widest text-[#111111]">{label}</span>
      <span className="break-all text-[#5F5F5F]">{value}</span>
    </div>
  );
}

function JsonBlock({ title, data }) {
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-xs font-black uppercase tracking-widest text-[#111111]">{title}</h2>
      <pre
        className="overflow-x-auto border-2 border-[#111111] bg-white p-4 text-xs leading-relaxed text-[#111111]"
        style={{ borderRadius: 0 }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export default function DebugAuth() {
  const { session, currentUser, loading } = useAuth();
  const [checkedAt, setCheckedAt] = useState(null);
  const [liveSession, setLiveSession] = useState(null);
  const [storageEntries, setStorageEntries] = useState([]);
  const [error, setError] = useState(null);

  async function refresh() {
    authLog("debug-auth: reading live session");
    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
        authError("debug-auth getSession failed:", sessionError.message);
      } else {
        setError(null);
        setLiveSession(data.session);
        setCheckedAt(new Date().toISOString());
      }

      const entries = [];
      for (let i = 0; i < window.localStorage.length; i += 1) {
        const key = window.localStorage.key(i);
        if (!key) continue;
        const value = window.localStorage.getItem(key) || "";
        entries.push({
          key,
          preview: key.includes("auth") ? `${value.slice(0, 40)}… (${value.length} chars)` : value.slice(0, 40),
        });
      }
      setStorageEntries(entries);
    } catch (err) {
      setError(err?.message || String(err));
    }
  }

  useEffect(() => {
    refresh();
  }, [session, currentUser]);

  const config = describeSupabaseConfig();
  const expiresAt = liveSession?.expires_at
    ? new Date(liveSession.expires_at * 1000).toISOString()
    : null;

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ background: "#FFFCF9", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 border-2 border-[#F18B25] bg-white p-4" style={{ borderRadius: 0 }}>
          <p className="text-xs font-black uppercase tracking-widest text-[#F18B25]">Temporary debug route</p>
          <h1 className="mt-1 text-2xl font-black tracking-wider text-[#111111]">/debug-auth</h1>
          <p className="mt-1 text-sm text-[#5F5F5F]">
            Live view of the auth session. Remove <code>src/pages/DebugAuth.jsx</code> and its route
            in <code>src/App.jsx</code> once the login loop is confirmed fixed.
          </p>
        </div>

        <div className="border-2 border-[#111111] bg-white p-6" style={{ borderRadius: 0 }}>
          <Row label="auth context" value={loading ? "loading…" : "ready"} />
          <Row label="current user id" value={currentUser?.id || "(none)"} />
          <Row label="current user email" value={currentUser?.email || "(none)"} />
          <Row label="live session" value={liveSession ? "present" : "(none)"} />
          <Row label="session expires at" value={expiresAt || "(n/a)"} />
          <Row label="checked at" value={checkedAt || "(never)"} />
          <Row label="supabase url" value={config.url} />
          <Row label="anon key" value={config.anonKeyPresent ? config.anonKeyPreview : "(missing)"} />
          <Row
            label="oauth redirect sent to supabase"
            value={getActualOAuthRedirectTo()}
          />
          <Row label="config issues" value={config.issues.length ? config.issues.join(" | ") : "none"} />
          {error ? <Row label="last error" value={error} /> : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={refresh}
              className="border-2 border-[#111111] bg-[#F18B25] px-5 py-3 text-sm font-black uppercase tracking-widest text-[#111111]"
              style={{ borderRadius: 0 }}
            >
              Re-check session
            </button>
            <Link
              to="/login"
              className="border-2 border-[#111111] bg-white px-5 py-3 text-sm font-black uppercase tracking-widest text-[#111111]"
              style={{ borderRadius: 0 }}
            >
              Go to /login
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-[#111111] bg-white px-5 py-3 text-sm font-black uppercase tracking-widest text-[#111111]"
              style={{ borderRadius: 0 }}
            >
              Try /dashboard
            </Link>
          </div>
        </div>

        <JsonBlock title="context session (what the guard uses)" data={session} />
        <JsonBlock title="live session (fresh getSession())" data={liveSession} />
        <JsonBlock title="local storage keys" data={storageEntries} />
      </div>
    </div>
  );
}
