import React from "react";
import mergedConfig from "../configMerge";
import Logo from "./Logo";
import { theme } from "../theme";

const Footer = ({
  colors,
  containerStyle,
  footerStyle,
  navigate,
  routes,
  landing,
  contact,
  year,
  showDashboardLink = true,
}) => (
  <footer style={footerStyle}>
    <div style={{ ...containerStyle, display: "grid", gap: theme.layout.spacing }}>
      <Logo
        as="div"
        style={{
          fontSize: "clamp(1.2rem, 2vw, 1.45rem)",
          letterSpacing: "-0.05em",
        }}
      />
      <p style={{ margin: 0, color: colors.textMuted }}>{mergedConfig.brand.tagline}</p>
      <div
        style={{
          display: "flex",
          gap: theme.layout.spacing,
          flexWrap: "wrap",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: "0.72rem",
          fontWeight: 800,
        }}
      >
        {showDashboardLink && (
          <button
            type="button"
            onClick={() => navigate(routes.dashboard)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: colors.text,
              textTransform: "inherit",
              letterSpacing: "inherit",
              font: "inherit",
            }}
          >
            {landing.footerDashboard}
          </button>
        )}
        <a href={`#${landing.featuresAnchor}`} style={{ color: colors.text, textDecoration: "none" }}>
          {landing.footerFeatures}
        </a>
        <a href={`mailto:${contact.email}`} style={{ color: colors.text, textDecoration: "none" }}>
          {landing.footerContact}
        </a>
      </div>
      <p style={{ margin: 0, color: colors.textMuted }}>
        {`${landing.footerCopyrightPrefix} ${year} ${mergedConfig.brand.fullName}. ${landing.footerRights}`}
      </p>
    </div>
  </footer>
);

export default Footer;
