// src/pages/KanbanTab.jsx
// Live Agent-Powered Kanban Board for DigitallyDefined OS Workflow

import React, { useState, useEffect } from "react";
import { Sparkles, Play, Plus, Trash2, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { brutalBorder, brutalEyebrow, theme } from "../theme";
import { postAction as ddPost } from "../lib/api-client";

const COLUMNS = [
  { id: "backlog", title: "01 • Backlog / Ideas" },
  { id: "in_progress", title: "02 • In Progress" },
  { id: "review", title: "03 • Review & Test" },
  { id: "done", title: "04 • Live & Verified" },
];

export default function KanbanTab() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [runningTaskId, setRunningTaskId] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Med", tag: "AI Agent", assigned_agent: "businessAgent" });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await ddPost("kanban.list", {});
      if (res && res.success && Array.isArray(res.tasks)) {
        setTasks(res.tasks);
      } else {
        // Fallback default tasks if table is not yet created
        setTasks([
          { id: "1", title: "Advanced Revenue Forecaster", description: "AI agent predicting monthly recurring revenue.", status: "backlog", priority: "Med", tag: "AI Agent", assigned_agent: "businessAgent" },
          { id: "2", title: "digitallydefined.store Refinement", description: "Cleaned up product catalog and added brand logo.", status: "in_progress", priority: "High", tag: "Storefront", assigned_agent: "brandSupervisor" },
          { id: "3", title: "Legacy OS Square Thumbnail", description: "Generated 800x800 flat soft brutalist PNG asset.", status: "review", priority: "Med", tag: "Gumroad", assigned_agent: "visualAsset" },
          { id: "4", title: "Dashboard & OS Command Center", description: "Live at dashboard.digitallydefined.agency with all 22 agents.", status: "done", priority: "High", tag: "Production", assigned_agent: "businessAgent" }
        ]);
      }
    } catch (err) {
      console.warn("[KanbanTab] fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const moveTask = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try {
      await ddPost("kanban.update", { id: taskId, status: newStatus });
    } catch (err) {
      console.warn("Failed to persist task status update", err);
    }
  };

  const runTaskAgent = async (task) => {
    setRunningTaskId(task.id);
    try {
      const agentName = task.assigned_agent || "businessAgent";
      const res = await ddPost("agents.run", {
        agent: agentName,
        params: {
          goal: task.title,
          brief: task.description,
          name: task.title,
        }
      });
      if (res?.success) {
        setExecutionResult({ task, result: res.data || res });
        // Automatically move to review or done upon success
        moveTask(task.id, "review");
      } else {
        alert(res?.error || "Agent execution failed");
      }
    } catch (err) {
      alert("Error running agent: " + err.message);
    } finally {
      setRunningTaskId(null);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const item = { id: String(Date.now()), ...newTask, status: "backlog" };
    setTasks(prev => [item, ...prev]);
    setShowNewModal(false);
    setNewTask({ title: "", description: "", priority: "Med", tag: "AI Agent", assigned_agent: "businessAgent" });
    try {
      await ddPost("kanban.create", item);
    } catch (err) {
      console.warn("Failed to persist task creation", err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Delete this workflow task?")) return;
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try {
      await ddPost("kanban.delete", { id: taskId });
    } catch (err) {
      console.warn("Failed to delete task", err);
    }
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* Top Bar */}
      <div style={{ border: brutalBorder, backgroundColor: theme.colors.card, padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <span style={{ ...brutalEyebrow, color: theme.colors.orange }}>DIGITALLYDEFINED OS</span>
          <h2 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.2rem", margin: "0.2rem 0 0 0" }}>
            Live Agent Workflow Kanban
          </h2>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={fetchTasks}
            style={{ border: brutalBorder, backgroundColor: "#fff", padding: "0.5rem 0.8rem", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
          >
            Refresh Board
          </button>
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            style={{ border: brutalBorder, backgroundColor: theme.colors.orange, color: "#111", padding: "0.5rem 1rem", fontWeight: 800, fontSize: "0.8rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
          >
            <Plus size={15} /> New Task
          </button>
        </div>
      </div>

      {/* Board Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", alignItems: "start" }}>
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          return (
            <div key={col.id} style={{ border: brutalBorder, backgroundColor: "#F4F1EA", padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #111", paddingBottom: "0.6rem" }}>
                <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.88rem", margin: 0, textTransform: "uppercase" }}>
                  {col.title}
                </h3>
                <span style={{ backgroundColor: "#111", color: "#fff", fontSize: "0.72rem", fontWeight: 800, padding: "0.1rem 0.4rem" }}>
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", minHeight: "220px" }}>
                {colTasks.map((task) => (
                  <div key={task.id} style={{ border: brutalBorder, backgroundColor: "#fff", padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.4rem", boxShadow: "2px 2px 0px #111" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", backgroundColor: theme.colors.aquaBlue, border: "1px solid #111", padding: "0.1rem 0.3rem" }}>
                        {task.tag || "AI Agent"}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        style={{ border: "none", background: "none", color: "#991b1b", cursor: "pointer", padding: 0 }}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h4 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "0.85rem", margin: "0.2rem 0" }}>
                      {task.title}
                    </h4>
                    <p style={{ fontSize: "0.78rem", color: "#4b5563", margin: 0, lineHeight: 1.4 }}>
                      {task.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.4rem", paddingTop: "0.4rem", borderTop: "1px solid #e5e7eb" }}>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: theme.colors.muted }}>
                        Agent: {task.assigned_agent || "businessAgent"}
                      </span>
                      <button
                        type="button"
                        disabled={runningTaskId === task.id}
                        onClick={() => runTaskAgent(task)}
                        style={{
                          border: brutalBorder,
                          backgroundColor: runningTaskId === task.id ? "#e5e7eb" : "#7c3aed",
                          color: "#fff",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          cursor: runningTaskId === task.id ? "wait" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                      >
                        <Play size={10} />
                        {runningTaskId === task.id ? "Running..." : "Run Agent"}
                      </button>
                    </div>

                    {/* Stage Move Dropdown */}
                    <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.3rem" }}>
                      {COLUMNS.filter(c => c.id !== task.status).map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => moveTask(task.id, c.id)}
                          style={{ fontSize: "0.6rem", padding: "0.1rem 0.3rem", border: "1px solid #111", background: "#f3f4f6", cursor: "pointer", fontWeight: 700 }}
                        >
                          → {c.title.split("•")[1]?.trim().split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Result Modal */}
      {executionResult && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ backgroundColor: "#FFFCF9", border: brutalBorder, maxWidth: "650px", width: "100%", maxHeight: "85vh", overflowY: "auto", padding: "1.5rem", display: "grid", gap: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111", paddingBottom: "0.5rem" }}>
              <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>
                Agent Execution Result: {executionResult.task.title}
              </h3>
              <button
                type="button"
                onClick={() => setExecutionResult(null)}
                style={{ border: brutalBorder, backgroundColor: "#C20F0A", color: "#fff", padding: "0.25rem 0.5rem", fontWeight: 800, cursor: "pointer" }}
              >
                CLOSE ✕
              </button>
            </div>
            <div style={{ backgroundColor: "#fff", border: brutalBorder, padding: "1rem", fontSize: "0.85rem", whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
              {JSON.stringify(executionResult.result, null, 2)}
            </div>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <form onSubmit={createTask} style={{ backgroundColor: "#FFFCF9", border: brutalBorder, maxWidth: "480px", width: "100%", padding: "1.5rem", display: "grid", gap: "1rem" }}>
            <h3 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>Create Workflow Task</h3>
            
            <div style={{ display: "grid", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 800 }}>Task Title</label>
              <input
                type="text"
                required
                value={newTask.title}
                onChange={e => setNewTask({...newTask, title: e.target.value})}
                placeholder="e.g. Optimize Gumroad Funnel"
                style={{ border: brutalBorder, padding: "0.5rem", fontSize: "0.85rem", backgroundColor: "#fff" }}
              />
            </div>

            <div style={{ display: "grid", gap: "0.3rem" }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 800 }}>Description / Brief</label>
              <textarea
                rows={3}
                value={newTask.description}
                onChange={e => setNewTask({...newTask, description: e.target.value})}
                placeholder="What should the AI agent accomplish?"
                style={{ border: brutalBorder, padding: "0.5rem", fontSize: "0.85rem", backgroundColor: "#fff" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "grid", gap: "0.3rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 800 }}>Tag / Category</label>
                <input
                  type="text"
                  value={newTask.tag}
                  onChange={e => setNewTask({...newTask, tag: e.target.value})}
                  style={{ border: brutalBorder, padding: "0.5rem", fontSize: "0.85rem", backgroundColor: "#fff" }}
                />
              </div>
              <div style={{ display: "grid", gap: "0.3rem" }}>
                <label style={{ fontSize: "0.78rem", fontWeight: 800 }}>Assigned Agent</label>
                <select
                  value={newTask.assigned_agent}
                  onChange={e => setNewTask({...newTask, assigned_agent: e.target.value})}
                  style={{ border: brutalBorder, padding: "0.5rem", fontSize: "0.85rem", backgroundColor: "#fff" }}
                >
                  <option value="businessAgent">Business Agent</option>
                  <option value="brandSupervisor">Brand Supervisor</option>
                  <option value="gumroadPublisher">Gumroad Publisher</option>
                  <option value="notionArchitect">Notion OS Architect</option>
                  <option value="visualAsset">Visual Asset Generator</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                style={{ border: brutalBorder, backgroundColor: "#fff", padding: "0.5rem 1rem", fontWeight: 700, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ border: brutalBorder, backgroundColor: theme.colors.orange, color: "#111", padding: "0.5rem 1rem", fontWeight: 800, cursor: "pointer" }}
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
