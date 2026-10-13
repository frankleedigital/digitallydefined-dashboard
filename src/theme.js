import CONFIG from "./config";
import mergedConfig from "./configMerge";

// Fall back to base config if no customer overrides loaded
const tokens = mergedConfig?.aesthetic?.tokens || CONFIG.aesthetic.tokens;
const tokenColors = tokens.colors;

export const theme = {
  philosophy: mergedConfig?.aesthetic?.philosophy || CONFIG.aesthetic.philosophy,
  fonts: {
    heading: `'${tokens.typography.headings.font}', system-ui, sans-serif`,
    body: `'${tokens.typography.body.font}', system-ui, sans-serif`,
    app: `'${tokens.typography.headings.font}', '${tokens.typography.body.font}', system-ui, sans-serif`,
  },
  colors: {
    background: tokenColors.background,
    panel: mergedConfig?.colors?.panel || CONFIG.colors.panel,
    card: tokenColors.card,
    textPrimary: tokenColors.text.primary,
    textDark: tokenColors.text.dark,
    border: tokens.geometry.borderColor,
    orange: tokenColors.accents.orange,
    aquaBlue: tokenColors.accents.aquaBlue,
    darkRed: tokenColors.accents.darkRed,
    muted: mergedConfig?.colors?.textMuted || CONFIG.colors.textMuted,

    // ⭐ Added per Claude's fix
    success: mergedConfig?.colors?.success || CONFIG.colors.success,
    warning: mergedConfig?.colors?.warning || CONFIG.colors.warning,
    danger: mergedConfig?.colors?.danger || CONFIG.colors.danger,
  },
  geometry: {
    ...tokens.geometry,
    borderWidth: "1px",
    borderColor: "#111111",
    borderRadius: 0,
    shadows: tokens.geometry.shadows,
  },
  layout: tokens.layout,
};

export const brutalBorder = `${theme.geometry.borderWidth} solid ${theme.geometry.borderColor}`;

export const brutalCard = {
  border: brutalBorder,
  borderRadius: theme.geometry.borderRadius,
  boxShadow: theme.geometry.shadows,
  backgroundColor: theme.colors.panel,
};

export const brutalHeading = {
  fontFamily: theme.fonts.heading,
  fontWeight: tokens.typography.headings.weight || 800,
  fontStyle: "normal",
  textTransform: "none",
  letterSpacing: tokens.typography.headings.letterSpacing,
  color: theme.colors.textPrimary,
};

export const brutalEyebrow = {
  fontFamily: theme.fonts.heading,
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  margin: 0,
  color: theme.colors.textPrimary,
};

export const brutalButtonBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.75rem",
  padding: "14px 20px",
  border: brutalBorder,
  borderRadius: theme.geometry.borderRadius,
  boxShadow: theme.geometry.shadows,
  textDecoration: "none",
  textTransform: "none",
  letterSpacing: "-0.01em",
  fontWeight: 700,
  fontSize: "0.85rem",
  cursor: "pointer",
  fontFamily: theme.fonts.body,
};

export const brutalButtonPrimary = {
  ...brutalButtonBase,
  backgroundColor: theme.colors.orange,
  color: theme.colors.textDark,
};

export const brutalButtonSecondary = {
  ...brutalButtonBase,
  backgroundColor: theme.colors.aquaBlue,
  color: theme.colors.textDark,
};

/* --- DD Design System additions (non-breaking upgrades) ---------- */

export const brutalButtonOutline = {
  ...brutalButtonBase,
  backgroundColor: theme.colors.background,
  color: theme.colors.textPrimary,
};

/* Full spacing + type scales locked to the brand system */
export const spacingScale = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "40px",
  xl: "60px",
  gridGap: "32px",
  container: tokens.layout.containerMaxWidth || "1100px",
};

export const typeScale = {
  h1: { ...brutalHeading, fontSize: "clamp(2.25rem, 5vw, 3rem)" },
  h2: { ...brutalHeading, fontSize: "clamp(1.75rem, 4vw, 2rem)" },
  h3: { ...brutalHeading, fontSize: "clamp(1.2rem, 3vw, 1.5rem)" },
  body: {
    fontFamily: theme.fonts.body,
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: "1.6",
    color: theme.colors.textPrimary,
  },
  muted: {
    fontFamily: theme.fonts.body,
    fontSize: "0.9rem",
    fontWeight: 400,
    color: theme.colors.muted,
  },
  eyebrow: brutalEyebrow,
};

/* Flat geometric icon system — NO silhouettes, NO human shapes */
export const flatIcon = {
  style: "flat-line-geometric",
  stroke: "1.5px",
  radius: 0,
  gradients: "none",
};

export const flatIllustration = {
  style: "flat-abstract",
  radius: 0,
  figures: "none", // no human forms
  gradients: "none",
};

export const containerWidth = spacingScale.container;
