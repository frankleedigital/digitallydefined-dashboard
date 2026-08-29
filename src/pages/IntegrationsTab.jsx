import React from "react";
import { ExternalLink, Plug, Loader2, X } from "lucide-react";
import { brutalBorder, brutalEyebrow, brutalHeading, theme } from "../theme";
import useIntegrationConnect from "../hooks/useIntegrationConnect";

const cardStyle = {
  border: brutalBorder, // FIXED: no spreading a string
  backgroundColor: theme.colors.card,
  padding: "0.9rem",
};

const integrationMeta = {
  googleAnalytics: {
    title: "Google Analytics",
    description: "Website traffic, goals, and revenue signals.",
    href: "https://analytics.google.com/analytics/web/",
  },
  social: {
    title: "Social Pages",
    description: "Followers, engagement, and top content.",
    href: "https://business.facebook.com/",
  },
  email: {
    title: "Email List",
    description: "Subscribers, open rates, and campaign performance.",
    href: "https://app.brevo.com/",
  },
  community: {
    title: "Community",
    description: "Members, activity, and growth.",
    href: "https://www.facebook.com/groups/",
  },
};

function IntegrationsTab({ integrations }) {
  const map = integrations || {};
  const { connecting, notice, connect, clearNotice } = useIntegrationConnect();

  const cardConnectKey = {
    googleAnalytics: "googleAnalytics",
    social: "social",
    email: "email",
    community: "community",
  };

  const sections = Object.keys(integrationMeta).map((key) => {
    const meta = integrationMeta[key];
    const payload = map[key] || {};
    const status = payload.connected ? "Connected" : "Disconnected";
    const statusColor = payload.connected ? theme.colors.success : theme.colors.orange;
    const connectKey = cardConnectKey[key];
    const isConnecting = connecting === connectKey;

    return (
      <div key={key} style={{ ...cardStyle, display: "grid", gap: "0.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ ...brutalHeading, fontSize: "0.95rem", margin: "0 0 0.25rem" }}>{meta.title}</h3>
            <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.85rem" }}>{meta.description}</p>
          </div>
          <span style={{ ...brutalEyebrow, fontSize: "0.62rem", color: statusColor }}>{status}</span>
        </div>

        <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
          {payload.error && (
            <span style={{ color: theme.colors.darkRed }}>Error: {payload.error}</span>
          )}

          {key === "googleAnalytics" && (
            <>
              <span>Users 30d: {payload.users30d != null ? payload.users30d.toLocaleString() : "—"}</span>
              <span>Sessions 30d: {payload.sessions30d != null ? payload.sessions30d.toLocaleString() : "—"}</span>
              <span>Goal conversions: {payload.goalConversions ?? "—"}</span>
              <span>Revenue 30d: {payload.revenue30d != null ? `$${Number(payload.revenue30d).toLocaleString()}` : "—"}</span>
            </>
          )}

          {key === "social" && (
            <>
              <span>Followers: {payload.followers != null ? payload.followers.toLocaleString() : "—"}</span>
              <span>Engagement: {payload.engagementRate != null ? `${(payload.engagementRate * 100).toFixed(1)}%` : "—"}</span>
              <span>Impressions 30d: {payload.impressions30d != null ? payload.impressions30d.toLocaleString() : "—"}</span>
            </>
          )}

          {key === "email" && (
            <>
              <span>Subscribers: {payload.subscribers != null ? payload.subscribers.toLocaleString() : "—"}</span>
              <span>Open rate: {payload.openRate != null ? `${(payload.openRate * 100).toFixed(1)}%` : "—"}</span>
              <span>Click rate: {payload.clickRate != null ? `${(payload.clickRate * 100).toFixed(1)}%` : "—"}</span>
            </>
          )}

          {key === "community" && (
            <>
              <span>Members: {payload.members != null ? payload.members.toLocaleString() : "—"}</span>
              <span>Active today: {payload.activeToday ?? "—"}</span>
              <span>30d growth: {payload.growth30d != null ? `${(payload.growth30d * 100).toFixed(1)}%` : "—"}</span>
            </>
          )}
        </div>

        {payload.connected ? (
          <a
            href={meta.href}
            target="_blank"
            rel="noreferrer"
            style={{
              border: brutalBorder, // FIXED: no spread
              backgroundColor: theme.colors.card,
              color: theme.colors.textPrimary,
              padding: "0.45rem 0.6rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontWeight: 800,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            <Plug size={15} />
            Open {meta.title}
            <ExternalLink size={14} />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => connect(connectKey)}
            disabled={isConnecting}
            style={{
              border: brutalBorder,
              backgroundColor: theme.colors.orange,
              color: "#000000",
              padding: "0.45rem 0.6rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: isConnecting ? "progress" : "pointer",
              opacity: isConnecting ? 0.75 : 1,
            }}
          >
            {isConnecting ? (
              <>
                <Loader2 size={15} className="spin" />
                Connecting…
              </>
            ) : (
              <>
                <Plug size={15} />
                Connect {meta.title}
              </>
            )}
          </button>
        )}
      </div>
    );
  });

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {notice && (
        <div
          style={{
            border: brutalBorder,
            backgroundColor: notice.type === "success" ? theme.colors.success : theme.colors.darkRed,
            color: notice.type === "success" ? "#000000" : "#ffffff",
            padding: "0.6rem 0.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.9rem",
            fontWeight: 700,
          }}
        >
          <span>{notice.message}</span>
          <button
            type="button"
            onClick={clearNotice}
            aria-label="Dismiss"
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {sections}
    </div>
  );
}

export default IntegrationsTab;
