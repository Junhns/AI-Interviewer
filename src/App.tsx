import { useState } from "react";

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
Question 5 should be challenging even for experienced engineers, but nothing impossible or unfair just requires even more thought.
Start now.
`;

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Screen = "setup" | "chat";

export default function App() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [interviewType, setInterviewType] = useState("behavioral");
  const [role, setRole] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!input.trim()) return;
    const updated: Message[] = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    askClaude(updated);
  }

  if (screen === "setup") {
    return (
      <div style={{ padding: 40, maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
        <h1>🎤 AI Interview Coach</h1>
        <p style={{ color: "#888", marginBottom: 24 }}>Practice interviews, get real feedback.</p>

        <label>Interview Type</label>
        <select value={interviewType} onChange={e => setInterviewType(e.target.value)} style={{ display: "block", width: "100%", padding: 10, marginBottom: 16 }}>
          <option value="behavioral">Behavioral</option>
          <option value="technical">Technical CS</option>
          <option value="system design">System Design</option>
        </select>

        <label>Target Role</label>
        <input
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="e.g. Software Engineer at Google"
          style={{ display: "block", width: "100%", padding: 10, marginBottom: 24 }}
        />

        <button onClick={startInterview} style={{ padding: "12px 24px", background: "#7c3aed", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>
          Start Interview →
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h1>🎤 Interview in Progress</h1>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.filter((m, i) => !(m.role === "user" && i === 0)).map((m, i) => (
          <div key={i} style={{
            padding: 14,
            borderRadius: 10,
            background: m.role === "assistant" ? "#1e1b38" : "#2d1f4e",
            color: "#e8e8f0",
            alignSelf: m.role === "assistant" ? "flex-start" : "flex-end",
            maxWidth: "85%",
            whiteSpace: "pre-wrap"
          }}>
            <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6 }}>
              {m.role === "assistant" ? "🤖 Interviewer" : "🙂 You"}
            </div>
            {m.content}
          </div>
        ))}
      </div>
      
      {loading && <div style={{ color: "#888" }}>Hmm...</div>}

      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
        placeholder="Type your answer... (Enter to send)"
        rows={4}
        style={{ width: "100%", marginTop: 24, padding: 12, fontSize: 15 }}
      />
      <button
        onClick={sendAnswer}
        disabled={loading}
        style={{ marginTop: 12, padding: "12px 24px", background: "#7c3aed", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16 }}
      >
        Send Answer
      </button>
    </div>
  );
}
