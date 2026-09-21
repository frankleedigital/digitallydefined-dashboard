import { useState, useEffect, useRef } from "react";
import { getAnalyticsBrief, formatBriefAsContext } from "../lib/analytics";
import { callSupabaseEdge } from "../lib/supabase-edge";

const PARTNER_SYSTEM_PROMPT = `You are Hermes — Francesca's AI business partner at DigitallyDefined. You've known her for months. You know her business inside out.

Who you are:
- A sharp, warm, no-BS business partner who happens to live in her dashboard.
- You call her Francesca. You talk like someone who has sat across from her many times.
- You have opinions. You're not neutral. You pick sides when the data supports it.

What you know:
- She runs DigitallyDefined: faceless digital real estate for Gen X women.
- Core product: the Digital Superpower Quiz → personalized roadmap → email capture.
- Traffic comes from Facebook groups, SEO, and her community.
- Revenue is from quiz conversions and digital product sales.
- Her stack: React website (Vite + Tailwind), Supabase, Notion, Brevo email, OmniRoute AI.
- The website code lives at digitallydefined-website-clean/src/ on this machine.

How you talk:
- Conversational, like you're in the same room. "Francesca, here's what I'm seeing…"
- Lead with the answer, then explain. Never bury the lead.
- Use "I think", "Here's my read", "Let me be straight with you" — natural phrases.
- When you're wrong, admit it. When you're unsure, say so.
- 3 to 8 sentences per response. If she wants more, she'll ask.
- NO markdown. NO code fences. NO emojis. Just plain text, like a Slack message from a smart friend.
- If the analytics context is empty or unhelpful, say so and pivot to what you CAN help with.

What you do:
- Read her live analytics and give grounded advice.
- When she asks to change the website, you ACTUALLY change it — don't just describe the change.
- When she asks to change the website:
  1. First read the relevant file(s) using the file path from the available files list.
  2. Show her what you found in plain language (one sentence).
  3. Then emit an edit block in this EXACT format — no extra text around it:
     [EDIT FILE: pages/Home.jsx]
     <the complete new file content here, exactly as it should appear>
     [/EDIT]
  4. After the edit block, tell her one sentence about what changed and why.
- NEVER skip the edit block. If she asks you to change code, produce the edit block.
- The backend will detect the edit block, write the file, commit it, and push it.
- Always read the file first before editing so you understand the current structure.

Rules:
- Never say "as an AI" or "I'm an AI assistant." You're her partner.
- Never hallucinate data. If you don't know, say "I don't have that info right now."
- Always end with a next step unless she's just checking in.
- When making edits, preserve existing imports, exports, and component structure.
- Never rewrite an entire file unless explicitly asked. Make surgical changes.
`;

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
      // Use the new business-partner endpoint for structured JSON intelligence
      const data = await callSupabaseEdge("business.partner", {
        message: userMessage.content,
        history: updatedMessages.slice(-10),
        includeWebsiteContext: true,
      });

      const structuredReply = data?.data ? formatStructuredBusinessReply(data.data) : null;
      const reply = cleanPartnerReply(data?.reply || structuredReply) || "I’m here — but I didn’t get a response.";
      const usedProvider = data?.provider || "Gemini";
      const usedModel = data?.model || null;

      const assistantMessage = {
        role: "assistant",
        content: reply,
        provider: usedProvider,
        model: usedModel,
        businessInsights: data?.businessInsights || null,
        appliedEdit: data?.appliedEdit || null,
      };

      // Surface the applied website edit above the normal reply.
      if (data?.appliedEdit) {
        const edits = Array.isArray(data.appliedEdit) ? data.appliedEdit : [data.appliedEdit];
        const okEdits = edits.filter((e) => e.ok);
        const failedEdits = edits.filter((e) => !e.ok);
        const editLines = okEdits.map(
          (e) => `Edited ${e.file}${e.committed ? ' — committed' : ' — saved locally'}${e.pushed ? ' → pushed to origin' : ''}`
        );
        const failLines = failedEdits.map((e) => `Failed to edit ${e.file}: ${e.error}`);
        assistantMessage.content =
          editLines.join('\n') + (failLines.length ? '\n\n' + failLines.join('\n') : '') + '\n\n' + reply;
      }

      setProvider(usedProvider);
      setModel(usedModel);
      setMessages((prev) => [...prev, assistantMessage]);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I couldn’t reach the AI agent right now." }
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

            {/* Display structured business intelligence */}
            {m.businessInsights && (
              <div className="dd-business-insights">
                <div className="dd-business-insights-header">📊 Business Intelligence</div>
                <div className="dd-business-insights-summary">{m.businessInsights.summary}</div>
                {m.businessInsights.revenue_signals && (
                  <div className="dd-business-insights-row">
                    <strong>Trend:</strong> {m.businessInsights.revenue_signals.trend}
                    {m.businessInsights.revenue_signals.top_product && <span> | Top Product: {m.businessInsights.revenue_signals.top_product}</span>}
                    {m.businessInsights.revenue_signals.top_lead_source && <span> | Top Source: {m.businessInsights.revenue_signals.top_lead_source}</span>}
                  </div>
                )}
                {m.businessInsights.growth_opportunities?.length > 0 && (
                  <div className="dd-business-insights-section">
                    <strong>Growth Opportunities:</strong>
                    <ul>{m.businessInsights.growth_opportunities.map((o, j) => <li key={j}>{o}</li>)}</ul>
                  </div>
                )}
                {m.businessInsights.risk_flags?.length > 0 && (
                  <div className="dd-business-insights-section dd-business-insights-risks">
                    <strong>Risk Flags:</strong>
                    <ul>{m.businessInsights.risk_flags.map((r, j) => <li key={j}>{r}</li>)}</ul>
                  </div>
                )}
                {m.businessInsights.recommended_next_action && (
                  <div className="dd-business-insights-action">
                    <strong>Next Action:</strong> {m.businessInsights.recommended_next_action}
                  </div>
                )}
                {m.businessInsights.confidence && (
                  <div className="dd-business-insights-confidence">Confidence: {m.businessInsights.confidence}</div>
                )}
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
