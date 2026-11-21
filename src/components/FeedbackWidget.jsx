import React, { useState } from "react";

export default function FeedbackWidget({ context }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const submit = async () => {
    await fetch("/api", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "feedback.submit", payload: { context, feedback: text } }) });
    setSent(true);
  };
  if (sent) return <p>Thanks for your feedback!</p>;
  return (
    <div style={{ marginTop: "1rem" }}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What would help you most right now?" style={{ width: "100%", minHeight: "80px" }} />
      <button onClick={submit} style={{ marginTop: "0.5rem" }}>Submit</button>
    </div>
  );
}
