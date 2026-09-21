// src/supabase.js
// Single Supabase client for the dashboard.
//
// Login-loop hardening (see also context/AuthContext.jsx + components/ProtectedRoute.jsx):
//   1. Config is validated up front — a missing/malformed URL or anon key fails
//      loudly in the console instead of producing a client that silently
//      rejects every request (which looks exactly like "always logged out").
//   2. URLs are normalized (no trailing slash, no stray whitespace) so the
//      browser origin and the configured project URL can never disagree.
//   3. PKCE flow + detectSessionInUrl are explicit, and OAuth returns to
//      /auth/callback, which finalizes the session BEFORE the dashboard opens.
//   4. Every auth call logs a compact, token-free line so the redirect loop
//      can be diagnosed from the browser console alone.

import { createClient } from '@supabase/supabase-js';

const AUTH_LOG_PREFIX = '[auth]';

/** Compact, token-free console logging for the auth flow. */
export function authLog(...parts) {
  console.log(AUTH_LOG_PREFIX, ...parts);
}

export function authWarn(...parts) {
  console.warn(AUTH_LOG_PREFIX, ...parts);
}

export function authError(...parts) {
  console.error(AUTH_LOG_PREFIX, ...parts);
}

/** Normalize a Supabase URL: trim whitespace, strip trailing slashes. */
function normalizeUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

const SUPABASE_URL = normalizeUrl(import.meta.env.VITE_SUPABASE_URL);
const SUPABASE_ANON_KEY = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/** The OAuth redirect target the code will actually send to Supabase. */
export function getActualOAuthRedirectTo() {
  return getOAuthRedirectTo("/dashboard");
}

function assertSupabaseConfig() {
  const problems = [];

  if (!SUPABASE_URL) {
    problems.push('VITE_SUPABASE_URL is missing');
  } else if (!/^https:\/\/.+/.test(SUPABASE_URL)) {
    problems.push(`VITE_SUPABASE_URL is not an https URL: ${SUPABASE_URL}`);
  }

  if (!SUPABASE_ANON_KEY) {
    problems.push('VITE_SUPABASE_ANON_KEY is missing');
  } else if (!SUPABASE_ANON_KEY.startsWith('eyJ')) {
    // Anon keys are JWTs; anything else is almost certainly the wrong secret.
    problems.push('VITE_SUPABASE_ANON_KEY does not look like a Supabase anon (JWT) key');
  }

  if (problems.length > 0) {
    authError('Supabase configuration problem:', problems.join(' | '));
  } else {
    authLog('Supabase client ready', {
      url: SUPABASE_URL,
      actualOAuthRedirectTo: getActualOAuthRedirectTo(),
      flow: 'pkce',
      anonKey: `${SUPABASE_ANON_KEY.slice(0, 8)}…(${SUPABASE_ANON_KEY.length} chars)`,
    });
  }

  return problems;
}

const configProblems = assertSupabaseConfig();

export const supabaseConfigIssues = configProblems;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Detect ?code= (PKCE) and #access_token= (implicit) on load.
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Stable storage key so /debug-auth can show exactly what the client sees.
    storageKey: 'dd-dashboard-auth',
  },
});

/** Human-readable config summary (never logs the full key). */
export function describeSupabaseConfig() {
  return {
    url: SUPABASE_URL || '(missing)',
    anonKeyPresent: !!SUPABASE_ANON_KEY,
    anonKeyPreview: SUPABASE_ANON_KEY ? `${SUPABASE_ANON_KEY.slice(0, 8)}…` : '(missing)',
    originMatchesProjectUrl: false, // placeholder — kept while the function is removed
    issues: configProblems,
  };
}

/** Where OAuth must come back to. Always same-origin, never cross-domain. */
export function getOAuthRedirectTo(nextPath = '/dashboard') {
  const path = String(nextPath || '/dashboard').startsWith('/') ? nextPath : `/${nextPath}`;
  return `${window.location.origin}/auth/callback?next=${encodeURIComponent(path)}`;
}

export const signIn = async (email, password) => {
  authLog('signInWithPassword →', { email });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    authError('signInWithPassword failed:', error.message, { status: error.status });
    throw error;
  }
  authLog('signInWithPassword ok', {
    userId: data.user?.id,
    hasSession: !!data.session,
    emailConfirmed: !!data.user?.email_confirmed_at,
  });
  return data;
};

export const signUp = async (email, password, name) => {
  authLog('signUp →', { email, name });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) {
    authError('signUp failed:', error.message, { status: error.status });
    throw error;
  }
  authLog('signUp ok', {
    userId: data.user?.id,
    hasSession: !!data.session,
    // With email confirmation enabled, no session returns until the link is clicked.
    needsEmailConfirmation: !data.session && !!data.user,
  });
  if (data.user && data.session) {
    await supabase.from('profiles').upsert({ id: data.user.id, name, email, plan: 'free' });
  }
  return data;
};

export const signInWithGoogle = async (nextPath = '/dashboard') => {
  const redirectTo = getOAuthRedirectTo(nextPath);
  authLog('signInWithOAuth →', { provider: 'google', redirectTo });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) {
    authError('signInWithOAuth failed:', error.message);
    throw error;
  }
  authLog('signInWithOAuth handed off to provider', { hasUrl: !!data?.url });
  return data;
};

export const signOut = async () => {
  authLog('signOut →');
  const { error } = await supabase.auth.signOut();
  if (error) {
    authError('signOut failed:', error.message);
    throw error;
  }
  authLog('signOut ok');
};
