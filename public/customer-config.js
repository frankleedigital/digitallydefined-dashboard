/**
 * DigitallyDefined Dashboard - Customer Configuration
 * 
 * THIS IS YOUR CUSTOM CONFIGURATION FILE
 * Edit ONLY the values on the RIGHT side of the colons (:
 * Do NOT edit the left side (the variable names)
 * 
 * After editing, your dashboard will automatically use your settings!
 */

// ============================================
// 🏢 BRANDING & BUSINESS INFO
// ============================================

const CUSTOMER_CONFIG = {
  // Your business name - appears in header and emails
  businessName: "My Business Name",
  
  // Your name - used in signatures and messages
  yourName: "Your Name",
  
  // Your tagline/slogan
  tagline: "Digital Real Estate for Gen X Women",
  
  // Your website URL
  websiteUrl: "https://mybusiness.com",
  
  // Your email for support
  supportEmail: "support@mybusiness.com",
  
  // ============================================
  // 🎨 COLORS & STYLING
  // ============================================
  
  // Primary brand color (used for buttons, accents)
  // Format: Hex code like "#F18B25" or color name like "orange"
  primaryColor: "#F18B25",
  
  // Secondary brand color
  secondaryColor: "#47B7D4",
  
  // Background color for dashboard
  backgroundColor: "#FFFCF9",
  
  // Text color
  textColor: "#111111",
  
  // Border color
  borderColor: "#111111",
  
  // ============================================
  // 📊 DASHBOARD SETTINGS
  // ============================================
  
  // Your dashboard title (appears at top)
  dashboardTitle: "My Command Center",
  
  // Subtitle/eyebrow text
  dashboardSubtitle: "Proprietary OS",
  
  // Customize tab names
  tabs: {
    dashboard: "COMMAND",
    reputation: "REPUTATION", 
    intel: "INTEL",
    brain: "THE BRAIN",
    automations: "AUTOMATIONS",
    notion: "NOTION DB"
  },
  
  // ============================================
  // 🔑 API & INTEGRATIONS
  // ============================================
  
  // Your Google Sheets API URL
  // Get this from: Google Apps Script > Deploy > Web App > URL
  sheetsApiUrl: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  
  // Your Backend API URL (if using your own backend)
  // Leave as is to use DigitallyDefined's backend
  backendApiUrl: "/api/hermes",
  
  // Hermes Gateway URL for all API calls
  hermesGatewayUrl: "/api/hermes",
  
  // Your Backend API Key (provided by DigitallyDefined)
  // Get this from your purchase confirmation
  backendApiKey: "YOUR-API-KEY-HERE",
  
  // OpenRouter AI Key (for AI features)
  // Get free key at: https://openrouter.ai/keys
  openRouterApiKey: "sk-or-v1-YOUR-KEY",
  
  // ============================================
  // 📋 DEFAULT VALUES
  // ============================================
  
  // Default asset value to display
  defaultAssetValue: "$0",
  
  // Default community count
  defaultCommunityCount: "0",
  
  // Default system health status
  defaultSystemHealth: "Stable",
  
  // ============================================
  // 📧 COMMUNITY & SOCIAL
  // ============================================
  
  // Your Facebook Group URL
  facebookGroupUrl: "https://facebook.com/groups/yourgroup",
  
  // Your LinkedIn URL
  linkedInUrl: "https://linkedin.com/in/yourprofile",
  
  // Your Instagram URL
  instagramUrl: "https://instagram.com/yourhandle",
  
  // ============================================
  // 💬 MESSAGING & COPY
  // ============================================
  
  // Welcome message on dashboard
  welcomeMessage: "Own Your Power.",
  
  // Sync button label
  syncButtonLabel: "Sync Vault",
  
  // Settings button label
  settingsLabel: "System Keys",
  
  // Save settings button label
  saveSettingsLabel: "Save System Keys",
  
  // No sync yet message
  noSyncLabel: "No sync yet",
  
  // Sync error message
  syncError: "Sync interrupted. Check the Sheets URL or Apps Script permissions.",
  
  // Community feed title
  communityFeedTitle: "Live Community Feed",
  
  // Intel section title
  intelTitle: "Strategic Intel",
  
  // Reputation section title
  reputationTitle: "Reputation Triage",
  
  // ============================================
  // 🔧 ADVANCED SETTINGS (Optional)
  // ============================================
  
  // Custom domain for CORS (if hosting on your own domain)
  customDomain: "",
  
  // Enable/disable features
  features: {
    enableChat: true,
    enableAutomations: true,
    enableBrain: true,
    enableIntel: true,
    enableNotion: true
  },
  
  // AI Assistant model (Gemini Flash is the preferred low-cost default)
  assistantModel: "gemini-2.5-flash",
  
  // ============================================
  // 📝 NOTES
  // ============================================
  // 
  // 1. After editing this file, your changes will take effect immediately
  // 2. For API keys, you MUST have valid keys from each service
  // 3. Keep this file private - it contains your sensitive keys
  // 4. For support, contact: support@digitallydefined.online
  //
};

// ============================================
// DO NOT EDIT BELOW THIS LINE
// ============================================
// This exports the config so the dashboard can use it
if (typeof window !== 'undefined') {
  window.DD_CUSTOMER_CONFIG = CUSTOMER_CONFIG;
}
module.exports = CUSTOMER_CONFIG;
