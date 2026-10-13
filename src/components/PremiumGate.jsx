// src/components/PremiumGate.jsx
// Gates premium dashboard features behind a verified Gumroad license.
// Unauthenticated-style upgrade card is rendered until a valid license is verified.

import { useState } from "react";
import mergedConfig from "../configMerge";
import { getCachedEntitlement, verifyLicense } from "../lib/premium";

const REASONS = {
  missing_license_key: "Enter your Gumroad license key to continue.",
  invalid_license: "That license key isn't valid for this product.",
  refunded: "This license has been refunded and is no longer active.",
  licensing_not_configured: "Licensing is not configured yet — contact support for access.",
  verification_error: "Verification failed. Please try again in a moment.",
};

export default function PremiumGate({ children, feature = "Premium" }) {
  const [entitlement] = useState(() => getCachedEntitlement());
  const [key, setKey] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  if (entitlement?.licensed) return children;

  async function handleVerify(e) {
    e.preventDefault();
    if (!key.trim() || status.state === "verifying") return;
    setStatus({ state: "verifying", message: "" });
    try {
      const result = await verifyLicense(key.trim());
      if (result.licensed) {
        window.location.reload();
        return;
      }
      setStatus({
        state: "error",
        message: REASONS[result.reason] || "Could not verify this license key.",
      });
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Verification request failed.",
      });
    }
  }

  const buyUrl = mergedConfig.contact?.gumroadUrl || mergedConfig.contact?.fullCalculatorUrl || "#";

  return (
    <div style={{
      maxWidth: 520,
      margin: "4rem auto",
      padding: "2rem",
      border: "1px solid #111111",
      background: "#FFFFFF",
    }}>
      <p style={{ fontSize: 12, letterSpacing: "0.08em", color: "#5F5F5F", margin: "0 0 8px" }}>
        PREMIUM FEATURE
      </p>
      <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 28, margin: "0 0 12px" }}>
        {feature} requires a license
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 20px" }}>
        Enter the Gumroad license key from your purchase receipt. You can also
        {" "}
        <a href={buyUrl} target="_blank" rel="noreferrer" style={{ color: "#F18B25", fontWeight: 700 }}>
          get access here →
        </a>
      </p>
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #111111",
            fontSize: 14,
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          disabled={status.state === "verifying" || !key.trim()}
          style={{
            width: "100%",
            padding: "12px",
            background: "#F18B25",
            border: "1px solid #111111",
            fontWeight: 800,
            cursor: status.state === "verifying" ? "wait" : "pointer",
          }}
        >
          {status.state === "verifying" ? "VERIFYING…" : "UNLOCK"}
        </button>
      </form>
      {status.message && (
        <p style={{ marginTop: 14, fontSize: 13, color: "#8B1A0A" }}>{status.message}</p>
      )}
    </div>
  );
}