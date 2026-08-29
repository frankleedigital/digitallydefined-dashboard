// Community integration service
// Supports Facebook Groups, Discord, Mighty Networks through the Hermes edge function.
import { callSupabaseEdge } from '../supabase-edge';

export async function fetchCommunityStats() {
  const platform = import.meta.env.VITE_COMMUNITY_PLATFORM || 'facebook';
  const facebookGroupId = import.meta.env.VITE_FACEBOOK_GROUP_ID;
  const discordBotToken = import.meta.env.VITE_DISCORD_BOT_TOKEN;
  const mightyNetworksApiKey = import.meta.env.VITE_MIGHTY_NETWORKS_API_KEY;

  const hasFacebook = Boolean(facebookGroupId);
  const hasDiscord = Boolean(discordBotToken);
  const hasMightyNetworks = Boolean(mightyNetworksApiKey);

  if (!hasFacebook && !hasDiscord && !hasMightyNetworks) {
    return {
      connected: false,
      platform: null,
      members: null,
      activeToday: null,
      growth30d: null,
      topMembers: [],
      lastUpdated: null,
      error: 'No community platform configured',
    };
  }

  try {
    const payload = await callSupabaseEdge('integration.community', {
      platform,
      hasFacebook,
      hasDiscord,
      hasMightyNetworks,
    });
    return {
      connected: true,
      platform,
      members: payload.members ?? null,
      activeToday: payload.activeToday ?? null,
      growth30d: payload.growth30d ?? null,
      topMembers: Array.isArray(payload.topMembers) ? payload.topMembers.slice(0, 5) : [],
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      platform,
      members: null,
      activeToday: null,
      growth30d: null,
      topMembers: [],
      lastUpdated: null,
      error: error.message || 'Failed to fetch community data',
    };
  }
}

export default { fetchCommunityStats, startCommunity };

/**
 * Begin the Community connection flow.
 * Invokes Hermes `integration.community.start` (placeholder success envelope).
 */
export async function startCommunity() {
  const res = await callSupabaseEdge('integration.community.start', { provider: 'community' });
  return {
    success: res?.success !== false,
    message: res?.message || 'Community connection started',
  };
}
