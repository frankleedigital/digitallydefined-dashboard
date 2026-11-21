// src/lib/premium.js
// Premium gating client for DigitallyDefined Dashboard.
// Verifies Gumroad license keys via the Hermes edge function (`license.verify`)
// and caches the entitlement locally for 24h.

import { callSupabaseEdge } from './supabase-edge';

const CACHE_KEY = 'dd-premium-entitlement';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.licensed || Date.now() > (data.cachedAt || 0) + CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

export function getCachedEntitlement() {
  return readCache();
}

export function clearEntitlement() {
  try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
}

/**
 * Verify a Gumroad license key through the Hermes edge function.
 * @returns {Promise<{licensed: boolean, reason?: string, email?: string|null, product?: string}>}
 */
export async function verifyLicense(licenseKey, email = '') {
  const result = await callSupabaseEdge('license.verify', { licenseKey, email });
  if (result?.licensed) {
    const entitlement = {
      licensed: true,
      email: result.email || null,
      product: result.product || null,
      cachedAt: Date.now(),
    };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(entitlement)); } catch { /* ignore */ }
    return entitlement;
  }
  clearEntitlement();
  return {
    licensed: false,
    reason: result?.reason || 'verification_error',
  };
}

export default { verifyLicense, getCachedEntitlement, clearEntitlement };