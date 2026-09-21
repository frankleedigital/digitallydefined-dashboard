import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authLog, authError, authWarn } from "../../supabase.js";

/** Only same-app paths may be used as a post-signup destination. */
function safeNextPath(raw) {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/dashboard";
}

export default function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup, signInWithGoogle, currentUser, loading } = useAuth();

  const nextPath = safeNextPath(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // An already-signed-in visitor does not need this page either.
  useEffect(() => {
    if (loading) return;
    if (currentUser) {
      authLog("signup page: session already present → redirecting", { nextPath });
      navigate(nextPath, { replace: true });
    }
  }, [currentUser, loading, navigate, nextPath]);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      setSubmitting(false);
      return;
    }

    authLog("email sign-up submitted", { email, nextPath });

    try {
      const result = await signup(email, password);
      if (!result?.session) {
        // Email confirmation is on: there is no session yet, so the dashboard
        // guard would bounce them back here. Say exactly what to do instead.
        authWarn("sign-up has no session yet (email confirmation?)", { userId: result?.user?.id || null });
        setFormError("Check your email and click the confirmation link — then come back and sign in.");
        return;
      }
      authLog("email sign-up succeeded → navigating", { nextPath });
      navigate(nextPath, { replace: true });
    } catch (err) {
      authError("email sign-up failed:", err?.message || err);
      setFormError(err.message || "Sign up failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setSubmitting(true);
    setFormError("");

    authLog("google sign-up requested", { nextPath });

    try {
      await signInWithGoogle(nextPath);
    } catch (err) {
      authError("google sign-up failed:", err?.message || err);
      setFormError(err.message || "Google sign up failed.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#FFFCF9', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-widest text-[#111111]" style={{ letterSpacing: '0.15em' }}>
            DIGITALLY<span className="text-[#F18B25]">DEFINED</span>
          </h1>
          <p className="mt-2 text-xs text-[#5F5F5F] tracking-widest uppercase font-bold">
            Faceless Digital Real Estate
          </p>
        </div>

        <div className="bg-white border-2 border-[#111111] p-8" style={{ borderRadius: '0', boxShadow: 'none' }}>
          <h2 className="text-xl font-black text-[#111111] mb-1 uppercase tracking-wider">
            Create your account
          </h2>
          <p className="text-sm text-[#5F5F5F] mb-6 font-medium">
            Start owning your digital presence.
          </p>

          {formError && (
            <div className="mb-4 border-2 border-[#8B1A0A] px-4 py-3 text-sm text-[#8B1A0A] font-bold uppercase tracking-wide">
              {formError}
            </div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#111111] mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-[#111111] px-4 py-3 text-[#111111] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#111111] mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-[#111111] px-4 py-3 text-[#111111] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[#111111] mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border-2 border-[#111111] px-4 py-3 text-[#111111] outline-none"
                style={{ borderRadius: '0', background: '#FFFFFF' }}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full bg-[#F18B25] text-[#111111] py-3 font-black uppercase tracking-widest text-sm border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-colors disabled:opacity-50"
              style={{ borderRadius: '0' }}
            >
              {submitting || loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignup}
              disabled={submitting || loading}
              className="w-full bg-white border-2 border-[#111111] py-3 font-black uppercase tracking-widest text-sm text-[#111111] hover:bg-[#FFFCF9] transition-colors disabled:opacity-50"
              style={{ borderRadius: '0' }}
            >
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-[#5F5F5F] mt-6 font-medium">
            Already have an account?{" "}
            <Link to={`/login${nextPath !== "/dashboard" ? `?next=${encodeURIComponent(nextPath)}` : ""}`} className="text-[#F18B25] font-black uppercase tracking-wider">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}