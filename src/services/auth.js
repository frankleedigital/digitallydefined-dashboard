/**
 * Auth service — authentication and API key management.
 * Communicates only through ApiService.
 */
import api from './api';

export const AuthService = {
  /** Verify API key against backend */
  verify: () => api.post('auth.verify'),

  /** Verify Gumroad license */
  verifyLicense: (key) => api.license.verify(key),

  /** Get current environment status from backend */
  envStatus: () => api.post('test-env'),

  /** Check backend health */
  health: () => api.checkHealth(),
};

export default AuthService;