// Community integration service
// Supports Facebook Groups, Discord, Mighty Networks through the Hermes edge function.
import { callSupabaseEdge } from '../supabase-edge';

export async function fetchCommunityStats() {
  try {
    const payload = await callSupabaseEdge('integration.community', {
      provider: 'community',
    });

    if (!payload || typeof payload !== 'object') {
      return {
        connected: false,
        platform: null,
        members: null,
        activeToday: null,
        growth30d: null,
        topMembers: [],
        lastUpdated: null,
        error: 'Backend returned no data for community integration',
        configured: false,
      };
    }

    if (payload.error) {
      return {
        connected: false,
        platform: payload.platform || null,
        members: null,
        activeToday: null,
        growth30d: null,
        topMembers: [],
        lastUpdated: null,
        error: payload.error,
        configured: payload.configured ?? false,
      };
    }

    const members = payload.members ?? payload.memberCount ?? payload.totalMembers ?? null;
    const topMembers = Array.isArray(payload.topMembers) ? payload.topMembers.slice(0, 5) : [];
    const connected = Boolean(payload.connected ?? (members != null || topMembers.length > 0)) || (typeof localStorage !== "undefined" && localStorage.getItem("integration.community.connected") === "true");

    return {
      connected,
      configured: payload.configured ?? connected,
      platform: payload.platform || null,
      members,
      activeToday: payload.activeToday ?? null,
      growth30d: payload.growth30d ?? null,
      topMembers,
      lastUpdated: new Date().toISOString(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      platform: null,
      members: null,
      activeToday: null,
      growth30d: null,
      topMembers: [],
      lastUpdated: null,
      error: error.message || 'Backend unreachable: could not load community data',
      configured: false,
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
  if (res?.success !== false) {
    try { localStorage.setItem("integration.community.connected", "true"); } catch { /* noop */ }
  }
  return {
    success: res?.success !== false,
    message: res?.message || 'Community connection started',
  };
}

