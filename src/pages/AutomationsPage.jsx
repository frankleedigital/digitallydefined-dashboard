import React, { useState, useEffect } from "react";
import {
  Cpu,
  RefreshCw,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  brutalBorder,
  brutalEyebrow,
  brutalHeading,
  theme,
} from "../theme";
import { postAction as ddPost } from "../lib/api-client";

const cardStyle = {
  border: brutalBorder,
  backgroundColor: theme.colors.card,
  padding: "1rem",
};

const WORKER_INFO = [
  {
    id: "make-publisher",
    name: "Make.com Social Publisher",
    service: "Make.com Webhook",
    description: "Auto-publishes roadmap content to Meta, IG, Threads, and Pinterest.",
    schedule: "Daily 8:00 AM EST",
  },
  {
    id: "post-publisher",
    name: "Supabase Post Publisher",
    service: "Supabase Edge Function",
    description: "Queues and publishes content blocks to social channels.",
    schedule: "On-demand",
  },
  {
    id: "brevo-sync",
    name: "Brevo Email Sync",
    service: "Brevo API",
    description: "Syncs new quiz leads into Brevo email lists automatically.",
    schedule: "Real-time",
  },
  {
    id: "notion-architect",
    name: "Notion OS Architect",
    service: "Antigravity Edge Function",
    description: "Writes leads, metrics, and content blocks to 8 Notion databases.",
    schedule: "On-demand + Phase 21 Rollout",
  },
  {
    id: "analytics-loop",
    name: "Analytics & Optimization Loop",
    service: "Supabase Edge Function",
    description: "Pulls GA4 + Gumroad data, generates morning brief, triggers alerts.",
    schedule: "Daily 6:00 AM EST",
  },
];

export default function AutomationsPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [automationData, setAutomationData] = useState(null);
  const [workersData, setWorkersData] = useState(null);

  const fetchAutomationData = async () => {
    try {
      setRefreshing(true);
      const [autoRes, listRes] = await Promise.all([
        ddPost("automation.status", {}).catch(() => ({ success: false })),
        ddPost("automation.list", {}).catch(() => ({ success: false })),
      ]);
      if (autoRes && autoRes.success) setAutomationData(autoRes);
      if (listRes && listRes.success) setWorkersData(listRes);
    } catch (err) {
      console.warn("[AutomationsPage] Failed to load:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAutomationData(); }, []);

  const handleRefresh = () => fetchAutomationData();

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      {/* HEADER BAR */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          backgroundColor: "#111111",
          color: "#FFFFFF",
        }}
      >
        <div>
          <span style={{ ...brutalEyebrow, color: "#F18B25", fontSize: "0.68rem", letterSpacing: "0.15em" }}>
            Cloudflare Workers, Supabase Edge Functions & Background Jobs
          </span>
          <h2 style={{ ...brutalHeading, fontSize: "1.4rem", color: "#FFFFFF", margin: "0.25rem 0 0" }}>
            AUTOMATIONS & WORKERS CONTROL CENTER
          </h2>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            border: "2px solid #FFFFFF",
            backgroundColor: refreshing ? "#333333" : "#F18B25",
            color: "#111111",
            fontWeight: 900,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "0.65rem 1.1rem",
            cursor: refreshing ? "wait" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <RefreshCw size={14} className={refreshing ? "spin" : ""} />
          {refreshing ? "Refreshing…" : "Refresh Status"}
        </button>
      </div>

      {/* WORKERS STATUS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        {WORKER_INFO.map((worker) => {
          const isActive = automationData?.success && (
            automationData.activeWorkers?.includes(worker.id) ||
            automationData.activeJobs?.some?.((j) => j.id === worker.id)
          );
          const isRunning = isActive;

          return (
            <div
              key={worker.id}
              style={{ ...cardStyle, borderLeft: `5px solid ${isRunning ? "#16A34A" : "#8B1A0A"}` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.6rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Cpu size={18} color={isRunning ? "#16A34A" : "#8B1A0A"} />
                  <span style={{ fontSize: "0.85rem", fontWeight: 900, textTransform: "uppercase", color: "#111111" }}>
                    {worker.name}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.68rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color: isRunning ? "#16A34A" : "#8B1A0A",
                    border: "1px solid #111111",
                    padding: "2px 6px",
                    backgroundColor: isRunning ? "#F0FDF4" : "#FEF2F2",
                  }}
                >
                  {isRunning ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {isRunning ? "Active" : "Idle"}
                </div>
              </div>

              <div style={{ fontSize: "0.72rem", color: theme.colors.muted, marginBottom: "0.5rem", lineHeight: 1.4 }}>
                {worker.description}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid #111111",
                  paddingTop: "0.6rem",
                  marginTop: "0.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Clock size={13} color="#666666" />
                  <span style={{ fontSize: "0.72rem", color: "#666666", fontWeight: 700 }}>{worker.schedule}</span>
                </div>
                <div style={{ fontSize: "0.68rem", color: theme.colors.muted, fontWeight: 700, textTransform: "uppercase" }}>
                  {worker.service}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* LAUNCH WORKFLOW SECTION */}
      <div style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ ...brutalHeading, fontSize: "1.1rem", margin: 0 }}>LAUNCH WORKFLOW</h3>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: theme.colors.muted }}>
              Trigger any automation on demand without waiting for the scheduled run.
            </p>
          </div>
          <span style={{ ...brutalEyebrow, fontSize: "0.68rem", color: "#F18B25" }}>Manual Override</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {WORKER_INFO.map((worker) => (
            <button
              key={worker.id}
              type="button"
              onClick={() => {
                if (window.confirm(`Run "${worker.name}" now?`)) {
                  ddPost("automation.trigger", { id: worker.id }).catch((err) =>
                    console.error(`Trigger failed for ${worker.name}:`, err)
                  );
                }
              }}
              style={{
                border: brutalBorder,
                backgroundColor: "#FFFFFF",
                padding: "0.75rem 0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 800,
                fontSize: "0.78rem",
                textTransform: "uppercase",
                cursor: "pointer",
                color: "#111111",
              }}
            >
              <Zap size={14} color="#F18B25" />
              {worker.name}
            </button>
          ))}
        </div>
      </div>

      {/* RECENT JOB LOG */}
      {workersData?.success && Array.isArray(workersData.jobs) && workersData.jobs.length > 0 && (
        <div style={cardStyle}>
          <h3 style={{ ...brutalHeading, fontSize: "1.1rem", marginBottom: "0.85rem" }}>RECENT JOB LOG</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {workersData.jobs.slice(0, 5).map((job, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #111111",
                  padding: "0.6rem 0.85rem",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.8rem",
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: "#111111", textTransform: "uppercase" }}>
                    {job.name || job.id}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#666" }}>{job.description || "Background job"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.62rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      padding: "2px 6px",
                      backgroundColor: job.status === "success" ? "#F0FDF4" : "#FEF2F2",
                      color: job.status === "success" ? "#16A34A" : "#8B1A0A",
                      border: "1px solid #111111",
                    }}
                  >
                    {job.status || "unknown"}
                  </span>
                  {job.timestamp && (
                    <div style={{ fontSize: "0.65rem", color: "#888", marginTop: "2px" }}>
                      {new Date(job.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

