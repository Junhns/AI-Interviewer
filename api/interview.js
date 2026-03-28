// Vercel serverless deployment version
// For local development use backend/main.py

const rateLimit = new Map();

async function searchWeb(query) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`,
      {
        headers: {
          "Accept": "application/json",
          "X-Subscription-Token": process.env.BRAVE_API_KEY,
        },
      }
    );
    const data = await response.json();
    const results = data.web?.results?.map(r => `${r.title}: ${r.description}`).join("\n") || "No results found";
    return results;
  } catch (err) {
    return "Search failed";
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  if (!rateLimit.has(ip)) rateLimit.set(ip, []);
  const requests = rateLimit.get(ip).filter(t => now - t < windowMs);
  if (requests.length >= maxRequests) {
    return res.status(429).json({ error: "Too many requests" });
  }
  requests.push(now);
  rateLimit.set(ip, requests);

  try {
    const { messages, interviewType, role, company, isFirstMessage } = req.body;

    let researchContext = "";

    // Only search on first message to avoid repeated searches
    if (isFirstMessage && company) {
      console.log(`Researching ${company}...`);
      const [questions, process] = await Promise.all([
        searchWeb(`${company} ${role} interview questions`),
        searchWeb(`${company} software engineer interview process site:glassdoor.com OR site:leetcode.com`),
      ]);
      researchContext = `
Here is real research about ${company}'s interview process:

COMMON INTERVIEW QUESTIONS AT ${company}:
${questions}

INTERVIEW PROCESS:
${process}

Use this research to ask realistic, company-specific questions.
`;
    }

    const systemPrompt = `You are a senior engineer at a top tech company conducting a ${interviewType} interview for a ${role} position${company ? ` at ${company}` : ""}.

${researchContext}

Begin with a brief, friendly greeting. Tell the candidate the format: 5 questions, feedback after each, and a final assessment at the end. Keep it short and professional. Then ask question 1.

After each answer, give feedback in this exact structure:

1. **What you didn't address** — List the key things that were missing from their answer. Be direct and specific.

2. **Critique** — Explain why those gaps matter and how it would come across to a real interviewer. Be honest, not mean.

3. **What you did right** — Acknowledge anything genuinely good about their answer, even if small.

4. **What a strong answer looks like** — Give a clear example of what should have been said, with bullet points and concrete examples.

5. **What to study** — List specific topics, concepts, or skills they need to work on before a real interview. When appropriate give authentic websites or manuals or videos that could help.

6. **Score: X/10**

Ask ONE question at a time. Give 5 questions total, then a final overall assessment.
Start with simpler foundational questions and gradually increase difficulty.
Start now.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
```

This uses **Brave Search API** — it's free for 2000 searches/month. Go to **brave.com/search/api** and sign up for a free API key.

Add to your `.env`:
```
ANTHROPIC_API_KEY=your_key
//Using brave for actual search 
//BRAVE_API_KEY=your_brave_key