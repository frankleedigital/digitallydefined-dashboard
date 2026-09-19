// Social media integration service
// Supports Facebook, Instagram, YouTube, Twitter/X, LinkedIn through the Hermes edge function.
import { callSupabaseEdge } from '../supabase-edge';

export async function fetchSocialStats() {
  const fallbackResult = {
    connected: false,
    platforms: {},
    followers: null,
    engagementRate: null,
    impressions30d: null,
    topPosts: [],
    lastUpdated: null,
    error: 'No social platforms configured',
  };

  try {
    const payload = await callSupabaseEdge('integration.social', {
      provider: 'social',
    });

    if (!payload || typeof payload !== 'object') {
      return fallbackResult;
    }

    if (payload.error) {
      return {
        connected: false,
        platforms: {},
        followers: null,
        engagementRate: null,
        impressions30d: null,
        topPosts: [],
        lastUpdated: null,
        error: payload.error,
      };
    }

    const platformEntries = Object.entries(payload.platforms || {});
    const hasPlatforms = platformEntries.length > 0;
    const hasMetrics =
      payload.followers != null || payload.engagementRate != null || payload.impressions30d != null;

    return {
      connected: Boolean(payload.connected ?? (hasPlatforms || hasMetrics)),
      platforms: payload.platforms || {},
      followers: payload.followers ?? null,
      engagementRate: payload.engagementRate ?? null,
      impressions30d: payload.impressions30d ?? null,
      topPosts: Array.isArray(payload.topPosts) ? payload.topPosts.slice(0, 5) : [],
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      platforms: {},
      followers: null,
      engagementRate: null,
      impressions30d: null,
      topPosts: [],
      lastUpdated: null,
      error: error.message || 'Failed to fetch social data',
    };
  }
}

export default { fetchSocialStats, startSocial };

/**
 * Begin the Social Pages connection flow.
 * Invokes Hermes `integration.social.start` (placeholder success envelope).
 */
export async function startSocial() {
  const res = await callSupabaseEdge('integration.social.start', { provider: 'social' });
  return {
    success: res?.success !== false,
    message: res?.message || 'Social Pages connection started',
  };
}
