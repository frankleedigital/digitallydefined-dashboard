// src/context/AuthContext.jsx
// Supabase authentication context for the DigitallyDefined dashboard.
//
// Auth is disabled for dashboard access — everyone gets in. This provider
// still exists because some pages read currentUser for API headers. It keeps
// a live session in the background so that if/when auth is re-enabled, the
// session is already there.
//
// The provider never blocks rendering and never redirects.

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase, authLog, authError } from "../supabase.js";
import { getCurrentUser, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut } from "../lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const applySession = (nextSession, source) => {
      if (cancelled) return;
      setSession(nextSession || null);
      setCurrentUser(nextSession?.user || null);
      authLog(`session applied (${source})`, {
        userId: nextSession?.user?.id || null,
        email: nextSession?.user?.email || null,
        hasSession: !!nextSession,
      });
    };

    async function loadSession() {
      if (initializedRef.current) {
        authLog("initialization already ran, skipping duplicate mount");
        return;
      }
      initializedRef.current = true;

      try {
        authLog("initializing auth state…", { origin: window.location.origin, path: window.location.pathname });
        const { data, error } = await supabase.auth.getSession();
        if (error) authError("getSession failed:", error.message);
        const restored = data?.session || null;
        if (restored) {
          applySession(restored, "getSession");
          setLoading(false);
          return;
        }
        authLog("no restored session — dashboard is open to everyone");
        setCurrentUser(null);
      } catch (error) {
        authError("auth initialization failed:", error?.message || error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      authLog("onAuthStateChange", event, { userId: nextSession?.user?.id || null, hasSession: !!nextSession });
      if (event === "SIGNED_OUT") { applySession(null, event); return; }
      if (nextSession?.user) applySession(nextSession, event);
      setLoading(false);
    });

    loadSession();
    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  const value = useMemo(() => ({
    session, currentUser, loading,
    login: async (email, password) => {
      const result = await signInWithEmail(email, password);
      const user = result?.user || result?.session?.user || null;
      setSession(result?.session || null); setCurrentUser(user); return result;
    },
    signup: async (email, password, name) => {
      const result = await signUpWithEmail(email, password, name);
      const user = result?.user || result?.session?.user || null;
      setSession(result?.session || null); setCurrentUser(user); return result;
    },
    signInWithGoogle: async (nextPath) => { await signInWithGoogle(nextPath); },
    logout: async () => { await signOut(); setSession(null); setCurrentUser(null); },
  }), [session, currentUser, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }