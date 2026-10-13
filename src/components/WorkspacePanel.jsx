import React, { useState, useEffect } from "react";
import {
  FolderOpen,
  FileText,
  Save,
  X,
  Loader2,
  Check,
  Trash2,
  Cloud,
} from "lucide-react";
import {
  brutalBorder,
  brutalButtonPrimary,
  brutalButtonSecondary,
  brutalCard,
  brutalHeading,
  theme,
} from "../theme";
import {
  listWorkspaceFiles,
  saveToWorkspace,
  deleteFromWorkspace,
} from "../lib/puterWorkspace";

export default function WorkspacePanel({ open, onClose }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null);
  const [saveStatus, setSaveStatus] = useState({});
  const [puterError, setPuterError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    setPuterError(null);
    try {
      const result = await listWorkspaceFiles();
      if (result.success && Array.isArray(result.data)) {
        setFiles(result.data.map((f) => ({ name: f.name, path: f.path || f.name, size: f.size })));
      } else {
        setFiles([]);
      }
    } catch (err) {
      setPuterError(err.message || "Puter.js not available");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) refresh();
  }, [open]);

  const handleSaveAiBrief = async () => {
    const raw = window.__dd_ai_brief_raw;
    if (!raw) { alert("No AI brief data available. Sync your Vault first."); return; }
    const filename = `ai-brief-${new Date().toISOString().slice(0, 10)}.json`;
    setSaving(filename);
    try {
      await saveToWorkspace(filename, JSON.stringify(raw, null, 2), "application/json");
      setSaveStatus((s) => ({ ...s, [filename]: "saved" }));
      await refresh();
    } catch (err) {
      setSaveStatus((s) => ({ ...s, [filename]: "error" }));
    } finally { setSaving(null); }
  };

  const handleSaveAssistantLog = async () => {
    const raw = window.__dd_assistant_log;
    if (!raw || !raw.length) { alert("No assistant messages to save. Chat with Hermes first."); return; }
    const filename = `assistant-log-${new Date().toISOString().slice(0, 10)}.json`;
    setSaving(filename);
    try {
      await saveToWorkspace(filename, JSON.stringify(raw, null, 2), "application/json");
      setSaveStatus((s) => ({ ...s, [filename]: "saved" }));
      await refresh();
    } catch (err) {
      setSaveStatus((s) => ({ ...s, [filename]: "error" }));
    } finally { setSaving(null); }
  };

  const handleDelete = async (file) => {
    try { await deleteFromWorkspace(file.name); await refresh(); }
    catch (err) { console.error("Delete failed:", err); }
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(17,17,17,0.25)", zIndex: 45 }} />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(440px, 92vw)", backgroundColor: theme.colors.background,
        borderLeft: brutalBorder, zIndex: 50,
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ borderBottom: brutalBorder, padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Cloud size={18} style={{ color: theme.colors.orange }} />
            <h2 style={{ ...brutalHeading, fontSize: "1rem", margin: 0 }}>CLOUD WORKSPACE</h2>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ border: brutalBorder, background: theme.colors.card, cursor: "pointer", width: 32, height: 32, display: "grid", placeItems: "center" }}>
            <X size={16} />
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ borderBottom: brutalBorder, padding: "0.75rem 1.25rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", flexShrink: 0, backgroundColor: theme.colors.panel }}>
          <button onClick={handleSaveAiBrief} disabled={saving !== null} style={{ ...brutalButtonPrimary, padding: "0.5rem 0.75rem", fontSize: "0.78rem", opacity: saving ? 0.6 : 1 }}>
            {saving === "ai-brief" ? <Loader2 size={14} style={{ animation: "dd-spin 0.8s linear infinite" }} /> : <Save size={14} />}
            <span>Save AI Brief</span>
          </button>
          <button onClick={handleSaveAssistantLog} disabled={saving !== null} style={{ ...brutalButtonSecondary, padding: "0.5rem 0.75rem", fontSize: "0.78rem", opacity: saving ? 0.6 : 1 }}>
            {saving === "assistant-log" ? <Loader2 size={14} style={{ animation: "dd-spin 0.8s linear infinite" }} /> : <FileText size={14} />}
            <span>Save Chat Log</span>
          </button>
          <button onClick={refresh} style={{ ...brutalButtonPrimary, padding: "0.5rem 0.75rem", fontSize: "0.78rem", marginLeft: "auto", backgroundColor: theme.colors.card }}>
            <FolderOpen size={14} /><span>Refresh</span>
          </button>
        </div>

        {puterError && (
          <div style={{ padding: "0.6rem 1.25rem", borderBottom: brutalBorder, fontSize: "0.82rem", color: theme.colors.darkRed, backgroundColor: theme.colors.dangerTint, flexShrink: 0 }}>
            Puter.js unavailable: {puterError}.
          </div>
        )}

        {/* File list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem 1.25rem" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: theme.colors.muted, fontSize: "0.85rem" }}>
              <Loader2 size={16} style={{ animation: "dd-spin 0.8s linear infinite" }} />Loading workspace…
            </div>
          ) : files.length === 0 ? (
            <div style={{ ...brutalCard, padding: "1.5rem", textAlign: "center", color: theme.colors.muted, fontSize: "0.85rem" }}>
              <FolderOpen size={24} style={{ margin: "0 auto 0.5rem", opacity: 0.4 }} />
              <p style={{ margin: 0, fontWeight: 700, fontFamily: theme.fonts.heading }}>WORKSPACE IS EMPTY</p>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem" }}>Save your AI Brief or Chat Log to start building your cloud folder.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {files.map((file, i) => (
                <div key={i} style={{ ...brutalCard, padding: "0.6rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <FileText size={16} style={{ color: theme.colors.muted, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, fontFamily: theme.fonts.body, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: theme.colors.muted }}>
                      {file.size ? (file.size / 1024).toFixed(0) + " KB" : "JSON"}
                    </div>
                  </div>
                  {saveStatus[file.name] === "saved" && <Check size={14} style={{ color: theme.colors.success, flexShrink: 0 }} />}
                  <button onClick={() => handleDelete(file)} title="Delete from cloud" style={{ border: brutalBorder, background: theme.colors.card, cursor: "pointer", padding: "0.3rem 0.45rem", display: "grid", placeItems: "center", opacity: 0.6 }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ borderTop: brutalBorder, padding: "0.6rem 1.25rem", fontSize: "0.72rem", color: theme.colors.muted, flexShrink: 0 }}>
          Files stored in your Puter cloud under digitallydefined-dashboard/. No server storage needed.
        </div>
      </div>
    </>
  );
}
