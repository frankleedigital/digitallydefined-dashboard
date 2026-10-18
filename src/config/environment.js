/**
 * Environment validator — validates env config at startup.
 *
 * RULES:
 * - Warns if VITE_API_URL is missing or invalid.
 * - Verifies backend health endpoint is reachable.
 * - Provides user-friendly diagnostics.
 */

const REQUIRED_VARS = {
  VITE_API_URL: {
    label: 'Backend API URL',
    fallback: 'https://digitallydefined-os-backend.vercel.app',
    validator: (v) => {
      if (!v) return { valid: false, message: 'VITE_API_URL is not set. Using default.' };
      try {
        new URL(v);
        return { valid: true };
      } catch {
        return { valid: false, message: `VITE_API_URL "${v}" is not a valid URL.` };
      }
    },
  },
  VITE_SUPABASE_URL: {
    label: 'Supabase Project URL',
    fallback: 'https://dijjlppdljpcgyoakdnq.supabase.co',
    validator: (v) => {
      if (!v) return { valid: false, message: 'VITE_SUPABASE_URL is not set. Auth may fail.' };
      return { valid: true };
    },
  },
  VITE_DASHBOARD_API_KEY: {
    label: 'Dashboard API Key',
    fallback: 'DigitallyDefined-OS-2026',
    validator: (v) => {
      if (!v) return { valid: false, message: 'VITE_DASHBOARD_API_KEY is not set. API calls may be rejected.' };
      return { valid: true };
    },
  },
};

function resolveVar(key) {
  const cfg = REQUIRED_VARS[key];
  const value = import.meta.env[key];
  if (value) return { value, source: 'env' };
  return { value: cfg.fallback, source: 'default' };
}

function validateAll() {
  const results = [];
  for (const [key, cfg] of Object.entries(REQUIRED_VARS)) {
    const { value, source } = resolveVar(key);
    const check = cfg.validator(value);
    results.push({
      key,
      label: cfg.label,
      value: source === 'default' ? `${value} (default)` : value,
      source,
      valid: check.valid,
      message: check.message || 'OK',
    });
  }
  return results;
}

function formatDiagnostics(results) {
  const lines = ['\n═══ DigitallyDefined Environment Diagnostics ═══'];
  for (const r of results) {
    const icon = r.valid ? '✓' : '⚠';
    lines.push(`  ${icon} ${r.label}: ${r.value}`);
    if (r.message && !r.valid) lines.push(`     ${r.message}`);
  }
  lines.push('═══════════════════════════════════════════════\n');
  return lines.join('\n');
}

/**
 * Run validation. In dev mode, logs warnings to console.
 * In all modes, returns the validation results array.
 */
export function validateEnvironment() {
  const results = validateAll();
  const diagnostics = formatDiagnostics(results);

  if (import.meta.env.DEV) {
    const hasIssues = results.some((r) => !r.valid);
    if (hasIssues) {
      console.warn(diagnostics);
    } else {
      console.info(diagnostics);
    }
  }

  return results;
}

/**
 * Check backend connectivity by hitting the health endpoint.
 * Returns { ok, status, error }.
 */
export async function checkBackendConnectivity() {
  const { default: api } = await import('../services/api');
  return api.checkHealth();
}

/**
 * Full startup check — validates env + pings backend.
 * Returns { env: results[], backend: {...} }.
 */
export async function fullEnvironmentCheck() {
  const envResults = validateAll();
  let backendResult;
  try {
    backendResult = await checkBackendConnectivity();
  } catch {
    backendResult = { ok: false, error: 'Health check threw unexpectedly' };
  }
  return { env: envResults, backend: backendResult };
}

export default { validateEnvironment, checkBackendConnectivity, fullEnvironmentCheck };