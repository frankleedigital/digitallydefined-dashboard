/**
 * Growth service — growth metrics and integrations.
 * Communicates only through ApiService.
 */
import api from './api';

export const GrowthService = {
  /** Fetch Google Analytics data */
  googleAnalytics: (params) => api.integrations.googleAnalytics(params),

  /** Fetch social media stats */
  social: (params) => api.integrations.social(params),

  /** Fetch email marketing stats */
  email: (params) => api.integrations.email(params),

  /** Fetch community stats */
  community: (params) => api.integrations.community(params),

  /** Start an integration connection flow */
  startIntegration: (type) => api.integrations.start(type),

  /** Fetch all integration statuses at once */
  allStatuses: () =>
    Promise.all([
      api.integrations.googleAnalytics({}).catch(() => ({ connected: false })),
      api.integrations.social({}).catch(() => ({ connected: false })),
      api.integrations.email({}).catch(() => ({ connected: false })),
      api.integrations.community({}).catch(() => ({ connected: false })),
    ]).then(([ga, social, email, community]) => ({
      googleAnalytics: ga,
      social,
      email,
      community,
      fetchedAt: new Date().toLocaleString(),
    })),
};

export default GrowthService;