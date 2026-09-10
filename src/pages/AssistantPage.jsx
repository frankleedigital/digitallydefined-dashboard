import { useState, useEffect, useRef } from "react";
import { getAnalyticsBrief, formatBriefAsContext } from "../lib/analytics";
import { callSupabaseEdge } from "../lib/supabase-edge";

const PARTNER_SYSTEM_PROMPT = `You are Hermes, the AI Business Partner inside DigitallyDefined.
You help Francesca scale the business using the real website data provided below.

Core behavior:
- Give high-level, direct answers. No hype. No fluff. No overexplaining.
- Focus on what matters most for growth, conversion, and operating leverage.
- Call out strengths, weak points, and the next move.
- If the data does not support a claim, say it plainly and do not guess.
- Always propose one clear priority action.

How to respond:
- Keep replies short, sharp, and strategic.
- Start with the blunt assessment.
- Then list the 2 or 3 most important opportunities or problems.
- End with the single best next action.
- Read like a senior operator advising a founder, not a cheerleader.

OUTPUT FORMAT (strict):
- Plain text only.
- No markdown, no emojis, no decorative symbols, no code fences, no backticks.
- Use short paragraphs or simple bullets.
- Keep it concise: usually 5 to 8 lines is enough.
- Avoid generic coaching language and vague strategy phrases.`;

/**
 * Strip markdown and decorative/special characters so chat replies render as clean
 * structured plain text (belt-and-suspenders on top of the system-prompt instruction).
 */
const cleanPartnerReply = (raw) => {
  let text = String(raw || "");

  // Remove fenced code blocks then any remaining backticks.
  text = text.replace(/```[\s\S]*?```/g, (block) =>
    block.replace(/```/g, "").trim()
  );
  text = text.replace(/`([^`]*)`/g, "$1");

  // Remove heading hashes, blockquote chevrons, and horizontal-rule dashes/underscores.
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^>\s?/gm, "");
  text = text.replace(/^\s*([-*_])\s*\1\s*\1\s*$/gm, "");

  // Remove bold/italic/underline emphasis markers, keeping the inner text.
  // The inner classes exclude newlines so a stray `*`/`_`/`~` can never swallow
  // content across paragraph boundaries.
  text = text.replace(/\*\*([^*\r\n]+)\*\*/g, "$1");
  text = text.replace(/__([^_\r\n]+)__/g, "$1");
  text = text.replace(/\*([^*\r\n]+)\*/g, "$1");
  text = text.replace(/_([^_\r\n]+)_/g, "$1");
  text = text.replace(/~~([^~\r\n]+)~~/g, "$1");

  // Normalize bullet markers to a plain dash list; drop stray asterisks/tildes.
  text = text.replace(/^\s*[*+]\s+/gm, "- ");
  text = text.replace(/[~^]{1,}/g, "");

  // Drop any leftover orphan asterisks.
  text = text.replace(/\*/g, "");

  // Remove decorative symbols and emoji: dingbats & checkmarks, arrows, misc
  // symbols, the full emoji range, and dot/bullet glyphs — keep letters, numbers,
  // and safe punctuation so real page/product titles survive intact.
  text = text.replace(
    /[\u{1F000}-\u{1FAFF}\u{2190}-\u{21FF}\u{2600}-\u{27BF}\u{00B7}\u{2022}\u{2023}\u{2043}\u{25A0}-\u{25FF}\u{2B00}-\u{2BFF}]/gu,
    ""
  );

  // Collapse runs of blank lines.
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
};

export default function AssistantPage() {
  const [analyticsContext, setAnalyticsContext] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your DigitallyDefined AI Business Partner. I read your live website analytics. What should we move on next?" }
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [model, setModel] = useState(null);
  const messagesEndRef = useRef(null);

  // Load the live analytics snapshot so every reply is grounded in real data.
  useEffect(() => {
    let cancelled = false;
    getAnalyticsBrief(30)
      .then((brief) => {
        if (!cancelled) setAnalyticsContext(formatBriefAsContext(brief));
      })
      .catch(() => {
        if (!cancelled) setAnalyticsContext("Website analytics are currently unavailable.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatStructuredBusinessReply = (data) => {
    const summary = data?.summary ? String(data.summary).trim() : "";
    const opportunities = Array.isArray(data?.opportunities) ? data.opportunities : [];
    const riskFlags = Array.isArray(data?.riskFlags) ? data.riskFlags : [];
    const nextActions = Array.isArray(data?.nextActions) ? data.nextActions : [];
    const priorityFocus = data?.priorityFocus ? String(data.priorityFocus).trim() : "";

    const lines = [];
    if (summary) lines.push(summary);
    if (opportunities.length) {
      lines.push("");
      lines.push("Opportunities:");
      opportunities.forEach((item) => lines.push(`- ${String(item)}`));
    }
    if (riskFlags.length) {
      lines.push("");
      lines.push("Risk flags:");
      riskFlags.forEach((item) => lines.push(`- ${String(item)}`));
    }
    if (nextActions.length) {
      lines.push("");
      lines.push("Next actions:");
      nextActions.forEach((item) => lines.push(`- ${String(item)}`));
    }
    if (priorityFocus) {
      lines.push("");
      lines.push(`Priority focus: ${priorityFocus}`);
    }

    return cleanPartnerReply(lines.join("\n")) || "I’m here — but I didn’t get a response.";
  };

  const sendMessage = async () => {
    if (!input.trim() || error === "sending") return;

    setError("sending");
    setProvider(null);
    setModel(null);

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      // Routed through the Hermes edge function — AI provider keys stay server-side.
      const data = await callSupabaseEdge("chat", {
        message: userMessage.content,
        systemPrompt: `${PARTNER_SYSTEM_PROMPT}\n\n${analyticsContext}`,
        conversation: updatedMessages.slice(-10),
      });

      const structuredReply = data?.data ? formatStructuredBusinessReply(data.data) : null;
      const reply = cleanPartnerReply(data?.reply || structuredReply) || "I’m here — but I didn’t get a response.";
      const usedProvider = data?.provider || "Hermes";
      const usedModel = data?.model || null;

      const assistantMessage = {
        role: "assistant",
        content: reply,
        provider: usedProvider,
        model: usedModel,
        appliedEdit: data?.appliedEdit || null,
      };

      // Surface the applied website edit above the normal reply.
      if (data?.appliedEdit?.key) {
        assistantMessage.content =
          `✏️ Website change saved (${data.appliedEdit.label || data.appliedEdit.key}):\n"${data.appliedEdit.value}"\n\nIt will appear on the site after the next frontend deploy.`;
      }

      setProvider(usedProvider);
      setModel(usedModel);
      setMessages((prev) => [...prev, assistantMessage]);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn’t reach Hermes just now." }
      ]);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="dd-page dd-page--assistant">
      <div className="dd-assistant-header">
        DIGITALLY<span className="dd-brand-defined">DEFINED</span> AI Assistant
      </div>

      <div className="dd-assistant-body">
        {messages.map((m, i) => (
          <div key={i} className={`dd-assistant-message dd-assistant-message--${m.role}`}>
            <div className={`dd-assistant-message-bubble dd-assistant-message-bubble--${m.role}`}>
              {m.content}
            </div>

            {i === messages.length - 1 && m.role === "assistant" && (m.provider || m.model) && (
              <div className="dd-assistant-meta">
                {m.provider && <span className="dd-assistant-chip">{m.provider}</span>}
                {m.model && <span className="dd-assistant-chip">{m.model}</span>}
              </div>
            )}
          </div>
        ))}

        {provider && model && (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip">provider: {provider}</span>
            <span className="dd-assistant-chip">model: {model}</span>
          </div>
        )}

        {error && error !== "sending" && (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip dd-assistant-chip--error">error: {error}</span>
          </div>
        )}

        {error === "sending" && (
          <div className="dd-assistant-meta">
            <span className="dd-assistant-chip">Thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="dd-assistant-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask anything…"
          className="dd-assistant-input"
        />
        <button onClick={sendMessage} className="dd-button dd-button--primary" type="button">
          Send
        </button>
      </div>
    </div>
  );
}
