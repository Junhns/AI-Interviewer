from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
from dotenv import load_dotenv
import requests
from bs4 import BeautifulSoup
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic()

# --- WEB SEARCH TOOL ---

def search_web(query: str) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
        res = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(res.text, "html.parser")
        snippets = soup.find_all("div", class_="BNeawe")
        results = " ".join([s.get_text() for s in snippets[:5]])
        return results if results else "No results found."
    except Exception as e:
        return f"Search failed: {str(e)}"

# --- REQUEST MODEL ---

class InterviewRequest(BaseModel):
    messages: list
    interviewType: str
    role: str
    company: str = ""
    isFirstMessage: bool = False

# --- AGENT TOOLS ---

tools = [
    {
        "name": "search_web",
        "description": "Search the web for information about a company's interview process, common questions, and interview experience.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                }
            },
            "required": ["query"]
        }
    }
]

# --- MAIN ENDPOINT ---

@app.post("/interview")
async def interview(req: InterviewRequest):
    research_context = ""

    # Only research on first message
    if req.isFirstMessage and req.company:
        print(f"Received — Type: {req.interviewType}, Company: {req.company}, First: {req.isFirstMessage}")

        # Use agent to research the company
        research_messages = [
            {
                "role": "user",
                "content": f"Search for common interview questions and the interview process at {req.company} for a {req.role} position. Search twice — once for interview questions and once for the interview process."
            }
        ]

        # Agent research loop
        while True:
            response = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1024,
                tools=tools,
                messages=research_messages
            )

            if response.stop_reason == "end_turn":
                for block in response.content:
                    if hasattr(block, "text"):
                        research_context = block.text
                        print(f"\n--- RESEARCH ---\n{research_context[:800]}\n---\n")
                break

            if response.stop_reason == "tool_use":
                research_messages.append({"role": "assistant", "content": response.content})
                tool_results = []
                for block in response.content:
                    if block.type == "tool_use":
                        result = search_web(block.input["query"])
                        print(f"Searched: {block.input['query']}")
                        tool_results.append({
                            "type": "tool_result",
                            "tool_use_id": block.id,
                            "content": result
                        })
                research_messages.append({"role": "user", "content": tool_results})

    # Build system prompt with research
    system_prompt = f"""You are a senior engineer at {req.company if req.company else "a top tech company"} conducting a {req.interviewType} interview for a {req.role} position.

        {f'''RESEARCH FINDINGS about {req.company}:
        {research_context}

        Use this research to ask realistic, company-specific questions.''' if research_context else ""}

        INTERVIEW RULES:
        - Ask ONE question at a time
        - Give 5 questions total then a final assessment
        - Adjust difficulty based on role: junior roles start easier, senior roles start harder

        {"TECHNICAL INTERVIEW SPECIFIC RULES:" if req.interviewType == "technical" else ""}
        {"- Ask real algorithmic problems similar to what " + req.company + " actually asks" if req.interviewType == "technical" else ""}
        {"- Start with an easy problem (arrays, hashmaps)" if req.interviewType == "technical" else ""}
        {"- Progress to medium difficulty by question 3" if req.interviewType == "technical" else ""}
        {"- Ask the candidate to explain their thought process, not just the answer" if req.interviewType == "technical" else ""}
        {"- Hint system: if they're stuck, give a small nudge rather than the answer" if req.interviewType == "technical" else ""}

        {"BEHAVIORAL INTERVIEW SPECIFIC RULES:" if req.interviewType == "behavioral" else ""}
        {"- Use the STAR format (Situation, Task, Action, Result)" if req.interviewType == "behavioral" else ""}
        {"- Ask follow up questions if the answer is vague" if req.interviewType == "behavioral" else ""}
        {"- Focus on leadership, conflict resolution, and technical decisions" if req.interviewType == "behavioral" else ""}

        After each answer give feedback in this exact structure:
        1. **What you didn't address** — specific gaps, be direct
        2. **Critique** — why it matters at {req.company if req.company else "this company"}
        3. **What you did right** — genuine positives only
        4. **What a strong answer looks like** — concrete example with bullet points
        5. **What to study** — specific resources, links, leetcode problems by name
        6. **Score: X/10**

        Begin with a brief greeting, introduce yourself as a {req.company if req.company else "company"} engineer, explain the format, then ask question 1. Start now."""

    # Call Claude for the interview
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system_prompt,
        messages=req.messages
    )

    return {"content": [{"text": response.content[0].text}]}