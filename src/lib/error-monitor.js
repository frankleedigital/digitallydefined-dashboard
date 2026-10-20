/**
 * error-monitor.js — client+server error capture for the dashboard.
 * - Captures client errors (window handlers, React boundary hook)
 * - Records request failures (wraps api-client errors)
 * - Verbose debug output in development
 * - Prepared for Sentry: set window.__SENTRY__ or VITE_SENTRY_DSN later
 */
const ring = [];
const MAX = 100;

function entry(level, kind, message, context) {
  const e = { at: new Date().toISOString(), level, kind, message: String(message || ''), context: context || null };
  ring.push(e);
  if (ring.length > MAX) ring.shift();
  try {
    if (import.meta.env.DEV) (console[level] || console.log)('[error-monitor]', kind + ':', e.message, e.context || '');
    else if (level === 'error') console.error('[error-monitor]', kind + ':', e.message);
  } catch { /* noop */ }
  try {
    if (typeof window !== 'undefined' && window.__SENTRY__ && typeof window.__SENTRY__.captureException === 'function') {
      window.__SENTRY__.captureException(new Error(e.message), { extra: e });
    }
  } catch { /* sentry optional */ }
  return e;
}

export function captureClientError(err, context) {
  return entry('error', 'client', (err && err.message) || String(err), { ...context, stack: err && err.stack ? String(err.stack).slice(0, 2000) : null });
}
export function captureServerError(err, context) {
  return entry('error', 'server', (err && err.message) || String(err), context);
}
export function recordRequestFailure(info) {
  return entry('warn', 'request', info.message || 'request failed', { url: info.url, action: info.action, code: info.code, status: info.status });
}
export function debugInfo() {
  return { recent: ring.slice(-20), count: ring.length, env: import.meta.env.MODE, base: import.meta.env.VITE_API_URL || 'default' };
}
export function installGlobalHandlers() {
  try {
    if (typeof window === 'undefined' || window.__DD_ERR_INSTALLED__) return;
    window.__DD_ERR_INSTALLED__ = true;
    window.addEventListener('error', (ev) => captureClientError(ev.error || ev.message, { source: 'window.onerror' }));
    window.addEventListener('unhandledrejection', (ev) => captureClientError(ev.reason, { source: 'unhandledrejection' }));
  } catch { /* noop */ }
}
export default { captureClientError, captureServerError, recordRequestFailure, debugInfo, installGlobalHandlers };
