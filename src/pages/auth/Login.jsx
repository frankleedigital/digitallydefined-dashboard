// src/pages/auth/Login.jsx
// Auth is disabled for the dashboard. This page exists only so the route
// stays valid (no 404) and gives a clear one-liner when someone stumbles onto it.

import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#FFFCF9", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="w-full max-w-md text-center">
        <div className="bg-white border-2 border-[#111111] p-8" style={{ borderRadius: 0 }}>
          <h1
            className="text-2xl font-black tracking-widest text-[#111111] mb-4"
            style={{ letterSpacing: "0.15em" }}
          >
            DIGITALLY<span className="text-[#F18B25]">DEFINED</span>
          </h1>
          <h2 className="text-xl font-black text-[#111111] mb-3 uppercase tracking-wider">
            Login disabled
          </h2>
          <p className="text-sm text-[#5F5F5F] mb-6 font-medium">
            Dashboard access is open to everyone. No sign-in required.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-[#F18B25] border-2 border-[#111111] px-6 py-3 text-sm font-black uppercase tracking-widest text-[#111111]"
            style={{ borderRadius: 0 }}
          >
            Go to dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
