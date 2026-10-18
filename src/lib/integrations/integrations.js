// DigitallyDefined Dashboard — Integration data fetchers
// These calls go through the shared dashboard backend via ApiService.

import api from "../../services/api";

async function callAgentAction(action, payload = {}) {
  try {
    return await api.post(action, payload);
  } catch (err) {
    console.warn(`[integrations] ${action} unavailable:`, err instanceof Error ? err.message : String(err));
    return null;
  }
}

/**
 * Google Analytics integration stub.
 * Replace the body with real GA4 Data API calls once credentials are wired.
 */
export async function fetchGoogleAnalytics() {
  const result = await callAgentAction('integration.googleAnalytics');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    propertyId: result.data.propertyId || null,
    users30d: result.data.users30d ?? null,
    sessions30d: result.data.sessions30d ?? null,
    revenue30d: result.data.revenue30d ?? null,
    bounceRate: result.data.bounceRate ?? null,
    goalConversions: result.data.goalConversions ?? null,
    error: null,
  };
}

/**
 * Social pages integration stub.
 * Replace with real Meta/Instagram Graph API calls.
 */
export async function fetchSocialStats() {
  const result = await callAgentAction('integration.social');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    followers: result.data.followers ?? null,
    engagementRate: result.data.engagementRate ?? null,
    impressions30d: result.data.impressions30d ?? null,
    error: null,
  };
}

/**
 * Email list integration stub.
 * Replace with Brevo/Mailchimp API calls.
 */
export async function fetchEmailStats() {
  const result = await callAgentAction('integration.email');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    provider: result.data.provider || null,
    subscribers: result.data.subscribers ?? null,
    openRate: result.data.openRate ?? null,
    clickRate: result.data.clickRate ?? null,
    revenuePerCampaign: result.data.revenuePerCampaign ?? null,
    error: null,
  };
}

/**
 * Community integration stub.
 * Replace with Facebook Groups API or Circle/Skool API calls.
 */
export async function fetchCommunityStats() {
  const result = await callAgentAction('integration.community');

  if (!result?.data) {
    return { connected: false, error: null };
  }

  return {
    connected: true,
    platform: result.data.platform || null,
    members: result.data.members ?? null,
    activeToday: result.data.activeToday ?? null,
    growth30d: result.data.growth30d ?? null,
    error: null,
  };
}