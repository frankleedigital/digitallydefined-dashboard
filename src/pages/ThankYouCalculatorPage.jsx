import React from "react";
import { CheckCircle, Calculator, Home, ArrowRight } from "lucide-react";
import mergedConfig from "../configMerge";
import { brutalButtonPrimary, brutalButtonSecondary, brutalCard, brutalHeading } from "../theme";

const ThankYouCalculatorPage = () => {
  const colors = mergedConfig.colors;
  const tyConfig = mergedConfig.thankYouCalculator;
  
  const container = {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "clamp(40px, 8vw, 80px) 24px",
  };

  const section = {
    padding: "60px 0",
  };

  return (
    <main style={{ backgroundColor: colors.background, minHeight: "100vh" }}>
      <div style={container}>
        {/* Hero Section */}
        <section style={{ ...section, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              border: `2px solid ${colors.accent}`,
              borderRadius: "0px",
              marginBottom: "32px",
            }}
          >
            <CheckCircle size={40} color={colors.accent} style={{ strokeWidth: 2.5 }} />
          </div>
          
          <p
            style={{
              color: colors.accent,
              fontWeight: 900,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              margin: 0,
            }}
          >
            SUCCESS
          </p>
          
          <h1
            style={{
              ...brutalHeading,
              margin: "16px 0 0",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.05,
              color: colors.text,
            }}
          >
            {tyConfig.title}
          </h1>
          
          <p
            style={{
              margin: "24px auto 0",
              maxWidth: "600px",
              color: colors.textMuted,
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              lineHeight: 1.6,
            }}
          >
            {tyConfig.subtitle}. Check your email (including spam folder) for 
            your purchase receipt and download link from Gumroad.
          </p>
        </section>

        {/* What's Included Section */}
        <section style={section}>
          <h2
            style={{
              ...brutalHeading,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              textAlign: "center",
              marginBottom: "48px",
              color: colors.text,
            }}
          >
            What You Get
          </h2>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {tyConfig.features.map((item, index) => {
              const icons = [Calculator, Home, CheckCircle];
              const Icon = icons[index] || Calculator;
              
              return (
                <div
                  key={index}
                  style={{
                    ...brutalCard,
                    padding: "32px",
                    display: "grid",
                    gap: "20px",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      border: `1px solid ${colors.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={24} color={colors.primary} />
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      color: colors.text,
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      color: colors.textMuted,
                      fontSize: "0.95rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Next Steps Section */}
        <section style={{ ...section, textAlign: "center" }}>
          <h2
            style={{
              ...brutalHeading,
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              marginBottom: "32px",
              color: colors.text,
            }}
          >
            Next Steps
          </h2>
          
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <a
              href={CONFIG.contact.gumroadUrl || CONFIG.contact.fullCalculatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={brutalButtonPrimary}
            >
              {tyConfig.ctaLabel} <ArrowRight size={16} />
            </a>
            
            <a
              href={CONFIG.contact.website}
              style={brutalButtonSecondary}
            >
              {tyConfig.secondaryCtaLabel} <ArrowRight size={16} />
            </a>
          </div>
        </section>

        {/* Support Section */}
        <section
          style={{
            ...section,
            paddingTop: "40px",
            paddingBottom: "40px",
            borderTop: `1px solid ${colors.border}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              color: colors.textMuted,
              fontSize: "0.9rem",
            }}
          >
            {tyConfig.emailNote} <strong>{CONFIG.contact.email}</strong>
          </p>
        </section>
      </div>
    </main>
  );
};

export default ThankYouCalculatorPage;
