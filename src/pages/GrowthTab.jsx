import React from "react";
import { TrendingUp, Users, Loader2, X } from "lucide-react"; // cleaned imports
import {
  brutalBorder,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";
import useIntegrationConnect from "../hooks/useIntegrationConnect";

const cardStyle = {
  border: brutalBorder, // FIXED: no spreading a string
  backgroundColor: theme.colors.card,
  padding: "0.9rem",
};

const IntegrationCard = ({
  title,
  description,
  status,
  cta,
  connecting,
  onConnect,
  children,
}) => (
  <div style={{ ...cardStyle, display: "grid", gap: "0.6rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
      <div>
        <h3 style={{ ...brutalHeading, fontSize: "0.95rem", margin: "0 0 0.25rem" }}>{title}</h3>
        <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.85rem" }}>{description}</p>
      </div>
      <span
        style={{
          ...brutalEyebrow,
          fontSize: "0.62rem",
          color: status === "connected" ? theme.colors.success : theme.colors.orange,
        }}
      >
        {status === "connected" ? "Connected" : "Disconnected"}
      </span>
    </div>
    {children}
    <button
      type="button"
      onClick={onConnect}
      disabled={connecting}
      style={{
        border: brutalBorder, // FIXED: no spread
        backgroundColor: status === "connected" ? theme.colors.card : theme.colors.orange,
        color: status === "connected" ? theme.colors.textPrimary : "#000000",
        padding: "0.55rem 0.7rem",
        fontWeight: 800,
        cursor: connecting ? "progress" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        opacity: connecting ? 0.75 : 1,
      }}
    >
      {connecting ? (
        <>
          <Loader2 size={15} className="spin" />
          Connecting…
        </>
      ) : (
        cta
      )}
    </button>
  </div>
);

const emptyBlock = (label) => (
  <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.85rem" }}>{label}</p>
);

function GrowthTab({ integrations }) {
  const ga = integrations?.googleAnalytics || {};
  const social = integrations?.social || {};
  const email = integrations?.email || {};
  const community = integrations?.community || {};
  const { connecting, notice, connect, clearNotice } = useIntegrationConnect();

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
      <div
        style={{
          ...cardStyle,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "0.75rem",
        }}
      >
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>Visitors 30d</div>
          <strong>{ga.users30d != null ? ga.users30d.toLocaleString() : "N/A"}</strong>
        </div>
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>Sessions 30d</div>
          <strong>{ga.sessions30d != null ? ga.sessions30d.toLocaleString() : "N/A"}</strong>
        </div>
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>Revenue 30d</div>
          <strong>
            {ga.revenue30d != null ? `$${Number(ga.revenue30d).toLocaleString()}` : "N/A"}
          </strong>
        </div>
        <div>
          <div style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>Social Followers</div>
          <strong>{social.followers != null ? social.followers.toLocaleString() : "N/A"}</strong>
        </div>
      </div>

      <section style={{ display: "grid", gap: "0.5rem" }}>
        <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>Connected Sources</h3>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          <IntegrationCard
            title="Google Analytics"
            description={ga.propertyId || "Traffic, goals, and revenue."}
            status={ga.connected ? "connected" : "disconnected"}
            cta={ga.connected ? "Open Analytics" : "Connect Google Analytics"}
            connecting={connecting === "googleAnalytics"}
            onConnect={() => connect("googleAnalytics")}
          >
            {ga.connected ? (
              <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
                <span>Bounce rate: {ga.bounceRate != null ? `${(ga.bounceRate * 100).toFixed(1)}%` : "N/A"}</span>
                <span>Goal conversions: {ga.goalConversions ?? "N/A"}</span>
              </div>
            ) : (
              emptyBlock("Connect Analytics to see visitors, sessions, and conversions.")
            )}
          </IntegrationCard>

          <IntegrationCard
            title="Social Pages"
            description="Followers, engagement, and impressions."
            status={social.connected ? "connected" : "disconnected"}
            cta={social.connected ? "Manage Social" : "Connect Social"}
            connecting={connecting === "social"}
            onConnect={() => connect("social")}
          >
            {social.connected ? (
              <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
                <span>Engagement rate: {social.engagementRate != null ? `${(social.engagementRate * 100).toFixed(1)}%` : "N/A"}</span>
                <span>Impressions 30d: {social.impressions30d != null ? social.impressions30d.toLocaleString() : "N/A"}</span>
              </div>
            ) : (
              emptyBlock("Connect your social pages to track reach and engagement.")
            )}
          </IntegrationCard>

          <IntegrationCard
            title="Email List"
            description={email.provider ? `${email.provider} list` : "Subscriber email performance."}
            status={email.connected ? "connected" : "disconnected"}
            cta={email.connected ? "Open Email Provider" : "Connect Email"}
            connecting={connecting === "email"}
            onConnect={() => connect("email")}
          >
            {email.connected ? (
              <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
                <span>Subscribers: {email.subscribers != null ? email.subscribers.toLocaleString() : "N/A"}</span>
                <span>Open rate: {email.openRate != null ? `${(email.openRate * 100).toFixed(1)}%` : "N/A"}</span>
                <span>Click rate: {email.clickRate != null ? `${(email.clickRate * 100).toFixed(1)}%` : "N/A"}</span>
              </div>
            ) : (
              emptyBlock("Connect Brevo or Mailchimp to read list growth and revenue.")
            )}
          </IntegrationCard>

          <IntegrationCard
            title="Community"
            description={community.platform ? community.platform : "Membership activity and growth."}
            status={community.connected ? "connected" : "disconnected"}
            cta={community.connected ? "Open Community" : "Connect Community"}
            connecting={connecting === "community"}
            onConnect={() => connect("community")}
          >
            {community.connected ? (
              <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
                <span>Members: {community.members != null ? community.members.toLocaleString() : "N/A"}</span>
                <span>Active today: {community.activeToday ?? "N/A"}</span>
                <span>30d growth: {community.growth30d != null ? `${(community.growth30d * 100).toFixed(1)}%` : "N/A"}</span>
              </div>
            ) : (
              emptyBlock("Connect your community to see growth and engagement signals.")
            )}
          </IntegrationCard>
        </div>
      </section>
    </div>
  );
}

export default GrowthTab;
