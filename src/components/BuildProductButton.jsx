import React, { useState } from "react";
import { Rocket } from "lucide-react";
import { brutalBorder, theme } from "../theme";

const API_BASE = import.meta.env.VITE_API_URL || "https://digitallydefined-os-backend.vercel.app";
const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "DigitallyDefined-OS-2026";

export default function BuildProductButton({ ideaId, ideaTitle, onBuilt }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleBuild = async () => {
    if (!ideaId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
        body: JSON.stringify({ action: "product.factory", ideaId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Build failed");
      }
      setResult(data);
      if (onBuilt) onBuilt(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      <button
        onClick={handleBuild}
        disabled={loading || !ideaId}
        style={{
          border: brutalBorder,
          backgroundColor: loading ? theme.colors.muted : theme.colors.accent || "#F18B25",
          color: "#000",
          padding: "0.5rem 0.75rem",
          fontWeight: 800,
          fontSize: "0.85rem",
          cursor: loading ? "progress" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <Rocket size={14} />
        {loading ? "Building..." : "Build Product"}
      </button>
      {result && (
        <div style={{ fontSize: "0.8rem", color: theme.colors.success || "#16a34a" }}>
          ✅ Product created: {result.metadata?.title || "Untitled"} — queued for approval
        </div>
      )}
      {error && (
        <div style={{ fontSize: "0.8rem", color: theme.colors.darkRed || "#8b1a0a" }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}
