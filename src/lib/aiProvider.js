// src/lib/aiProvider.js — Unified AI provider: Gemini -> OmniRoute -> Backend
import { geminiChat, shouldUsePro } from './gemini';
import { postAction } from '../services/api';

const OMNIROUTE_BASE = import.meta.env.VITE_OMNIROUTE_BASE_URL;
const OMNIROUTE_KEY = import.meta.env.VITE_OMNIROUTE_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function tryGemini(messages, opts) {
  if (!GEMINI_KEY) return null;
  return geminiChat(messages, opts);
}

async function tryOmniRoute(messages, opts) {
  if (!OMNIROUTE_BASE) return null;
  try {
    const res = await fetch(OMNIROUTE_BASE + '/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (OMNIROUTE_KEY || '') },
      body: JSON.stringify({ model: import.meta.env.VITE_OMNIROUTE_MODEL || 'auto', messages }),
    });
    if (!res.ok) return { ok: false, error: 'OmniRoute ' + res.status };
    const d = await res.json();
    return { ok: true, content: d.choices?.[0]?.message?.content || '', provider: 'omniroute' };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

async function tryBackend(messages, opts) {
  try {
    const d = await postAction('hermes.chat', { messages, ...opts }, { timeoutMs: 60000 });
    return { ok: true, content: d?.reply || '', provider: 'backend' };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function aiChat(messages, opts = {}) {
  const task = opts.task || 'chat';
  const usePro = shouldUsePro(task);
  const providers = [tryGemini, tryOmniRoute, tryBackend];
  for (const fn of providers) {
    const r = await fn(messages, { ...opts, usesPro: usePro });
    if (r && r.ok) return { ...r, provider: r.provider || 'gemini' };
    if (r && r.error) console.warn('[aiProvider] provider failed:', r.error);
  }
  return { ok: false, error: 'All AI providers unavailable' };
}

export default { aiChat };
