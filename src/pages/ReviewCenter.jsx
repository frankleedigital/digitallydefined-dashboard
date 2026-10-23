import React, { useState } from "react";

export default function ReviewCenter() {
  const [status, setStatus] = useState("pending");
  return (
    <div style={{ padding: "2rem", maxWidth: 900, margin: "0 auto" }}>
      <h1>Asset Review Center</h1>
      <div style={{ border: "1px solid #1F2937", padding: "1rem", marginBottom: "1rem", background: "#FFFCF9" }}>
        <strong>Activation Status:</strong> {status}
      </div>
      <h2>Analysis</h2>
      <p>Portfolio Role, Revenue Opportunity, Launch/Growth recommendations, Repurposing.</p>
      <h2>Marketing Package</h2>
      <p>Elevator pitch, description, benefits, FAQ, positioning, CTA.</p>
      <h2>Content Package (future)</h2>
      <p>Social posts, captions, threads.</p>
      <h2>Email Package (future)</h2>
      <p>Welcome, launch, reminder, last-chance emails.</p>
      <h2>Newsletter Package (future)</h2>
      <p>Newsletter drafts and subject lines.</p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => setStatus("approved")}>Approve</button>
        <button onClick={() => setStatus("regenerate")}>Regenerate</button>
        <button onClick={() => setStatus("archived")}>Archive</button>
      </div>
    </div>
  );
}
