// hooks/useIntegrationConnect.js
// Shared logic for the dashboard integration Connect buttons.
// Manages a per-card "connecting" state and a lightweight inline notification
// (success/failure) that the tabs render. Each Connect click invokes the
// Hermes edge function's integration.<name>.start action via the lib layer.

import { useCallback, useState } from "react";
import {
  startGoogleAnalytics,
  startSocial,
  startEmail,
  startCommunity,
} from "../lib/integrations";

// Which starter fires for each integration card key (matches the keys the
// dashboard passes into GrowthTab / IntegrationsTab).
export const INTEGRATION_STARTERS = {
  googleAnalytics: startGoogleAnalytics,
  social: startSocial,
  email: startEmail,
  community: startCommunity,
};

export const INTEGRATION_LABELS = {
  googleAnalytics: "Google Analytics",
  social: "Social Pages",
  email: "Email List",
  community: "Community",
};

export function useIntegrationConnect() {
  // The integration key currently starting (no concurrent connects).
  const [connecting, setConnecting] = useState(null);
  // { type: 'success' | 'error', message } or null.
  const [notice, setNotice] = useState(null);

  const clearNotice = useCallback(() => setNotice(null), []);

  const connect = useCallback(
    async (key) => {
      const starter = INTEGRATION_STARTERS[key];
      if (!starter || connecting) return;
      const label = INTEGRATION_LABELS[key] || key;

      setConnecting(key);
      setNotice(null);
      try {
        const result = await starter();
        if (result?.success) {
          setNotice({
            type: "success",
            message: result.message || `${label} connected.`,
          });
        } else {
          setNotice({
            type: "error",
            message: result?.error || `Could not connect ${label}.`,
          });
        }
      } catch (err) {
        setNotice({
          type: "error",
          message: err?.message || `Could not connect ${label}.`,
        });
      } finally {
        setConnecting(null);
      }
    },
    [connecting],
  );

  return { connecting, notice, connect, clearNotice };
}

export default useIntegrationConnect;