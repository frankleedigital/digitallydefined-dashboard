/**
 * lib/api.js (dashboard)
 * Unified agent access: Hermes (Supabase edge via backend `/api`) OR FastAPI
 * (microservice layer via the backend proxy, action: fastapi.*).
 *
 * The dashboard talks to the backend `/api` (VITE_DASHBOARD_API_URL); the
 * backend dispatcher forwards `fastapi.*` actions to the FastAPI server.
 */
import { callSupabaseEdge } from './supabase-edge';
import { runtimeFor } from './agentRegistry';

export const FASTAPI_ACTIONS = {
  product: 'fastapi.product',
  niche: 'fastapi.niche',
  domain: 'fastapi.domain',
  affiliate: 'fastapi.affiliate',
  rankrent: 'fastapi.rankrent',
  blueprint: 'fastapi.blueprint',
  roadmap: 'fastapi.roadmap',
  trends: 'fastapi.trends',
};

/** Call a FastAPI microservice through the backend proxy. */
export async function callFastAPI(action, payload = {}) {
  const route = FASTAPI_ACTIONS[action] || action;
  return callSupabaseEdge(route, { inputData: payload });
}

/**
 * Call an agent by action string, routing automatically to FastAPI or Hermes
 * based on the registry. Unknown/default actions go to Hermes.
 */
export async function callSmartAgent(agent, payload = {}) {
  const action = /\./.test(agent) ? agent : `agent.${agent}`;
  if (runtimeFor(action) === 'fastapi') {
    const sub = action.startsWith('fastapi.') ? action.slice('fastapi.'.length) : action.replace(/^agent\./, '');
    return callFastAPI(sub, payload);
  }
  return callSupabaseEdge(action, payload);
}

export default { callFastAPI, callSmartAgent, FASTAPI_ACTIONS };