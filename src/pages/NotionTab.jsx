import React from "react";
import { AlertTriangle, ExternalLink, TrendingUp, Clock, DollarSign, Star, FileText, LayoutTemplate } from "lucide-react";
import { brutalBorder, brutalEyebrow, brutalHeading, theme } from "../theme";
import { mapNotionPageToView } from "../lib/notionArchitect";

const cardStyle = {
  border: brutalBorder,
  backgroundColor: theme.colors.card,
  padding: "1rem",
};

export default function NotionTab({ data }) {
  const raw = data?.rawNotion || data || {};
  const {
    ideas = [],
    content = [],
    automations = [],
    intakeAlerts = [],
    publishingQueue = [],
    approvals = [],
    buyerSignals = [],
    aiDrafts = [],
    // New architect-synced DBs (Phase 5)
    assets = [],
    money = [],
    monthly = [],
    reputation = [],
    templates = [],
  } = raw;

  const hasAnyData =
    ideas.length > 0 || content.length > 0 || automations.length > 0 ||
    publishingQueue.length > 0 || approvals.length > 0 || buyerSignals.length > 0 || aiDrafts.length > 0 ||
    assets.length > 0 || money.length > 0 || monthly.length > 0 || reputation.length > 0 || templates.length > 0;

  if (!hasAnyData) {
    return (
      <div style={{ ...cardStyle, display: "grid", gap: "0.5rem" }}>
        <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.9rem" }}>
          No Notion data synced yet.
        </p>
        <p style={{ margin: 0, color: theme.colors.muted, fontSize: "0.82rem" }}>
          Connect your Notion API key and database IDs, then hit{" "}
          <span style={{ color: theme.colors.accent, fontWeight: 700 }}>Sync Vault</span>{" "}
          on the dashboard to pull ideas, content, approvals, buyer signals, AI drafts,
          assets, money snapshots, monthly reviews, reputation signals, and templates into view.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      {intakeAlerts.length > 0 && (
        <section>
          <SectionTitle>INTAKE ALERTS ({intakeAlerts.length})</SectionTitle>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {intakeAlerts.map((alert, i) => (
              <div
                key={i}
                style={{
                  ...cardStyle,
                  borderLeft: `3px solid ${theme.colors.warning}`,
                  display: "grid",
                  gap: "0.2rem",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  <AlertTriangle size={14} style={{ marginRight: "0.4rem", color: theme.colors.warning, verticalAlign: "middle" }} />
                  {alert}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {ideas.length > 0 && (
        <section>
          <SectionTitle>IDEAS & INTAKE ({ideas.length})</SectionTitle>
          <GridList items={ideas.map((item) => mapNotionPageToView("ideas", item))} />
        </section>
      )}

      {content.length > 0 && (
        <section>
          <SectionTitle>CONTENT PIPELINE ({content.length})</SectionTitle>
          <GridList items={content.map((item) => mapNotionPageToView("content", item))} />
        </section>
      )}

      {templates.length > 0 && (
        <section>
          <SectionTitle>TEMPLATES LIBRARY ({templates.length})</SectionTitle>
          <GridList items={templates.map((item) => mapNotionPageToView("templates", item))} />
        </section>
      )}

      {assets.length > 0 && (
        <section>
          <SectionTitle>DIGITAL ASSETS ({assets.length})</SectionTitle>
          <GridList items={assets.map((item) => mapNotionPageToView("assets", item))} />
        </section>
      )}

      {money.length > 0 && (
        <section>
          <SectionTitle>MONEY SNAPSHOTS ({money.length})</SectionTitle>
          <GridList items={money.map((item) => mapNotionPageToView("money", item))} />
        </section>
      )}

      {monthly.length > 0 && (
        <section>
          <SectionTitle>MONTHLY REVIEWS ({monthly.length})</SectionTitle>
          <GridList items={monthly.map((item) => mapNotionPageToView("monthly", item))} />
        </section>
      )}

      {reputation.length > 0 && (
        <section>
          <SectionTitle>REPUTATION SIGNALS ({reputation.length})</SectionTitle>
          <GridList items={reputation.map((item) => mapNotionPageToView("reputation", item))} />
        </section>
      )}

      {automations.length > 0 && (
        <section>
          <SectionTitle>AUTOMATION LOG ({automations.length})</SectionTitle>
          <AutomationList items={automations.map((item) => mapNotionPageToView("automations", item))} />
        </section>
      )}

      {publishingQueue.length > 0 && (
        <section>
          <SectionTitle>PUBLISHING QUEUE ({publishingQueue.length})</SectionTitle>
          <GridList items={publishingQueue.map((item) => mapNotionPageToView("content", item))} />
        </section>
      )}

      {approvals.length > 0 && (
        <section>
          <SectionTitle>CONTENT APPROVALS ({approvals.length})</SectionTitle>
          <GridList items={approvals.map((item) => mapNotionPageToView("content", item))} />
        </section>
      )}

      {buyerSignals.length > 0 && (
        <section>
          <SectionTitle>BUYER SIGNALS ({buyerSignals.length})</SectionTitle>
          <GridList items={buyerSignals.map((item) => mapNotionPageToView("reputation", item))} />
        </section>
      )}

      {aiDrafts.length > 0 && (
        <section>
          <SectionTitle>AI CONTENT DRAFTS ({aiDrafts.length})</SectionTitle>
          <GridList items={aiDrafts.map((item) => mapNotionPageToView("content", item))} />
        </section>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        ...brutalHeading,
        fontSize: "1.1rem",
        margin: "0 0 0.75rem",
        paddingBottom: "0.5rem",
        borderBottom: brutalBorder,
      }}
    >
      {children}
    </h2>
  );
}

function GridList({ items }) {
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {items.slice(0, 20).map((item, i) => (
        <div key={i} style={{ ...cardStyle, display: "grid", gap: "0.3rem" }}>
          <ItemHeader title={item.name || "Untitled"} status={item.status || item.stage || "New"} />
          <Row label="Source" value={item.source || ""} />
          {item.category && <Row label="Category" value={item.category} />}
          {item.priority != null && <Row label="Priority" value={String(item.priority)} />}
          {item.type && <Row label="Type" value={item.type} />}
          {item.niche && <Row label="Niche" value={item.niche} />}
          {item.customerEmail && <Row label="Customer" value={item.customerEmail} />}
          {item.productSlug && <Row label="Product" value={item.productSlug} />}
          {item.url && <OpenNotionLink url={item.url} />}
          {item.created && <Row label="Created" value={item.created} />}
          {item.updated && <Row label="Updated" value={item.updated} />}
        </div>
      ))}
    </div>
  );
}

function ItemHeader({ title, status }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
      <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{title}</span>
      <span style={{ ...brutalEyebrow, fontSize: "0.62rem" }}>{status}</span>
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return <span style={{ fontSize: "0.82rem", color: theme.colors.muted }}>{label}: {value}</span>;
}

function OpenNotionLink({ url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{
        marginTop: "0.3rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        fontWeight: 700,
        fontSize: "0.82rem",
        color: theme.colors.accent,
        textDecoration: "none",
      }}
    >
      Open in Notion <ExternalLink size={12} />
    </a>
  );
}

function AutomationList({ items }) {
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {items.slice(0, 20).map((item, i) => (
        <div key={i} style={{ ...cardStyle, display: "grid", gap: "0.3rem" }}>
          <ItemHeader title={item.name || item.Action || "Untitled"} status={item.status || "unknown"} />
          <Row label="Source" value={item.source || "manual"} />
          {item.description && <Row label="What" value={item.description} />}
          {item.lastRun && <Row label="Last run" value={new Date(item.lastRun).toLocaleString() || item.lastRun} />}
          {item.pageId && <OpenNotionLink url={"https://notion.so/" + item.pageId.replace(/-/g, "")} />}
        </div>
      ))}
    </div>
  );
}

function ApprovalList({ items }) {
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {items.slice(0, 20).map((item, i) => (
        <div key={i} style={{ ...cardStyle, display: "grid", gap: "0.3rem" }}>
          <ItemHeader title={item.name || item.title || item.Name || "Untitled"} status={item.status || item.stage || "pending"} />
          {item.contentType && <Row label="Type" value={item.contentType} />}
          {item.requestedAt && <Row label="Requested" value={item.requestedAt} />}
          {item.notes && <Row label="Notes" value={item.notes} />}
          {item.url && <OpenNotionLink url={item.url} />}
        </div>
      ))}
    </div>
  );
}

function BuyerSignalList({ items }) {
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {items.slice(0, 20).map((item, i) => (
        <div key={i} style={{ ...cardStyle, display: "grid", gap: "0.3rem" }}>
          <ItemHeader title={item.title || "Signal"} status={item.source || "unknown"} />
          {item.product && <Row label="Product" value={item.product} />}
          {item.purchaseValue && <Row label="Value" value={item.purchaseValue} />}
          {item.customerEmail && <Row label="Customer" value={item.customerEmail} />}
          {item.quizResult && <Row label="Quiz" value={item.quizResult} />}
          {item.timestamp && <Row label="Time" value={new Date(item.timestamp).toLocaleString() || item.timestamp} />}
        </div>
      ))}
    </div>
  );
}

function AiDraftList({ items }) {
  return (
    <div style={{ display: "grid", gap: "0.5rem" }}>
      {items.slice(0, 20).map((item, i) => (
        <div key={i} style={{ ...cardStyle, display: "grid", gap: "0.3rem" }}>
          <ItemHeader title={item.title || "Draft"} status={item.status || "new"} />
          {item.prompt && <Row label="Prompt" value={item.prompt} />}
          {item.output && <Row label="Output" value={item.output} />}
          {item.agent && <Row label="Agent" value={item.agent} />}
          {item.model && <Row label="Model" value={item.model} />}
          {item.timestamp && <Row label="Time" value={new Date(item.timestamp).toLocaleString() || item.timestamp} />}
        </div>
      ))}
    </div>
  );
}