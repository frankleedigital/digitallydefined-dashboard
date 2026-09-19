// Google Analytics integration service
// Requires VITE_GA_MEASUREMENT_ID / VITE_GA_PROPERTY_ID and OAuth credentials in a real backend context.
import { callSupabaseEdge } from '../supabase-edge';

export async function fetchGoogleAnalytics() {
  const fallbackBrief = {
    connected: false,
    propertyId: null,
    users30d: null,
    sessions30d: null,
    bounceRate: null,
    topPages: [],
    goalConversions: null,
    revenue30d: null,
    lastUpdated: null,
    error: 'Missing Google Analytics configuration',
  };

  try {
    const payload = await callSupabaseEdge('integration.googleAnalytics', {
      provider: 'googleAnalytics',
    });

    if (!payload || typeof payload !== 'object') {
      return fallbackBrief;
    }

    if (payload.error) {
      return {
        connected: false,
        propertyId: payload.propertyId ?? null,
        users30d: null,
        sessions30d: null,
        bounceRate: null,
        topPages: [],
        goalConversions: null,
        revenue30d: null,
        lastUpdated: null,
        error: payload.error,
      };
    }

    return {
      connected: true,
      propertyId: payload.propertyId ?? null,
      users30d: payload.users30d ?? null,
      sessions30d: payload.sessions30d ?? null,
      bounceRate: payload.bounceRate ?? null,
      topPages: Array.isArray(payload.topPages) ? payload.topPages.slice(0, 5) : [],
      goalConversions: payload.goalConversions ?? null,
      revenue30d: payload.revenue30d ?? null,
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      propertyId: null,
      users30d: null,
      sessions30d: null,
      bounceRate: null,
      topPages: [],
      goalConversions: null,
      revenue30d: null,
      lastUpdated: null,
      error: error.message || 'Failed to fetch Google Analytics data',
    };
  }
}

export default { fetchGoogleAnalytics, startGoogleAnalytics };

/**
 * Begin the Google Analytics connection flow.
 * For now this invokes the dashboard backend `integration.google.start` action,
 * which returns a placeholder success envelope. Real OAuth redirect is added later.
 */
export async function startGoogleAnalytics() {
  const res = await callSupabaseEdge('integration.google.start', { provider: 'google' });
  return {
    success: res?.success !== false,
    message: res?.message || 'Google Analytics connection started',
  };
}
