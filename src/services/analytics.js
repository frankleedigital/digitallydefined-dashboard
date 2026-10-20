/**
 * Analytics service — dashboard data and analytics.
 * Communicates only through ApiService.
 */
import api from './api';

export const AnalyticsService = {
  /** Fetch dashboard data (main sync) */
  dashboard: (userId) => api.dashboard.fetch(userId),

  /** Fetch AI recommendations */
  recommendations: (context) => api.post('ai.recommendations', { context }),

  /** Fetch intelligence data */
  intelligence: (answers) => api.intelligence.fetch(answers),

  /** Sync vault / trigger automation sync */
  sync: (userId) => api.dashboard.sync(userId),

  /** List automations */
  automations: (userId) => api.dashboard.automations(userId),
};

export default AnalyticsService;