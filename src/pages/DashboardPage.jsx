import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3,
  Bot,
  BrainCircuit,
  Database,
  DollarSign,
  FolderHeart,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Workflow,
  X,
  ExternalLink,
  Plug,
  FileText,
} from "lucide-react";
import CONFIG from "../config";
import Logo from "../components/Logo";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalCard,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";
import { getSupabaseEdgeUrl, getSupabaseEdgeHeaders } from "../lib/supabase-edge";
import GrowthTab from "./GrowthTab";
import IntegrationsTab from "./IntegrationsTab";
import NotionTab from "./NotionTab";
import AntigravityPage from "./AntigravityPage";
import {
  fetchGoogleAnalytics,
  fetchSocialStats,
  fetchEmailStats,
  fetchCommunityStats,
  fetchNotionData,
} from "../lib/integrations";

const dashboardConfig = CONFIG.dashboard;

const dashboardLabels = {
  syncButton: dashboardConfig.syncButtonLabel || "Sync Vault",
  settings:
    dashboardConfig.settingsLabel ||
    dashboardConfig.systemKeysLabel ||
    "Settings",
  navigation: dashboardConfig.navigationTitle || "Navigation",
  noSync: dashboardConfig.noSyncLabel || "No sync yet",
  saveSettings:
    dashboardConfig.saveSettingsLabel ||
    dashboardConfig.saveKeysLabel ||
    "Save Settings",
  metrics: {
    revenue: dashboardConfig.metrics?.revenue || "Revenue",
    leads: dashboardConfig.metrics?.leads || "Leads",
    conversion: dashboardConfig.metrics?.conversion || "Conversion",
    assetValue:
      dashboardConfig.metrics?.assetValue ||
      dashboardConfig.stats?.assetValue ||
      "Asset Value",
  },
};

const API_URL = getSupabaseEdgeUrl();

const API_KEY = import.meta.env.VITE_DASHBOARD_API_KEY || "";
const API_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

// Validate API_KEY is set
if (!API_KEY) {
  console.warn("[Dashboard] VITE_DASHBOARD_API_KEY not configured");
}

const ASSISTANT_MODEL =
  import.meta.env.VITE_DASHBOARD_ASSISTANT_MODEL ||
  dashboardConfig.assistantModel ||
  "gemini-2.5-flash";

const assistantWelcome = {
  role: "assistant",
  content:
    "I am ready. Sync the Vault, then ask me what needs attention, what automations look stuck, or what move should come next.",
};

const tabIcons = {
  dashboard: LayoutDashboard,
  reputation: ShieldCheck,
  intel: BarChart3,
  growth: TrendingUp,
  brain: BrainCircuit,
  automations: Workflow,
  integrations: Settings,
  notion: FileText,
  antigravity: Database,
};

const formatConversion = (value) => {
  if (typeof value === "string" && value.trim() !== "") return value;
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
};

const formatAssetValue = (value) => {
  if (typeof value === "number") return `$${value.toLocaleString()}`;
  if (typeof value === "string" && value.trim() !== "") return value;
  return CONFIG.metrics.assetValue;
};

const cardStyle = {
  ...brutalCard,
  backgroundColor: theme.colors.card,
};

const compactGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: "0.75rem",
};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const summarizeList = (items, mapper, limit = 5) =>
  normalizeArray(items)
    .slice(0, limit)
    .map(mapper)
    .filter(Boolean);

const normalizeData = (payload = {}) => ({
  reviews: normalizeArray(payload.reviews).map((review) => ({
    ...review,
    name: review.name || review.reviewerName || "Anonymous",
    reviewText: review.reviewText || review.text || "",
    aiDraftedResponse:
      review.aiDraftedResponse ||
      review.aIDraftedResponse ||
      review.aiResponse ||
      "",
  })),
  competitors: normalizeArray(payload.competitors),
  community: normalizeArray(payload.community),
  campaigns: normalizeArray(payload.campaigns),
  email: Array.isArray(payload.email) ? payload.email[0] || {} : payload.email || {},
  alerts: normalizeArray(payload.alerts),
  sourceHealth: payload.sourceHealth || null,
  aiBrief: payload.aiBrief || null,
  automations: normalizeArray(payload.automations),
});

const emptyData = normalizeData();

const buildAssistantSnapshot = ({ stats, data, lastSync, integrations }) => ({
  lastSync: lastSync || "No sync yet",
  stats,
  sourceHealth: data.sourceHealth || {},
  integrations: integrations || {},
  alerts: summarizeList(
    data.alerts,
    (alert) => `${alert.type || "info"} from ${alert.source || "System"}: ${alert.message}`,
  ),
  reviews: summarizeList(
    data.reviews,
    (review) =>
      `${review.name}: ${review.reviewText || "No review text"}${
        review.aiDraftedResponse ? ` | AI reply: ${review.aiDraftedResponse}` : ""
      }`,
  ),
  campaigns: summarizeList(
    data.campaigns,
    (campaign) =>
      `${campaign.name || "Campaign"}: open ${campaign.openRate ?? "N/A"}, click ${
        campaign.clickRate ?? "N/A"
      }`,
  ),
  competitors: summarizeList(
    data.competitors,
    (competitor) =>
      `${competitor.name || competitor.competitor || "Competitor"}: ${
        competitor.notes || "No notes"
      }`,
  ),
  aiBrief: data.aiBrief || {},
  automations: summarizeList(
    data.automations,
    (automation) =>
      `${automation.name || "Automation"}: ${automation.status || "unknown"}${
        automation.lastRun ? ` | last run: ${automation.lastRun}` : ""
      }`,
  ),
});

const createLocalAssistantReply = ({ stats, data, lastSync }) => {
  const alerts = data.alerts.length
    ? data.alerts.slice(0, 2).map((alert) => alert.message).join(" ")
    : "No active alerts are showing.";
  const negativeReviews = data.reviews.filter((review) =>
    String(review.sentiment || review.rating || "").toLowerCase().includes("negative"),
  );
  const nextAction =
    data.aiBrief?.nextActions?.[0] ||
    (negativeReviews.length
      ? "Start with the reviews that need a public reply."
      : "Review the latest stats, then pick one growth or retention action to push today.");

  const automationSummary = data.automations.length
    ? data.automations
        .slice(0, 3)
        .map((a) => `${a.name || "Automation"}: ${a.status || "unknown"}`)
        .join(", ")
    : "No automations running.";

  return [
    `Last sync: ${lastSync || "No sync yet"}.`,
    `Revenue is ${stats.revenue}, leads are ${stats.leads}, conversion is ${stats.conversionRate}, and asset value is ${stats.assetValue}.`,
    alerts,
    `Automations: ${automationSummary}`,
    `Best next move: ${nextAction}`,
    "Add your OpenRouter key in Settings when you want me to answer follow-up questions with full AI reasoning.",
  ].join("\n\n");
};

const MetricCard = ({ icon: Icon, label, value }) => (
  <div style={{ ...cardStyle, padding: "0.9rem" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "0.75rem",
        marginBottom: "0.45rem",
      }}
    >
      <span style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>
        {label}
      </span>
      <Icon size={17} color={theme.colors.aquaBlue} />
    </div>
    <strong style={{ fontSize: "1.08rem" }}>{value}</strong>
  </div>
);

const InfoBlock = ({ label, value }) => (
  <div style={{ ...cardStyle, padding: "0.75rem" }}>
    <div style={{ ...brutalEyebrow, color: theme.colors.muted, fontSize: "0.62rem" }}>
      {label}
    </div>
    <div style={{ marginTop: "0.25rem", fontWeight: 800 }}>{value}</div>
  </div>
);

const EmptyState = ({ children }) => (
  <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.9rem" }}>
    {children}
  </p>
);

function CommandTab({ data, stats }) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={compactGrid}>
        <InfoBlock label="Top Asset" value={stats.topAsset} />
        <InfoBlock label="Community Growth" value={stats.communityGrowth} />
        <InfoBlock label="Email Growth" value={stats.emailGrowth} />
        <InfoBlock label="Churn Risk" value={stats.churnRisk} />
      </div>

      {data.alerts.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            System Alerts
          </h3>
          {data.alerts.map((alert, index) => (
            <div
              key={`${alert.source || "alert"}-${index}`}
              style={{
                ...cardStyle,
                padding: "0.75rem",
                display: "flex",
                gap: "0.6rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  ...brutalEyebrow,
                  color:
                    alert.type === "critical"
                      ? theme.colors.darkRed
                      : alert.type === "warning"
                        ? theme.colors.orange
                        : theme.colors.aquaBlue,
                  fontSize: "0.62rem",
                }}
              >
                {alert.type || "info"}
              </span>
              <span style={{ fontSize: "0.88rem" }}>
                <strong>{alert.source || "System"}:</strong> {alert.message}
              </span>
            </div>
          ))}
        </section>
      )}

      {data.sourceHealth && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Source Health
          </h3>
          <div style={compactGrid}>
            {Object.entries(data.sourceHealth).map(([key, status]) => (
              <InfoBlock key={key} label={key} value={status} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ReputationTab({ reviews }) {
  if (!reviews.length) {
    return <EmptyState>{dashboardConfig.reputationEmpty}</EmptyState>;
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {reviews.map((review, index) => (
        <article key={`${review.name}-${index}`} style={{ ...cardStyle, padding: "0.9rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "0.45rem",
            }}
          >
            <strong>{review.name}</strong>
            <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
              {review.date || ""}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: "0.9rem" }}>{review.reviewText}</p>
          {review.aiDraftedResponse && (
            <div
              style={{
                borderTop: brutalBorder,
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
              }}
            >
              <span style={{ ...brutalEyebrow, color: theme.colors.aquaBlue }}>
                {dashboardConfig.aiReplyLabel}
              </span>
              <p style={{ margin: "0.35rem 0 0", color: theme.colors.muted }}>
                {review.aiDraftedResponse}
              </p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function IntelTab({ data }) {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={compactGrid}>
        <InfoBlock label="Email Subscribers" value={data.email?.subscribers ?? "N/A"} />
        <InfoBlock label="Open Rate" value={data.email?.openRate ?? "N/A"} />
        <InfoBlock label="Click Rate" value={data.email?.clickRate ?? "N/A"} />
        <InfoBlock label="Revenue / Campaign" value={data.email?.revenuePerCampaign ?? "N/A"} />
      </div>

      {data.campaigns.length > 0 ? (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            Campaigns
          </h3>
          {data.campaigns.map((campaign, index) => (
            <div
              key={`${campaign.name}-${index}`}
              style={{
                ...cardStyle,
                padding: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <strong>{campaign.name}</strong>
              <span style={{ color: theme.colors.muted }}>
                Open: {campaign.openRate ?? "N/A"} | Click: {campaign.clickRate ?? "N/A"}
              </span>
            </div>
          ))}
        </section>
      ) : (
        <EmptyState>{dashboardConfig.intelEmpty}</EmptyState>
      )}

      {data.competitors.length > 0 && (
        <section style={{ display: "grid", gap: "0.5rem" }}>
          <h3 style={{ ...brutalHeading, margin: 0, fontSize: "0.95rem" }}>
            {dashboardConfig.marketIntelTitle}
          </h3>
          {data.competitors.map((competitor, index) => (
            <article
              key={`${competitor.name || competitor.competitor}-${index}`}
              style={{ ...cardStyle, padding: "0.75rem" }}
            >
              <strong>{competitor.name || competitor.competitor}</strong>
              {competitor.notes && (
                <p style={{ margin: "0.3rem 0 0", color: theme.colors.muted }}>
                  {competitor.notes}
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

function BrainTab({ aiBrief }) {
  if (!aiBrief) {
    return <EmptyState>No AI brief available. Click Sync Vault to generate one.</EmptyState>;
  }

  const sections = [
    ["What's Working", aiBrief.working, CONFIG.colors.success],
    ["What's Slipping", aiBrief.slipping, theme.colors.darkRed],
    ["Next Actions", aiBrief.nextActions, theme.colors.orange],
  ];

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {sections.map(([title, items, color]) =>
        items?.length ? (
          <section key={title} style={{ ...cardStyle, padding: "0.9rem" }}>
            <h3 style={{ ...brutalHeading, margin: "0 0 0.5rem", color, fontSize: "0.95rem" }}>
              {title}
            </h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
              {items.map((item, index) => (
                <li key={`${title}-${index}`} style={{ marginBottom: "0.35rem" }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}
    </div>
  );
}

function AutomationsTab({ automations }) {
  if (!automations.length) {
    return <EmptyState>{dashboardConfig.automationsEmpty || "No automations configured yet. Set up workflows in your backend to automate reviews, campaigns, and community tasks."}</EmptyState>;
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {automations.map((automation, index) => (
        <div
          key={`${automation.id || automation.name || index}`}
          style={{ ...cardStyle, padding: "0.9rem" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <strong>{automation.name || "Automation"}</strong>
            <span style={{ color: theme.colors.muted, fontSize: "0.78rem" }}>
              {automation.status || "unknown"}
            </span>
          </div>
          {automation.lastRun && (
            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: theme.colors.muted }}>
              Last run: {automation.lastRun}
            </p>
          )}
          {automation.details && (
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem" }}>{automation.details}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function DashboardAssistant({
  messages,
  input,
  isThinking,
  assistantError,
  onInputChange,
  onSubmit,
  onQuickPrompt,
  selectedModel,
  onModelChange,
}) {
  const quickPrompts = [
    "What needs my attention today?",
    "Summarize my automations.",
    "What is the next best move?",
  ];

  // Model selector options — grouped by cost tier.
  // The backend accepts any OmniRoute model ID (bm/*, auto/*, t3chat/*, etc.)
  // or a direct Gemini model. Defaults to "auto/best-chat" which lets OmniRoute
  // pick the best available model for the task.
  // NOTE: selectedModel state is now managed in the parent DashboardPage component
  // and passed down via props.
  const modelOptions = [
    // ── Free (via OmniRoute combos or Gemini direct) ──
    { group: "Free Models", value: "auto/best-chat", desc: "Best overall chat /free" },
    { group: "Free Models", value: "auto/best-fast", desc: "Fastest response /free" },
    { group: "Free Models", value: "auto/gemini", desc: "Best Gemini available /free" },
    { group: "Free Models", value: "auto/best-reasoning", desc: "Deep analysis /free" },
    { group: "Free Models", value: "auto/best-coding", desc: "Code & tech /free" },
    { group: "Free Models", value: "auto/best-vision", desc: "Image analysis /free" },
    { group: "Free Models", value: "auto/best-free", desc: "Guaranteed free tier /free" },
    { group: "Free Models", value: "static-best-free", desc: "Your combo (free models) /free" },
    { group: "Free Models", value: "free-stack", desc: "Your combo (free stack) /free" },
    { group: "Free Models", value: "gemini-3.5-flash-lite", desc: "Gemini direct (free tier) /free" },
    // ── Your Credits (Gemini $10 / Vertex $310) ──
    { group: "Your Credits", value: "gemini-2.5-pro", desc: "Gemini 2.5 Pro ($10 credit)" },
    { group: "Your Credits", value: "gemini-3.6-flash", desc: "Gemini 3.6 Flash (may be overloaded)" },
    // ── Premium (Bluesminds — may have usage limits) ──
    { group: "Premium (Bluesminds)", value: "bm/gpt-4o-mini", desc: "GPT-4o Mini" },
    { group: "Premium (Bluesminds)", value: "bm/gpt-4.1", desc: "GPT-4.1" },
    { group: "Premium (Bluesminds)", value: "bm/claude-sonnet-4-5", desc: "Claude Sonnet 4.5" },
    { group: "Premium (Bluesminds)", value: "bm/gemini-2.5-pro", desc: "Gemini 2.5 Pro (VIP)" },
    { group: "Premium (Bluesminds)", value: "bm/deepseek-chat", desc: "DeepSeek Chat" },
    { group: "Premium (Bluesminds)", value: "bm/qwen-turbo", desc: "Qwen Turbo" },
    { group: "Premium (Bluesminds)", value: "bm/kimi-k2", desc: "Kimi K2" },
  ];

  const groupedOptions = modelOptions.reduce((acc, opt) => {
    (acc[opt.group] ??= []).push(opt);
    return acc;
  }, {});

  const renderStructuredSections = (msg) => {
    if (!msg.structuredSections?.length) return null;
    return (
      <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.4rem" }}>
        {msg.structuredSections.map((section, si) => (
          <div
            key={si}
            style={{
              border: `1px solid ${theme.colors.accent}33`,
              borderRadius: 4,
              padding: "0.45rem 0.6rem",
              backgroundColor: "rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: theme.colors.muted,
                marginBottom: "0.3rem",
                letterSpacing: "0.05em",
              }}
            >
              {section.title}
            </div>
            <ul style={{ margin: 0, paddingLeft: "1rem", fontSize: "0.82rem", lineHeight: 1.5 }}>
              {section.items.map((item, ii) => (
                <li key={ii} style={{ marginBottom: "0.15rem" }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
        {msg.priorityFocus && (
          <div
            style={{
              marginTop: "0.4rem",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: theme.colors.accent,
            }}
          >
            ⚡ Priority: {msg.priorityFocus}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      style={{
        ...cardStyle,
        padding: "1rem",
        backgroundColor: theme.colors.panel,
        display: "grid",
        gap: "0.85rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <Bot size={19} color={theme.colors.aquaBlue} />
          <h2 style={{ ...brutalHeading, fontSize: "1rem", margin: 0 }}>
            Dashboard AI Assistant
          </h2>
        </div>
        <select
          value={selectedModel}
          onChange={(e) => {
            const v = e.target.value;
            if (onModelChange) onModelChange(v);
            localStorage.setItem("dd-assistant-model", v);
          }}
          style={{
            border: brutalBorder,
            backgroundColor: theme.colors.card,
            color: theme.colors.textPrimary,
            padding: "0.3rem 0.5rem",
            fontSize: "0.72rem",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: theme.fonts.body,
            borderRadius: 0,
          }}
        >
          {Object.entries(groupedOptions).map(([group, opts]) => (
            <optgroup key={group} label={group}>
              {opts.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.value}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div
        style={{
          border: brutalBorder,
          backgroundColor: theme.colors.card,
          minHeight: 180,
          maxHeight: 340,
          overflowY: "auto",
          padding: "0.75rem",
          display: "grid",
          gap: "0.65rem",
          alignContent: "start",
        }}
      >
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`${message.role}-${index}`}
              style={{
                justifySelf: isUser ? "end" : "start",
                maxWidth: "min(92%, 720px)",
                border: brutalBorder,
                backgroundColor: isUser ? theme.colors.aquaBlue : theme.colors.background,
                padding: "0.65rem 0.7rem",
                fontSize: "0.86rem",
                lineHeight: 1.45,
                whiteSpace: "pre-wrap",
              }}
            >
              {message.content}
              {!isUser && renderStructuredSections(message)}
              {!isUser && (message.provider || message.model) && (
                <div style={{ marginTop: "0.35rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {message.provider && (
                    <span style={{ fontSize: "0.65rem", color: theme.colors.muted, border: `1px solid ${theme.colors.muted}44`, borderRadius: 3, padding: "0.1rem 0.35rem" }}>
                      {message.provider}
                    </span>
                  )}
                  {message.model && (
                    <span style={{ fontSize: "0.65rem", color: theme.colors.muted, border: `1px solid ${theme.colors.muted}44`, borderRadius: 3, padding: "0.1rem 0.35rem" }}>
                      {message.model}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {isThinking && (
          <div
            style={{
              justifySelf: "start",
              border: brutalBorder,
              backgroundColor: theme.colors.background,
              padding: "0.65rem 0.7rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              fontSize: "0.86rem",
            }}
          >
            <Loader2 size={15} style={{ animation: "dd-spin 0.8s linear infinite" }} />
            Thinking through the dashboard...
          </div>
        )}
      </div>

      {assistantError && (
        <p style={{ margin: 0, color: theme.colors.darkRed, fontSize: "0.82rem" }}>
          {assistantError}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onQuickPrompt(prompt)}
            style={{
              border: brutalBorder,
              backgroundColor: theme.colors.card,
              color: theme.colors.textPrimary,
              padding: "0.42rem 0.55rem",
              fontSize: "0.75rem",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: theme.fonts.body,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <input
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Ask about stats, reviews, automations, or next actions..."
          style={{
            border: brutalBorder,
            flex: 1,
            minWidth: 0,
            padding: "0.65rem 0.7rem",
            backgroundColor: theme.colors.card,
            fontFamily: theme.fonts.body,
          }}
        />
        <button
          type="submit"
          disabled={isThinking || !input.trim()}
          aria-label="Send assistant message"
          style={{
            ...brutalButtonPrimary,
            width: 44,
            minWidth: 44,
            padding: 0,
            opacity: isThinking || !input.trim() ? 0.6 : 1,
          }}
        >
          <Send size={17} />
        </button>
      </form>
    </section>
  );
}

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastSync, setLastSync] = useState(
    localStorage.getItem("lastSync") || null,
  );
  const [syncError, setSyncError] = useState("");
  const [data, setData] = useState(emptyData);
  const [stats, setStats] = useState({
    revenue: "$0",
    leads: 0,
    conversionRate: "0%",
    assetValue: CONFIG.metrics.assetValue,
    topAsset: "N/A",
    communityGrowth: "0%",
    emailGrowth: "0%",
    churnRisk: "Low",
  });
  const [automations, setAutomations] = useState([]);
  const [integrations, setIntegrations] = useState({
    googleAnalytics: { connected: false, error: null },
    social: { connected: false, error: null },
    email: { connected: false, error: null },
    community: { connected: false, error: null },
    fetchedAt: null,
  });
  const [openRouterKey, setOpenRouterKey] = useState(
    localStorage.getItem("openRouterKey") || "",
  );
  const [notionData, setNotionData] = useState({
    ideas: [],
    content: [],
    automations: [],
    intakeAlerts: [],
    publishingQueue: [],
    approvals: [],
    buyerSignals: [],
    aiDrafts: [],
    ideasAlerts: [],
  });
  const [assistantMessages, setAssistantMessages] = useState([assistantWelcome]);
  const [assistantInput, setAssistantInput] = useState("");
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [assistantError, setAssistantError] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem("dd-assistant-model") || "auto/best-chat"
  );

  useEffect(() => {
    document.title = `${CONFIG.brand.fullName} Dashboard`;
  }, []);

  const tabs = useMemo(
    () => dashboardConfig.tabs.map((tab) => ({ ...tab, icon: tabIcons[tab.id] })),
    [],
  );

  const currentTabConfig = tabs.find((tab) => tab.id === activeTab);

  const syncEmpireData = async () => {
    if (isSyncing) {
      console.log("[Dashboard] Sync already in progress, skipping");
      return;
    }
    setIsSyncing(true);
    setSyncError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          ...API_HEADERS,
          "x-user-id": currentUser?.id || "anonymous",
        },
        body: JSON.stringify({
          action: "dashboard",
          userId: currentUser?.id,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.error || `${dashboardConfig.syncFailurePrefix} ${res.status}`,
        );
      }

      const payload = await res.json();
      const metrics = payload?.metrics || payload || {};

      // Accept both legacy flat payloads and the live backend contract which nests stats under metrics.
      const hasUsableData =
        payload?.status === "ok" ||
        metrics?.revenue != null ||
        metrics?.leads != null ||
        payload?.revenue != null ||
        payload?.leads != null;

      if (!hasUsableData) {
        throw new Error("Invalid dashboard data received");
      }

      const nextData = normalizeData(payload);

      setData(nextData);

      const automationsRes = await fetch(API_URL, {
        method: "POST",
        headers: {
          ...API_HEADERS,
          "x-user-id": currentUser?.id || "anonymous",
        },
        body: JSON.stringify({
          action: "automation.list",
          userId: currentUser?.id,
        }),
      });
      if (!automationsRes.ok) {
        setAutomations([]);
      } else {
        const automationsPayload = await automationsRes.json();
        setAutomations(automationsPayload.automations || []);
      }

      setStats({
        revenue: metrics.revenue || payload.revenue || "$0",
        leads: Number(metrics.leads ?? payload.leads ?? 0),
        conversionRate: metrics.conversionRate
          ? formatConversion(metrics.conversionRate)
          : payload.conversionRate
            ? formatConversion(payload.conversionRate)
            : "0%",
        assetValue: formatAssetValue(metrics.assetValue ?? payload.assetValue),
        topAsset: metrics.topAsset || payload.topAsset || "N/A",
        communityGrowth: metrics.communityGrowth || payload.communityGrowth || "0%",
        emailGrowth: metrics.emailGrowth || payload.emailGrowth || "0%",
        churnRisk: metrics.churnRisk || payload.churnRisk || "Low",
      });
      const syncTime = new Date().toLocaleString();
      localStorage.setItem("lastSync", syncTime);
      setLastSync(syncTime);
    } catch (err) {
      setSyncError(err.message || dashboardConfig.syncError);
    } finally {
      setIsSyncing(false);
    }
  };

  const syncIntegrations = async () => {
    const [ga, social, email, community] = await Promise.all([
      fetchGoogleAnalytics(),
      fetchSocialStats(),
      fetchEmailStats(),
      fetchCommunityStats(),
    ]);

    setIntegrations({
      googleAnalytics: ga,
      social,
      email,
      community,
      fetchedAt: new Date().toLocaleString(),
    });

    // Pull Notion data as part of the same sync cycle.
    let notion = {};
    try {
      notion = await fetchNotionData();
    } catch (err) {
      console.error('[Dashboard] fetchNotionData failed:', err && err.message ? err.message : err);
    }

    setNotionData(notion);
  };

  useEffect(() => {
    syncEmpireData()
      .then(() => {
        if (typeof syncIntegrations === 'function') {
          syncIntegrations().catch((err) => {
            console.error('[Dashboard] syncIntegrations failed:', err && err.message ? err.message : err);
          });
        }
      })
      .catch((err) => {
        console.error('[Dashboard] syncEmpireData failed:', err && err.message ? err.message : err);
      })
      .finally(() => setInitialLoad(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("openRouterKey", openRouterKey.trim());
    setShowSettings(false);
  };

  const sendAssistantMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || isAssistantThinking) return;

    const userMessage = { role: "user", content: trimmedMessage };
    const nextMessages = [...assistantMessages, userMessage];

    setAssistantMessages(nextMessages);
    setAssistantInput("");
    setAssistantError("");
    setIsAssistantThinking(true);

    try {
      // Build your dashboard snapshot (you already have this function)
      const snapshot = buildAssistantSnapshot({
        stats,
        data: { ...data, automations },
        lastSync,
        integrations,
      });

      const dashboardSystemPrompt = [
        "You are the DigitallyDefined Operations AI. You have access to the user's live dashboard data.",
        `Last sync: ${snapshot.lastSync}`,
        `Revenue: ${snapshot.stats?.revenue} | Leads: ${snapshot.stats?.leads} | Conversion: ${snapshot.stats?.conversionRate} | Asset Value: ${snapshot.stats?.assetValue}`,
        snapshot.alerts?.length
          ? `Active Alerts: ${snapshot.alerts.join(" | ")}`
          : "No active alerts.",
        snapshot.automations?.length
          ? `Automations: ${snapshot.automations.join(" | ")}`
          : "No automations running.",
        snapshot.aiBrief?.nextActions?.length
          ? `AI-Recommended Next Action: ${snapshot.aiBrief.nextActions[0]}`
          : "",
        "Be concise, specific, and actionable. Use the data above to ground your answers.",
      ].filter(Boolean).join("\n");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: API_HEADERS,
        body: JSON.stringify({
          action: "chat",
          message: trimmedMessage,
          conversation: nextMessages,
          systemPrompt: dashboardSystemPrompt,
          context: { snapshot },
          model: selectedModel,
        }),
      });

      const dataRes = await res.json();

      if (!res.ok) {
        const errorMsg = dataRes.error || dataRes.message || 'AI request failed';
        throw new Error(errorMsg);
      }

      const provider = dataRes.provider || null;
      const model = dataRes.model || null;
      const appliedEdit = dataRes.appliedEdit || null;
      const structuredData = dataRes.data || null;

      // Build a rich assistant message from structured data
      let replyContent = dataRes.reply || '';
      if (appliedEdit && appliedEdit.key) {
        replyContent = `✏️ Website change saved (${appliedEdit.label || appliedEdit.key}):\n"${appliedEdit.value}"\n\nIt will appear on the site after the next frontend deploy.`;
      }

      const assistantMessage = {
        role: "assistant",
        content: replyContent,
        provider,
        model,
        appliedEdit,
      };

      // If we got structured data, append it as a secondary section
      if (structuredData) {
        const sections = [];
        if (structuredData.opportunities?.length) {
          sections.push({
            title: "Opportunities",
            items: structuredData.opportunities,
          });
        }
        if (structuredData.riskFlags?.length) {
          sections.push({
            title: "Risk Flags",
            items: structuredData.riskFlags,
          });
        }
        if (structuredData.nextActions?.length) {
          sections.push({
            title: "Next Actions",
            items: structuredData.nextActions,
          });
        }
        if (sections.length) {
          assistantMessage.structuredSections = sections;
          assistantMessage.priorityFocus = structuredData.priorityFocus || null;
        }
      }

      setAssistantMessages((currentMessages) => [...currentMessages, assistantMessage]);

    } catch (error) {
      console.error("Dashboard agent error:", error);
      setAssistantError(error.message || "The AI agent encountered an error.");
      setAssistantMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: createLocalAssistantReply({ stats, data, lastSync }),
        },
      ]);
    }

    setIsAssistantThinking(false);
  };

  const handleAssistantSubmit = (event) => {
    event.preventDefault();
    sendAssistantMessage(assistantInput);
  };

  const renderTab = () => {
    if (activeTab === "reputation") return <ReputationTab reviews={data.reviews} />;
    if (activeTab === "intel") return <IntelTab data={data} />;
    if (activeTab === "growth") return <GrowthTab integrations={integrations} />;
    if (activeTab === "brain") return <BrainTab aiBrief={data.aiBrief} />;
    if (activeTab === "automations") return <AutomationsTab automations={data.automations} />;
    if (activeTab === "integrations") return <IntegrationsTab integrations={integrations} />;
    if (activeTab === "notion") return <NotionTab data={notionData} />;
    if (activeTab === "antigravity") return <AntigravityPage />;
    return <CommandTab data={data} stats={stats} />;
  };

  if (initialLoad) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: theme.colors.background,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.app,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Loader2 size={20} style={{ animation: "dd-spin 0.8s linear infinite" }} />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.textPrimary,
        fontFamily: theme.fonts.app,
      }}
    >
      <style>{`
        @keyframes dd-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          .dd-dashboard-shell {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <header
        style={{
          borderBottom: brutalBorder,
          padding: "1rem 1.5rem",
          backgroundColor: theme.colors.panel,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <Logo as="div" />
          <p style={{ margin: 0, fontSize: "0.82rem", color: theme.colors.muted }}>
            {CONFIG.brand.tagline}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={syncIntegrations}
            disabled={isSyncing}
            style={{
              ...brutalButtonPrimary,
              padding: "0.55rem 0.8rem",
              backgroundColor: theme.colors.aquaBlue,
              opacity: isSyncing ? 0.72 : 1,
            }}
          >
            <Plug size={16} />
            <span>Sync Integrations</span>
          </button>
          <button
            onClick={syncEmpireData}
            disabled={isSyncing}
            style={{
              ...brutalButtonPrimary,
              padding: "0.55rem 0.8rem",
              opacity: isSyncing ? 0.72 : 1,
            }}
          >
            <RefreshCw
              size={16}
              style={{
                transform: isSyncing ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            />
            {isSyncing ? dashboardConfig.syncingLabel : dashboardLabels.syncButton}
          </button>

          <button
            onClick={() => setShowSettings(true)}
            style={{
              ...brutalButtonPrimary,
              backgroundColor: theme.colors.card,
              padding: "0.55rem 0.8rem",
            }}
          >
            <Settings size={16} />
            <span>{dashboardLabels.settings}</span>
          </button>
        </div>
      </header>

      <main
        className="dd-dashboard-shell"
        style={{
          padding: "clamp(1rem, 4vw, 1.5rem)",
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "1rem",
        }}
      >
        <aside
          style={{
            ...cardStyle,
            padding: "1rem",
            display: "grid",
            gap: "1rem",
            height: "fit-content",
            backgroundColor: theme.colors.panel,
          }}
        >
          <h2 style={{ ...brutalHeading, fontSize: "0.95rem", margin: 0 }}>
            {dashboardLabels.navigation}
          </h2>

          <nav style={{ display: "grid", gap: "0.45rem" }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    border: brutalBorder,
                    backgroundColor: isActive ? theme.colors.orange : theme.colors.background,
                    color: theme.colors.textPrimary,
                    padding: "0.7rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    fontFamily: theme.fonts.body,
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <Icon size={16} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            style={{
              borderTop: brutalBorder,
              paddingTop: "0.8rem",
              color: syncError ? theme.colors.darkRed : theme.colors.muted,
              fontSize: "0.78rem",
            }}
          >
            {syncError ||
              (lastSync
                ? `${dashboardConfig.lastSyncPrefix} ${lastSync}`
                : dashboardLabels.noSync)}
          </div>
        </aside>

        <section style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <div
            style={{
              ...cardStyle,
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.75rem",
              backgroundColor: theme.colors.panel,
            }}
          >
            <MetricCard icon={DollarSign} label={dashboardLabels.metrics.revenue} value={stats.revenue} />
            <MetricCard icon={Users} label={dashboardLabels.metrics.leads} value={stats.leads} />
            <MetricCard icon={TrendingUp} label={dashboardLabels.metrics.conversion} value={stats.conversionRate} />
            <MetricCard icon={FolderHeart} label={dashboardLabels.metrics.assetValue} value={stats.assetValue} />
          </div>

          <div style={{ ...cardStyle, padding: "1rem", minHeight: 220 }}>
            <h1 style={{ ...brutalHeading, margin: "0 0 0.5rem", fontSize: "1.3rem" }}>
              {currentTabConfig?.label}
            </h1>
            {renderTab()}
          </div>

          <DashboardAssistant
            messages={assistantMessages}
            input={assistantInput}
            isThinking={isAssistantThinking}
            assistantError={assistantError}
            onInputChange={setAssistantInput}
            onSubmit={handleAssistantSubmit}
            onQuickPrompt={sendAssistantMessage}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </section>
      </main>

      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17,17,17,0.35)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 40,
            padding: "1rem",
          }}
        >
          <div
            style={{
              ...cardStyle,
              padding: "1rem",
              width: "min(420px, 100%)",
              backgroundColor: theme.colors.background,
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowSettings(false)}
              aria-label="Close settings"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                border: brutalBorder,
                background: theme.colors.card,
                cursor: "pointer",
                width: 32,
                height: 32,
                display: "grid",
                placeItems: "center",
              }}
            >
              <X size={16} />
            </button>

            <h2 style={{ ...brutalHeading, fontSize: "1rem", margin: "0 2.2rem 0.5rem 0" }}>
              {dashboardConfig.settingsTitle}
            </h2>

            <p style={{ fontSize: "0.85rem", margin: "0 0 0.85rem", color: theme.colors.muted }}>
              {dashboardConfig.settingsDescription}
            </p>

            <label style={{ display: "grid", gap: "0.35rem", fontSize: "0.85rem" }}>
              <span>{dashboardConfig.openRouterLabel}</span>
              <input
                type="password"
                value={openRouterKey}
                onChange={(event) => setOpenRouterKey(event.target.value)}
                placeholder={dashboardConfig.openRouterPlaceholder}
                style={{
                  border: brutalBorder,
                  padding: "0.6rem 0.7rem",
                  backgroundColor: theme.colors.card,
                  fontFamily: theme.fonts.body,
                }}
              />
            </label>

            <button
              onClick={handleSaveSettings}
              style={{
                ...brutalButtonPrimary,
                width: "100%",
                marginTop: "0.9rem",
                padding: "0.65rem 0.75rem",
              }}
            >
              {dashboardLabels.saveSettings}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
