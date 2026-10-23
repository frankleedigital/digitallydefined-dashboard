import React, { useState } from "react";

const MODES = ["New Idea", "Existing Product", "Existing Asset", "Portfolio Audit"];

export default function IntakeWizard() {
  const [mode, setMode] = useState(MODES[0]);
  const [form, setForm] = useState({ name: "", audience: "", problem: "", transformation: "", monetization: "", sourceMaterialsReady: false, needsResearch: false });
  const [submitted, setSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const submit = async () => {
    const res = await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "intake.submit", payload: { ...form, mode } }) });
    const data = await res.json();
    setAnalysis(data.analysis || null);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
        <h2>Submitted</h2>
        <p>Antigravity is analyzing your intake. Strategic recommendations will appear here.</p>
        {analysis && <pre style={{ background: "#f5f5f5", padding: "1rem" }}>{JSON.stringify(analysis, null, 2)}</pre>}
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>Ideas & Intake</h1>
      <p>You provide the facts. Antigravity analyzes the opportunity.</p>
      <p>Only complete the fields you already know. Antigravity will generate strategic recommendations and scoring.</p>

      <div style={{ margin: "1.5rem 0" }}>
        <strong>What are you adding today?</strong>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
          {MODES.map((m) => (
            <label key={m} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} /> {m}
            </label>
          ))}
        </div>
      </div>

      <h2>✍️ Information You Provide</h2>
      <label>Name<br /><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ width: "100%" }} /></label><br /><br />
      <label>Audience<br /><input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} style={{ width: "100%" }} /></label><br /><br />
      <label>Problem Solved<br /><textarea value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} style={{ width: "100%" }} /></label><br /><br />
      <label>Transformation<br /><textarea value={form.transformation} onChange={(e) => setForm({ ...form, transformation: e.target.value })} style={{ width: "100%" }} /></label><br /><br />
      <label>Monetization Type<br /><input value={form.monetization} onChange={(e) => setForm({ ...form, monetization: e.target.value })} style={{ width: "100%" }} /></label><br /><br />
      <label><input type="checkbox" checked={form.sourceMaterialsReady} onChange={(e) => setForm({ ...form, sourceMaterialsReady: e.target.checked })} /> Source Materials Ready</label><br />
      <label><input type="checkbox" checked={form.needsResearch} onChange={(e) => setForm({ ...form, needsResearch: e.target.checked })} /> Needs Research</label><br /><br />

      <h2>🤖 Antigravity Analysis</h2>
      <p>You are not expected to complete the analysis. Antigravity will evaluate Portfolio Role, Opportunity, Demand, Monetization Potential, and Next Actions after submission.</p>

      <button onClick={submit} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#F18B25", border: "1px solid #1F2937", fontWeight: 800, textTransform: "uppercase" }}>Submit Intake</button>
    </div>
  );
}
