import React, { useMemo } from "react";
import { Zap, ArrowRight, Lightbulb, AlertTriangle } from "lucide-react";
import { brutalBorder, brutalHeading, theme, brutalButtonPrimary } from "../theme";

/**
 * Next Action Engine — Priority #1 module of the Digital Real Estate OS.
 *
 * Core product loop: ASSETS → TRAFFIC → LEADS → REVENUE → AUTOMATION → MORE ASSETS
 * This component identifies the bottleneck and outputs the single highest-leverage
 * next action the user should take RIGHT NOW.
 *
 * It behaves like a business coach, not a metric display.
 */

const cardStyle = {
  border: brutalBorder,
  backgroundColor: theme.colors.panel,
};

const LOOP_STAGES = ["ASSETS", "TRAFFIC", "LEADS", "REVENUE", "AUTOMATION"];

const STAGE_COLORS = {
  ASSETS: theme.colors.aquaBlue,
  TRAFFIC: theme.colors.orange,
  LEADS: theme.colors.accent,
  REVENUE: theme.colors.success || "#4ade80",
  AUTOMATION: theme.colors.muted,
};

/**
 * Bottleneck detection logic.
 * Returns { stage, action, reasoning, urgency, secondaryActions[] }
 */
function detectBottleneck({ stats, data, integrations, automations }) {
  const actions = [];

  // --- Stage 0: ASSETS (foundation) ---
  const hasAnyAsset =
    stats.assetValue !== "$0" &&
    stats.assetValue !== "N/A" &&
    stats.assetValue !== undefined &&
    stats.topAsset !== "N/A";

  const connectedSources = [
    integrations?.googleAnalytics?.connected,
    integrations?.social?.connected,
    integrations?.email?.connected,
    integrations?.community?.connected,
  ].filter(Boolean).length;

  if (!hasAnyAsset && connectedSources === 0) {
    actions.push({
      stage: "ASSETS",
      urgency: "critical",
      action: "Connect your first data source (Google Analytics, email, or social)",
      reasoning: "No assets are tracked yet. The OS can't guide you until it knows what you own.",
      secondaryActions: [
        "Add your website to Google Analytics and connect it in Integrations",
        "Connect your email list (Mailerlite, Brevo, or ConvertKit)",
      ],
    });
  } else if (!hasAnyAsset && connectedSources > 0) {
    actions.push({
      stage: "ASSETS",
      urgency: "high",
      action: "Build your first digital asset — a lead magnet or pillar content piece",
      reasoning: "Sources are connected but no income-producing asset exists yet.",
      secondaryActions: [
        "Create a free lead magnet (PDF checklist, mini-guide) targeting your audience",
        "Publish one SEO-optimized pillar article on your strongest topic",
      ],
    });
  }

  // --- Stage 1: TRAFFIC ---
  const trafficLow =
    connectedSources > 0 &&
    (stats.communityGrowth === "0%" || stats.emailGrowth === "0%");

  if (hasAnyAsset && trafficLow) {
    actions.push({
      stage: "TRAFFIC",
      urgency: "high",
      action: "Publish 2 SEO articles targeting low-competition keywords in your niche",
      reasoning: "Assets exist but traffic growth is flat. Content is the compounding traffic engine.",
      secondaryActions: [
        "Repurpose your best asset into 5 faceless social posts",
        "Set up a content calendar for the next 14 days",
      ],
    });
  }

  // --- Stage 2: LEADS ---
  const leadsZero = Number(stats.leads) === 0 || stats.leads === "0";
  const hasTraffic = stats.communityGrowth !== "0%" || stats.emailGrowth !== "0%";

  if (hasAnyAsset && hasTraffic && leadsZero) {
    actions.push({
      stage: "LEADS",
      urgency: "high",
      action: "Add a lead capture form to your highest-traffic asset",
      reasoning: "Traffic is flowing but no one is being captured. You're leaking audience.",
      secondaryActions: [
        "Create a simple email opt-in form with a clear value exchange",
        "Offer your lead magnet as the incentive for email signup",
      ],
    });
  }

  // --- Stage 3: REVENUE ---
  const revenueZero = stats.revenue === "$0" || stats.revenue === 0 || stats.revenue === "0";
  const hasLeads = Number(stats.leads) > 0;

  if (hasLeads && revenueZero) {
    actions.push({
      stage: "REVENUE",
      urgency: "critical",
      action: "Launch your first offer to your email list — even a $27 digital product",
      reasoning: "You have leads but zero revenue. The fastest path to income is a simple paid offer.",
      secondaryActions: [
        "Package your knowledge into a short guide, template, or toolkit",
        "Send a 3-email launch sequence: problem → solution → offer",
      ],
    });
  }

  // --- Stage 4: AUTOMATION ---
  const automationCount = (automations || []).length;
  const hasRevenue = !revenueZero;

  if (hasRevenue && automationCount === 0) {
    actions.push({
      stage: "AUTOMATION",
      urgency: "medium",
      action: "Automate your most repetitive task — start with content repurposing or email follow-up",
      reasoning: "Revenue is flowing but you're doing everything manually. Automation compounds your output.",
      secondaryActions: [
        "Set up an automated welcome sequence for new subscribers",
        "Create a content repurposing workflow (1 article → 5 social posts)",
      ],
    });
  }

  // --- Fallback: if nothing matched, give the universal first action ---
  if (actions.length === 0) {
    actions.push({
      stage: "ASSETS",
      urgency: "medium",
      action: "Sync your integrations and review your asset portfolio",
      reasoning: "The OS needs current data to identify your highest-leverage move.",
      secondaryActions: [
        "Click 'Sync Vault' to pull latest metrics",
        "Review which assets are growing vs. stalled",
      ],
    });
  }

  // Sort by urgency: critical > high > medium
  const urgencyOrder = { critical: 0, high: 1, medium: 2 };
  actions.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  return actions;
}

const URGENCY_STYLES = {
  critical: { color: theme.colors.darkRed || "#ef4444", label: "CRITICAL" },
  high: { color: theme.colors.orange, label: "HIGH PRIORITY" },
  medium: { color: theme.colors.aquaBlue, label: "NEXT UP" },
};

function NextActionEngine({ stats, data, integrations, automations }) {
  const actions = useMemo(
    () => detectBottleneck({ stats, data, integrations, automations }),
    [stats, data, integrations, automations],
  );

  const primary = actions[0];
  if (!primary) return null;

  const urgencyStyle = URGENCY_STYLES[primary.urgency] || URGENCY_STYLES.medium;

  return (
    <section
      style={{
        ...cardStyle,
        padding: "1.1rem 1.25rem",
        display: "grid",
        gap: "0.85rem",
        borderLeft: `4px solid ${urgencyStyle.color}`,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
        <Zap size={18} color={urgencyStyle.color} />
        <h2 style={{ ...brutalHeading, margin: 0, fontSize: "0.9rem", flex: 1 }}>
          YOUR NEXT HIGHEST-LEVERAGE ACTION
        </h2>
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 900,
            letterSpacing: "0.08em",
            color: urgencyStyle.color,
            border: `1px solid ${urgencyStyle.color}`,
            padding: "0.15rem 0.45rem",
          }}
        >
          {urgencyStyle.label}
        </span>
      </div>

      {/* Loop position indicator */}
      <div style={{ display: "flex", gap: "0.3rem", alignItems: "center", flexWrap: "wrap" }}>
        {LOOP_STAGES.map((stage, i) => {
          const isActive = stage === primary.stage;
          return (
            <React.Fragment key={stage}>
              {i > 0 && <ArrowRight size={11} color={theme.colors.muted} />}
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 800,
                  letterSpacing: "0.05em",
                  padding: "0.15rem 0.4rem",
                  border: `1px solid ${isActive ? STAGE_COLORS[stage] : theme.colors.muted}44`,
                  color: isActive ? STAGE_COLORS[stage] : theme.colors.muted,
                  backgroundColor: isActive ? `${STAGE_COLORS[stage]}18` : "transparent",
                }}
              >
                {stage}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      {/* Primary action */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <Lightbulb size={20} color={theme.colors.orange} style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, lineHeight: 1.4 }}>
            {primary.action}
          </p>
          <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: theme.colors.muted, lineHeight: 1.5 }}>
            {primary.reasoning}
          </p>
        </div>
      </div>

      {/* Secondary actions */}
      {primary.secondaryActions?.length > 0 && (
        <div style={{ display: "grid", gap: "0.35rem", paddingLeft: "0.25rem" }}>
          {primary.secondaryActions.map((sa, i) => (
            <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <span style={{ color: theme.colors.aquaBlue, fontSize: "0.75rem", marginTop: 2 }}>→</span>
              <span style={{ fontSize: "0.82rem", color: theme.colors.textPrimary }}>{sa}</span>
            </div>
          ))}
        </div>
      )}

      {/* Show additional bottleneck actions if more than one */}
      {actions.length > 1 && (
        <div style={{ borderTop: `1px solid ${theme.colors.muted}22`, paddingTop: "0.6rem" }}>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, color: theme.colors.muted, letterSpacing: "0.05em" }}>
            ALSO IN QUEUE ({actions.length - 1} more)
          </span>
          {actions.slice(1, 3).map((a, i) => (
            <div key={i} style={{ marginTop: "0.3rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <AlertTriangle size={13} color={URGENCY_STYLES[a.urgency]?.color || theme.colors.muted} style={{ marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: "0.8rem", color: theme.colors.muted }}>{a.action}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default NextActionEngine;