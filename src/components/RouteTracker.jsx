// src/components/RouteTracker.jsx
// Fires a deduped GA4 page_view on every route change (and the initial
// load). Renders nothing. Must live INSIDE <BrowserRouter>.
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/ga";

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Runs on mount (initial view) and on every pathname/search change.
    // StrictMode's double effect-invoke in dev is harmless: trackPageView
    // dedupes by pathname+search and the tag only loads in production.
    trackPageView(location);
  }, [location.pathname, location.search]);

  return null;
}
