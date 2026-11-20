import React from "react";
import { ArrowRight, Calculator, Landmark, ShieldCheck } from "lucide-react";
import { brutalBorder, brutalHeading, theme, brutalButtonPrimary, brutalCard } from "../theme";
import { Link } from "react-router-dom";

const FinancialHubPage = () => {
  return (
    <main style={{ backgroundColor: theme.colors.background, minHeight: "100vh", padding: "2rem 1.25rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header style={{ marginBottom: "3rem", textAlign: "center" }}>
          <span style={{ 
            fontSize: "0.72rem", 
            fontWeight: 800, 
            letterSpacing: "0.15em", 
            textTransform: "uppercase", 
            color: theme.colors.orange,
            display: "block",
            marginBottom: "0.75rem"
          }}>
            Phase 2: Financial Clarity
          </span>
          <h1 style={{ ...brutalHeading, fontSize: "clamp(2rem, 6vw, 3.5rem)", margin: "0 0 1rem" }}>
            The Financial Freedom Hub
          </h1>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.6, color: theme.colors.textPrimary, maxWidth: "60ch", margin: "0 auto" }}>
            Let's get real. A business without a number is just a hobby. We need to bridge the gap between where you are and where you need to be.
          </p>
        </header>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          <section style={brutalCard}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.5rem" }}>
              <div style={{ padding: "0.75rem", border: brutalBorder, backgroundColor: theme.colors.aquaBlue }}>
                <Calculator size={24} />
              </div>
              <div>
                <h2 style={{ ...brutalHeading, fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Find Your Freedom Number</h2>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: theme.colors.textPrimary, marginBottom: "1rem" }}>
                  What is the exact monthly income you need to walk away from everything else? No fluff, just the math.
                </p>
                <button style={{ ...brutalButtonPrimary, padding: "10px 16px", fontSize: "0.85rem" }}>
                  Launch Calculator <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          <section style={brutalCard}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.5rem" }}>
              <div style={{ padding: "0.75rem", border: brutalBorder, backgroundColor: theme.colors.orange }}>
                <Landmark size={24} />
              </div>
              <div>
                <h2 style={{ ...brutalHeading, fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Digital Wealth Snapshot</h2>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: theme.colors.textPrimary, marginBottom: "1rem" }}>
                  Audit your current digital assets. What is working? What is a liability? Map your net position in the digital economy.
                </p>
                <button style={{ ...brutalButtonPrimary, padding: "10px 16px", fontSize: "0.85rem" }}>
                  Start Snapshot <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link to="/roadmap" style={{ color: theme.colors.textPrimary, fontWeight: 700, textDecoration: "underline" }}>
            Skip to my Roadmap →
          </Link>
        </footer>
      </div>
    </main>
  );
};

export default FinancialHubPage;
