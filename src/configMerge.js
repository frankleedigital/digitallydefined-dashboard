// src/configMerge.js
// Runtime config merger — loads customer overrides from window.DD_CUSTOMER_CONFIG
// (set by the script tag in index.html) and deep-merges them onto the base config.
// 
// Customer config keys are mapped to internal paths so the external interface
// stays intuitive while the internal structure matches CONFIG from config.js.
//
// Example customer-config.js fields → internal paths:
//   businessName        → brand.fullName, brand.logoText
//   yourName            → dashboard.ownerName
//   tagline             → brand.tagline
//   primaryColor        → aesthetic.tokens.colors.accents.orange
//   secondaryColor      → aesthetic.tokens.colors.accents.aquaBlue
//   backgroundColor     → colors.background, aesthetic.tokens.colors.background
//   textColor           → colors.text, aesthetic.tokens.colors.text.primary
//   borderColor         → aesthetic.tokens.geometry.borderColor
//   dashboardTitle      → dashboard.title
//   tabs                → dashboard.tabs
//   sheetsApiUrl        → dashboard.sheetsApiUrl
//   backendApiKey       → dashboard.apiKey
//   openRouterApiKey    → dashboard.openRouterApiKey
//   welcomeMessage      → dashboard.welcomeMessage

import baseConfig from "./config";

/**
 * Deep-merge source into target (mutates target).
 * Arrays and primitives are overwritten, objects are recursed.
 */
function deepMerge(target, source) {
  if (!source || typeof source !== "object") return target;
  if (Array.isArray(source)) return source;
  
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const val = source[key];
    if (val && typeof val === "object" && !Array.isArray(val) && result[key] && typeof result[key] === "object") {
      result[key] = deepMerge(result[key], val);
    } else {
      result[key] = val;
    }
  }
  return result;
}

/**
 * Map customer-config.js keys to internal CONFIG paths.
 * Returns an object with dot-notation keys for easy deep-setting.
 */
function mapCustomerConfig(customer) {
  if (!customer) return {};
  
  const merged = {};
  
  // Brand
  if (customer.businessName) {
    merged["brand.fullName"] = customer.businessName;
    merged["brand.logoText"] = customer.businessName;
    merged["brand.nameLight"] = customer.businessName.split(/(?=[A-Z])/)[0] || customer.businessName;
    merged["brand.nameBold"] = customer.businessName.split(/(?=[A-Z])/).slice(1).join("") || "Defined";
  }
  if (customer.tagline) merged["brand.tagline"] = customer.tagline;
  
  // Dashboard owner
  if (customer.yourName) {
    merged["dashboard.ownerName"] = customer.yourName;
    merged["dashboard.yourName"] = customer.yourName;
  }
  
  // Aesthetic tokens (colors)
  if (customer.backgroundColor) {
    merged["colors.background"] = customer.backgroundColor;
    merged["aesthetic.tokens.colors.background"] = customer.backgroundColor;
  }
  if (customer.textColor) {
    merged["colors.text"] = customer.textColor;
    merged["colors.text.primary"] = customer.textColor;
    merged["aesthetic.tokens.colors.text.primary"] = customer.textColor;
  }
  if (customer.primaryColor) {
    merged["aesthetic.tokens.colors.accents.orange"] = customer.primaryColor;
    merged["colors.accent"] = customer.primaryColor;
  }
  if (customer.secondaryColor) {
    merged["aesthetic.tokens.colors.accents.aquaBlue"] = customer.secondaryColor;
    merged["colors.primary"] = customer.secondaryColor;
  }
  if (customer.borderColor) {
    merged["aesthetic.tokens.geometry.borderColor"] = customer.borderColor;
    merged["colors.border"] = customer.borderColor;
  }
  
  // Dashboard settings
  if (customer.dashboardTitle) merged["dashboard.title"] = customer.dashboardTitle;
  if (customer.dashboardSubtitle) merged["dashboard.subtitle"] = customer.dashboardSubtitle;
  if (customer.welcomeMessage) merged["dashboard.welcomeMessage"] = customer.welcomeMessage;
  if (customer.syncButtonLabel) merged["dashboard.syncButtonLabel"] = customer.syncButtonLabel;
  if (customer.settingsLabel) merged["dashboard.settingsLabel"] = customer.settingsLabel;
  if (customer.saveSettingsLabel) merged["dashboard.saveSettingsLabel"] = customer.saveSettingsLabel;
  
  // API/Integration keys
  if (customer.sheetsApiUrl) merged["dashboard.sheetsApiUrl"] = customer.sheetsApiUrl;
  if (customer.backendApiKey) merged["dashboard.apiKey"] = customer.backendApiKey;
  if (customer.openRouterApiKey) merged["dashboard.openRouterApiKey"] = customer.openRouterApiKey;
  if (customer.backendApiUrl) merged["dashboard.backendApiUrl"] = customer.backendApiUrl;
  if (customer.hermesGatewayUrl) merged["dashboard.hermesGatewayUrl"] = customer.hermesGatewayUrl;
  
  // Features
  if (customer.features) {
    merged["dashboard.features"] = customer.features;
  }
  
  // Metrics defaults
  if (customer.defaultAssetValue) merged["metrics.assetValue"] = customer.defaultAssetValue;
  if (customer.defaultCommunityCount) merged["metrics.communityCount"] = customer.defaultCommunityCount;
  if (customer.defaultSystemHealth) merged["metrics.systemHealth"] = customer.defaultSystemHealth;
  
  return merged;
}

// Load customer config from window (set by script tag in index.html)
const customerConfig = typeof window !== "undefined" ? window.DD_CUSTOMER_CONFIG : null;
const mapped = mapCustomerConfig(customerConfig);

// Build merged config
const mergedConfig = deepMerge(baseConfig, mapped);

// Expose for debugging (remove in production)
if (typeof window !== "undefined") {
  window.__DD_CONFIG_MERGED = mergedConfig;
  window.__DD_CONFIG_CUSTOMER = customerConfig;
}

export default mergedConfig;
