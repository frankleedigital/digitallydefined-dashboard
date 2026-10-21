// src/pages/AIStatusPanel.jsx
// AI Infrastructure Status panel — live provider health for Hermes fallback chain.
// Fetches hermes.status via the shared API service and displays provider, model, latency, health, fallback rank.
import React, { useEffect, useState } from 'react';
import { refreshCw, database } from 'lucide-react';
import { brutalBorder, brutalHeading, theme } from '../theme';
import api from '../services/api';

const STATUS_COLOR = {
  healthy: theme.colors.success,
  degraded: theme.colors.orange,
  unhealthy: theme.colors.darkRed,
};

const STATUS_LABEL = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  unhealthy: 'Down',
};

function statusDot(status) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: STATUS_COLOR[status] || theme.colors.muted,
        marginRight: 6,
      }}
    />
  );
}

function rankBadge(rank) {
  const labels = { 1: 'PRIMARY', 2: 'SECONDARY', 3: 'TERTIARY', 4: 'EMERGENCY' };
  return (
    <span
      style={{
        fontSize: '0.65rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        padding: '0.15rem 0.4rem',
        border: brutalBorder,
        borderRadius: 4,
        backgroundColor: theme.colors.card,
        color: theme.colors.muted,
      }}
    >
      {labels[rank] || rank}
    </span>
  );
}

export default function AIStatusPanel() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await api.hermesStatus();
      if (data?.success) {
        setHealth(data);
        setError(null);
      } else {
        setError(data?.error || 'Health check failed');
      }
    } catch (err) {
      setError(err?.message || 'Backend unreachable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const iv = setInterval(fetchHealth, 30000);
    return () => clearInterval(iv);
  }, []);

  if (!health) {
    return (
      <div style={{ border: brutalBorder, backgroundColor: theme.colors.card, padding: '1rem', margin: '1rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <refreshCw size={16} style={{ color: theme.colors.muted }} />
          <h3 style={{ ...brutalHeading, fontSize: '0.95rem', margin: 0 }}>AI Infrastructure Status</h3>
          {loading && <span style={{ fontSize: '0.75rem', color: theme.colors.muted }}>Loading…</span>}
          {error && <span style={{ fontSize: '0.75rem', color: theme.colors.darkRed }}>Error: {error}</span>}
        </div>
        {error && (
          <p style={{ fontSize: '0.85rem', color: theme.colors.darkRed, margin: 0 }}>
            Could not load provider health. Ensure Hermes status endpoint is deployed.
          </p>
        )}
        {!error && loading && (
          <p style={{ fontSize: '0.85rem', color: theme.colors.muted, margin: 0 }}>Checking provider health…</p>
        )}
      </div>
    );
  }

  const order = health.fallbackOrder || ['omniroute', 'vertex-gemini', 'agentrouter', 'cheap-inference'];
  const healthByName = health.providerHealth || {};
  const activeProvider = health.activeProvider || null;

  return (
    <div style={{ border: brutalBorder, backgroundColor: theme.colors.card, padding: '1rem', margin: '1rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <database size={18} style={{ color: theme.colors.muted }} />
          <h3 style={{ ...brutalHeading, fontSize: '0.95rem', margin: 0 }}>AI Infrastructure Status</h3>
        </div>
        <button
          type="button"
          onClick={fetchHealth}
          disabled={loading}
          style={{
            border: brutalBorder,
            backgroundColor: theme.colors.card,
            color: theme.colors.textPrimary,
            padding: '0.35rem 0.6rem',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: loading ? 'progress' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          {loading ? (
            <refreshCw size={14} className="spin" style={{ color: theme.colors.muted }} />
          ) : (
            <refreshCw size={14} style={{ color: theme.colors.muted }} />
          )}
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div style={{ fontSize: '0.8rem', color: theme.colors.muted, marginBottom: '0.75rem' }}>
        Active provider:{' '}
        <span style={{ fontWeight: 800, color: activeProvider ? STATUS_COLOR.healthy : STATUS_COLOR.unhealthy, textTransform: 'uppercase' }}>
          {activeProvider || 'none'}
        </span>
        {health.checkedAt && (
          <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', opacity: 0.7 }}>
            checked {new Date(health.checkedAt).toLocaleTimeString()}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {order.map((provider, idx) => {
          const h = healthByName[provider];
          const rank = idx + 1;
          const isActive = provider === activeProvider;
          const status = h?.status || 'unhealthy';
          const latency = h?.latency != null ? `${h.latency}ms` : '—';
          const models = (h?.availableModels || []).slice(0, 3).join(', ') || '—';
          const authenticated = h?.authenticated ? 'authenticated' : 'not authenticated';
          const reachable = h?.reachable ? 'reachable' : 'unreachable';

          return (
            <div
              key={provider}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.6rem',
                padding: '0.5rem',
                border: brutalBorder,
                backgroundColor: isActive ? '#e7f8e7' : theme.colors.background,
                borderLeft: isActive ? `3px solid ${theme.colors.success}` : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                <statusDot status={status} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: theme.colors.textPrimary }}>
                  {provider.replace('-', ' ')}
                </span>
                {rankBadge(rank)}
                {isActive && (
                  <span style={{ fontSize: '0.7rem', backgroundColor: theme.colors.success, color: '#000', padding: '0.1rem 0.35rem', borderRadius: 3, fontWeight: 800, textTransform: 'uppercase' }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: theme.colors.muted }}>
                <span>{statusDot(status)}{STATUS_LABEL[status]}</span>
                <span>• {latency}</span>
                <span>• {authenticated}</span>
                <span>• {reachable}</span>
                <span>• models: {models}</span>
                {h?.error && (
                  <span style={{ color: theme.colors.darkRed, fontSize: '0.7rem' }}>error: {h.error}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: theme.colors.muted, borderTop: brutalBorder, paddingTop: '0.5rem' }}>
        Chain:{' '}
        {order.map((p, i) => `${i + 1}. ${p}`).join(' → ')}
        → degraded response
      </div>
    </div>
  );
}
