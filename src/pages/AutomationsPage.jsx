import { useEffect, useState } from "react";
import { getSupabaseEdgeUrl, getSupabaseEdgeHeaders } from "../lib/supabase-edge";

export default function AutomationsPage() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = getSupabaseEdgeUrl();

    fetch(API_URL, {
      method: "POST",
      headers: getSupabaseEdgeHeaders(),
      body: JSON.stringify({
        action: "automation.list",
        userId: "anonymous",
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data?.automations) {
          setAutomations(data.automations);
        }
      })
      .catch(err => console.error("Automation fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading automations...</div>;
  }

  if (automations.length === 0) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>No automations configured yet. Set up workflows in your backend to automate reviews, campaigns, and community tasks.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Automations</h1>
      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {automations.map((automation, index) => (
          <div key={index} style={{ padding: "1rem", border: "1px solid #ccc" }}>
            <strong>{automation.name || "Automation"}</strong>
            <span style={{ marginLeft: "1rem", color: "#666" }}>
              {automation.status || "unknown"}
            </span>
            {automation.lastRun && (
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
                Last run: {automation.lastRun}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

