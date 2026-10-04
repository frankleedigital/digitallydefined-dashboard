import { useState } from "react";
import { getSupabaseEdgeUrl, getSupabaseEdgeHeaders, describeNetworkFailure } from "../lib/supabase-edge";
import { renderBusinessPartnerReply, formatAppliedEdit } from "../lib/businessPartnerReply";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  async function sendMessage() {
    if (!input.trim() || error === "sending") return;
    setError("sending");

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      // Route chat through the Hermes business-partner endpoint so the dashboard
      // talks to HermesOS directly instead of a bare model call.
      const API_URL = `${getSupabaseEdgeUrl()}/business-partner`;
      let res;
      try {
        res = await fetch(API_URL, {
          method: "POST",
          headers: getSupabaseEdgeHeaders(),
          body: JSON.stringify({
            message: input.trim(),
            action: "business.partner",
          }),
        });
      } catch (err) {
        // Distinguish a dead/unreachable backend from a real API error, so the
        // user sees the cause instead of a bare "Failed to fetch".
        throw describeNetworkFailure(API_URL, err);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      const editSummary = formatAppliedEdit(data?.appliedEdit);
      const content =
        renderBusinessPartnerReply(data) ||
        "No response received.";

      const botMessage = {
        role: "assistant",
        content: editSummary ? `${editSummary}\n\n${content}` : content,
        provider: data?.provider || "Hermes",
        model: data?.model || null,
        businessInsights: data?.businessInsights || null,
        appliedEdit: data?.appliedEdit || null,
      };

      setMessages((prev) => [...prev, botMessage]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while contacting the agent.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error contacting the AI agent." },
      ]);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="dd-chat-toggle"
        aria-label="Open chat"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      {open && (
        <div className="dd-chat-window">
          <div className="dd-chat-header">DigitallyDefined AI</div>

          <div className="dd-chat-body">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`dd-chat-message dd-chat-message--${m.role}`}
              >
                <div className="dd-chat-bubble">
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          <div className="dd-chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              className="dd-chat-input"
            />
            <button
              onClick={sendMessage}
              className="dd-button dd-button--primary"
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
