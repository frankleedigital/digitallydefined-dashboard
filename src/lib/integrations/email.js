// Email list integration service
// Supports Brevo, Mailchimp through the Hermes edge function.
import { callSupabaseEdge } from '../supabase-edge';

export async function fetchEmailStats() {
  const provider = import.meta.env.VITE_EMAIL_PROVIDER || 'brevo';
  const brevoApiKey = import.meta.env.VITE_BREVO_API_KEY;
  const mailchimpApiKey = import.meta.env.VITE_MAILCHIMP_API_KEY;

  const hasBrevo = Boolean(brevoApiKey);
  const hasMailchimp = Boolean(mailchimpApiKey);

  if (!hasBrevo && !hasMailchimp) {
    return {
      connected: false,
      provider: null,
      subscribers: null,
      openRate: null,
      clickRate: null,
      campaigns: [],
      revenuePerCampaign: null,
      lastUpdated: null,
      error: 'No email provider configured',
    };
  }

  try {
    const payload = await callSupabaseEdge('integration.email', {
      provider,
      hasBrevo,
      hasMailchimp,
    });
    return {
      connected: true,
      provider,
      subscribers: payload.subscribers ?? null,
      openRate: payload.openRate ?? null,
      clickRate: payload.clickRate ?? null,
      campaigns: Array.isArray(payload.campaigns) ? payload.campaigns.slice(0, 5) : [],
      revenuePerCampaign: payload.revenuePerCampaign ?? null,
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      provider,
      subscribers: null,
      openRate: null,
      clickRate: null,
      campaigns: [],
      revenuePerCampaign: null,
      lastUpdated: null,
      error: error.message || 'Failed to fetch email data',
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
  return {
    success: res?.success !== false,
    message: res?.message || 'Email List connection started',
  };
}
