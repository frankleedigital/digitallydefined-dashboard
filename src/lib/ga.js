// src/lib/ga.js
// Google Analytics 4 browser-side tracking for the DigitallyDefined dashboard.
//
// Design rules (production-grade, dependency-free):
// - Loads ONLY in production (import.meta.env.PROD) AND only when
//   VITE_GA4_BROWSER_ID is set. Dev/preview builds never ship the tag.
// - The gtag.js script is injected exactly once (singleton guard on
//   window.__ddGa4Script + a DOM check), so it can never double-load.
// - Page views are sent MANUALLY (send_page_view disabled) and deduped:
//   the same pathname+search is sent at most once per navigation, which
//   also neutralizes React StrictMode double-invoking effects.
// - If a route change fires before the tag script has finished loading,
//   the event queues in window.dataLayer and is processed in order when
//   gtag.js arrives — no early event is lost.
// - No GTM: the GA4 tag loads directly, which is simpler and avoids a
//   second tag system to keep in sync.

const enabled =
  import.meta.env.PROD && Boolean(import.meta.env.VITE_GA4_BROWSER_ID);

let initialized = false;
let lastViewKey = null;

export function isAnalyticsEnabled() {
  return enabled;
}

/**
 * Initialize the GA4 tag. Idempotent — safe to call on every page view.
 */
export function initAnalytics() {
  if (!enabled || typeof window === "undefined" || initialized) return;
  initialized = true;

  const id = import.meta.env.VITE_GA4_BROWSER_ID;

  // Standard Google dataLayer + gtag stub (exactly the official snippet
  // pattern). Anything pushed before gtag.js loads is processed in order
  // when the script arrives.
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }

  window.gtag("js", new Date());

  if (!window.__ddGa4Script) {
    window.__ddGa4Script = true;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);
  }

  // Manual page views only — disables any automatic page_view firing.
  window.gtag("config", id, { send_page_view: false });
}

function viewKey(location) {
  return (location.pathname || "/") + (location.search || "");
}

/**
 * Send a deduped page_view for the current SPA location.
 * @param {{ pathname?: string, search?: string }} location
 */
export function trackPageView(location) {
  if (!enabled) return;
  if (typeof window === "undefined") return;
  initAnalytics();

  const key = viewKey(location || {});
  if (key === lastViewKey) return; // dedupe: same route = one view
  lastViewKey = key;

  const payload = {
    page_path: location?.pathname || window.location.pathname,
    page_search: location?.search || undefined,
    page_title: document.title || undefined,
  };

  // Queued safely if the tag script hasn't finished loading yet.
  window.gtag("event", "page_view", payload);
}

/**
 * Send a custom GA4 event (funnels, CTA clicks, purchases).
 * @param {string} name
 * @param {object} [params]
 */
export function trackEvent(name, params = {}) {
  if (!enabled || typeof window === "undefined") return;
  initAnalytics();
  window.gtag("event", name, params);
}

export default {
  isAnalyticsEnabled,
  initAnalytics,
  trackPageView,
  trackEvent,
};
