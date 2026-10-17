export function getHermesEndpoint() {
  if (import.meta.env.VITE_HERMES_ENDPOINT) {
    return import.meta.env.VITE_HERMES_ENDPOINT;
  }
  const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dijjlppdljpcgyoakdnq.supabase.co';
  return `${baseUrl}/functions/v1/hermes`;
}

export function getHermesHeaders(extra = {}) {
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!anonKey && import.meta.env.DEV) {
    console.warn('[Hermes] VITE_SUPABASE_ANON_KEY is not set. AI features may fail.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': import.meta.env.VITE_DASHBOARD_API_KEY || 'DigitallyDefined-OS-2026',
    ...extra,
  };

  if (anonKey) {
    headers['apikey'] = anonKey;
    headers['Authorization'] = `Bearer ${anonKey}`;
  }

  return headers;
}

let typingCallback = null;

export function onHermesTyping(cb) {
  typingCallback = cb;
}

export async function getHermesStatus() {
  try {
    const res = await fetch('/api/hermes/status', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return { online: false, status: res.status, checkedAt: Date.now() };
    const data = await res.json();
    return {
      online: Boolean(data?.online),
      status: data?.status ?? res.status,
      provider: data?.provider || null,
      checkedAt: Date.now(),
    };
  } catch (err) {
    return { online: false, error: err instanceof Error ? err.message : String(err), checkedAt: Date.now() };
  }
}

export async function sendToHermes(message, context = {}) {
  if (typingCallback) typingCallback(true);

  try {
    const action =
      (import.meta.env.VITE_HERMES_ACTION) ||
      (context.devMode ? 'mentor.dev' : 'hermes.agent');

    const res = await fetch(getHermesEndpoint(), {
      method: 'POST',
      headers: getHermesHeaders(),
      body: JSON.stringify({
        action,
        message,
        systemPrompt: context.systemPrompt || context.system || null,
        toolState: context.toolState || null,
        page: context.page || null,
        ...context,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `Hermes request failed: ${res.status}`);
    }

    return await res.json();
  } finally {
    if (typingCallback) typingCallback(false);
  }
}

export default { getHermesEndpoint, getHermesHeaders, sendToHermes };
