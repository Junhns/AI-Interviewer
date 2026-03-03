import { useState, useEffect, useRef } from "react";

const systemPrompt = (type: string, role: string) => `
You are a senior engineer at a top tech company conducting a ${type} interview for a ${role} position.

Begin with a brief, friendly greeting. Tell the candidate the format: 5 questions, feedback after each, and a final assessment at the end. Keep it short and professional. Then ask question 1.

After each answer, give feedback in this exact structure:

1. **What you didn't address** — List the key things that were missing from their answer. Be direct and specific.

2. **Critique** — Explain why those gaps matter and how it would come across to a real interviewer. Be honest, not mean.

3. **What you did right** — Acknowledge anything genuinely good about their answer, even if small.

4. **What a strong answer looks like** — Give a clear example of what should have been said, with bullet points and concrete examples.

5. **What to study** — List specific topics, concepts, or skills they need to work on before a real interview. When appropriate give authentic websites or manuals or videos that could help.

6. **Score: X/10**

If someone says "I'm not sure" or guesses, don't penalize them for honesty — but still walk them through exactly what they should have known.

Your tone is direct and honest but you genuinely want them to improve. Think of yourself as a mentor who doesn't waste time with fluff.

Ask ONE question at a time. Give 5 questions total, then a final overall assessment.
Start with simpler, foundational questions and gradually increase difficulty with each question.
Question 1 should be something a junior developer could reasonably answer with some thought.
Question 5 should be challenging even for experienced engineers, but nothing impossible or unfair.
Start now.
`;

type Message = { role: "user" | "assistant"; content: string };
type Screen = "setup" | "chat";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080c14;
    --surface: #0d1420;
    --surface2: #111a2e;
    --border: #1a2a45;
    --border2: #1e3252;
    --blue: #3b82f6;
    --blue-bright: #60a5fa;
    --blue-dim: #1d3a6e;
    --text: #e2eaf8;
    --text-dim: #5a7299;
    --text-mid: #8ba3c9;
    --green: #22d3a0;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-display);
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: 
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 80% 80%, rgba(34,211,160,0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .app {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 20px;
  }

  /* HEADER */
  .header {
    width: 100%;
    max-width: 700px;
    margin-bottom: 48px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-mark {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--blue), var(--green));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .logo-text {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-mid);
  }

  .header-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border2), transparent);
  }

  /* SETUP */
  .setup {
    width: 100%;
    max-width: 520px;
    animation: fadeUp 0.5s ease forwards;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .setup-title {
    font-size: 2.8rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--text) 0%, var(--blue-bright) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .setup-sub {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--text-dim);
    letter-spacing: 0.05em;
    margin-bottom: 40px;
  }

  .field {
    margin-bottom: 20px;
  }

  .field label {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--blue-bright);
    margin-bottom: 8px;
  }

  .field input, .field select {
    width: 100%;
    padding: 14px 16px;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-display);
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }

  .field input:focus, .field select:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }

  .field input::placeholder { color: var(--text-dim); }

  .select-wrap {
    position: relative;
  }

  .select-wrap::after {
    content: '▾';
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-dim);
    pointer-events: none;
    font-size: 0.8rem;
  }

  .start-btn {
    width: 100%;
    margin-top: 32px;
    padding: 16px;
    background: linear-gradient(135deg, var(--blue) 0%, #1d4ed8 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 24px rgba(59,130,246,0.3);
    position: relative;
    overflow: hidden;
  }

  .start-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .start-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(59,130,246,0.4); }
  .start-btn:hover::before { opacity: 1; }
  .start-btn:active { transform: translateY(0); }

  /* CHAT */
  .chat {
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    animation: fadeUp 0.4s ease forwards;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }

  .chat-title {
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-mid);
  }

  .status-dot {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--green);
  }

  .status-dot::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
    max-height: 55vh;
    overflow-y: auto;
    padding-right: 8px;
    scrollbar-width: thin;
    scrollbar-color: var(--border2) transparent;
  }

  .messages::-webkit-scrollbar { width: 4px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  .msg {
    display: flex;
    flex-direction: column;
    gap: 6px;
    animation: msgIn 0.3s ease forwards;
  }

  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .msg.ai .msg-label { color: var(--blue-bright); }
  .msg.user .msg-label { color: var(--green); align-self: flex-end; }

  .msg-bubble {
    padding: 16px 18px;
    border-radius: 12px;
    line-height: 1.7;
    font-size: 0.92rem;
    white-space: pre-wrap;
    max-width: 88%;
  }

  .msg.ai .msg-bubble {
    background: var(--surface);
    border: 1px solid var(--border2);
    align-self: flex-start;
    color: var(--text);
    border-top-left-radius: 4px;
  }

  .msg.user .msg-bubble {
    background: var(--blue-dim);
    border: 1px solid rgba(59,130,246,0.3);
    align-self: flex-end;
    color: var(--text);
    border-top-right-radius: 4px;
  }

  .thinking {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    border-top-left-radius: 4px;
    width: fit-content;
    margin-bottom: 8px;
  }

  .thinking span {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }

  .dots { display: flex; gap: 4px; }

  .dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--blue);
    animation: dotBounce 1.4s infinite;
  }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes dotBounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
    40% { transform: translateY(-5px); opacity: 1; }
  }

  .input-area {
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-area:focus-within {
    border-color: var(--blue);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
  }

  .input-area textarea {
    width: 100%;
    padding: 16px 18px;
    background: transparent;
    border: none;
    color: var(--text);
    font-family: var(--font-display);
    font-size: 0.95rem;
    resize: none;
    outline: none;
    min-height: 90px;
    line-height: 1.6;
  }

  .input-area textarea::placeholder { color: var(--text-dim); }

  .input-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-top: 1px solid var(--border);
  }

  .input-hint {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-dim);
    letter-spacing: 0.05em;
  }

  .send-btn {
    padding: 8px 20px;
    background: var(--blue);
    color: white;
    border: none;
    border-radius: 7px;
    font-family: var(--font-display);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .send-btn:hover { background: var(--blue-bright); }
  .send-btn:active { transform: scale(0.97); }
  .send-btn:disabled { background: var(--border2); color: var(--text-dim); cursor: not-allowed; transform: none; }
`;

export default function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [interviewType, setInterviewType] = useState("behavioral");
  const [role, setRole] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function askClaude(history: Message[]) {
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: systemPrompt(interviewType, role || "Software Engineer"),
          messages: history,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const reply = data.content[0].text as string;
      const updated = [...history, { role: "assistant" as const, content: reply }];
      setMessages(updated);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function startInterview() {
    const initial: Message[] = [{ role: "user", content: "Start the interview now." }];
    setMessages(initial);
    setScreen("chat");
    askClaude(initial);
  }

  function sendAnswer() {
    if (!input.trim() || loading) return;
    const updated: Message[] = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    askClaude(updated);
  }

  const visibleMessages = messages.filter((m, i) => !(m.role === "user" && i === 0));

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="logo-mark">⚡</div>
          <span className="logo-text">InterviewAI</span>
          <div className="header-line" />
        </div>

        {screen === "setup" ? (
          <div className="setup">
            <h1 className="setup-title">Practice.<br />Get better.<br />Get hired.</h1>
            <p className="setup-sub">// AI-powered mock interviews with real feedback</p>

            <div className="field">
              <label>Interview Type</label>
              <div className="select-wrap">
                <select value={interviewType} onChange={e => setInterviewType(e.target.value)}>
                  <option value="behavioral">Behavioral</option>
                  <option value="technical">Technical CS</option>
                  <option value="system design">System Design</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label>Target Role</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Software Engineer at Google"
                onKeyDown={e => e.key === "Enter" && startInterview()}
              />
            </div>

            <button className="start-btn" onClick={startInterview}>
              Start Interview →
            </button>
          </div>
        ) : (
          <div className="chat">
            <div className="chat-header">
              <span className="chat-title">Mock Interview</span>
              <div className="status-dot">Live Session</div>
            </div>

            <div className="messages">
              {visibleMessages.map((m, i) => (
                <div key={i} className={`msg ${m.role === "assistant" ? "ai" : "user"}`}>
                  <span className="msg-label">
                    {m.role === "assistant" ? "Interviewer" : "You"}
                  </span>
                  <div className="msg-bubble">{m.content}</div>
                </div>
              ))}
              {loading && (
                <div className="thinking">
                  <div className="dots">
                    <div className="dot" /><div className="dot" /><div className="dot" />
                  </div>
                  <span>Analyzing your response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                placeholder="Type your answer..."
              />
              <div className="input-footer">
                <span className="input-hint">↵ enter to send · shift+↵ new line</span>
                <button className="send-btn" onClick={sendAnswer} disabled={loading}>
                  Send ↗
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
