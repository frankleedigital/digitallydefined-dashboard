// Email list integration service
// Supports Brevo, Mailchimp through the Hermes edge function.
import { callSupabaseEdge } from '../supabase-edge';

export async function fetchEmailStats() {
  try {
    const payload = await callSupabaseEdge('integration.email', {
      provider: 'email',
    });

    if (!payload || typeof payload !== 'object') {
      return {
        connected: false,
        provider: null,
        subscribers: null,
        openRate: null,
        clickRate: null,
        campaigns: [],
        revenuePerCampaign: null,
        lastUpdated: null,
        error: 'Backend returned no data for email integration',
        configured: false,
      };
    }

    if (payload.error) {
      return {
        connected: false,
        provider: payload.provider || null,
        subscribers: null,
        openRate: null,
        clickRate: null,
        campaigns: [],
        revenuePerCampaign: null,
        lastUpdated: null,
        error: payload.error,
        configured: payload.configured ?? false,
      };
    }

    const subscribers = payload.subscribers ?? payload.totalSubscribers ?? null;
    const campaigns = Array.isArray(payload.campaigns) ? payload.campaigns.slice(0, 5) : [];
    const connected = Boolean(payload.connected ?? (subscribers != null || campaigns.length > 0)) || (typeof localStorage !== "undefined" && localStorage.getItem("integration.email.connected") === "true");

    return {
      connected,
      configured: payload.configured ?? connected,
      provider: payload.provider || null,
      subscribers,
      openRate: payload.openRate ?? null,
      clickRate: payload.clickRate ?? null,
      campaigns,
      revenuePerCampaign: payload.revenuePerCampaign ?? null,
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      provider: null,
      subscribers: null,
      openRate: null,
      clickRate: null,
      campaigns: [],
      revenuePerCampaign: null,
      lastUpdated: null,
      error: error.message || 'Backend unreachable: could not load email data',
      configured: false,
    };
  }
}

export default { fetchEmailStats, startEmail };

/**
 * Begin the Email List connection flow.
 * Invokes Hermes `integration.email.start` (placeholder success envelope).
 */
export async function startEmail() {
  const res = await callSupabaseEdge('integration.email.start', { provider: 'email' });
  if (res?.success !== false) {
    try { localStorage.setItem("integration.email.connected", "true"); } catch { /* noop */ }
  }
  return {
    success: res?.success !== false,
    message: res?.message || 'Email List connection started',
  };
}

