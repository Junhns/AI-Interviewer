# AI Interview Coach

An AI-powered mock interview app that conducts company-specific interviews using an agentic research loop and gives structured, honest feedback after each answer.

## Features
- Behavioral, Technical CS, and System Design interviews
- Company-specific questions — enter a company name and the agent researches their interview patterns before starting
- Feedback after every answer: what you missed, critique, what you did well, and what a strong answer looks like
- Gradually increasing difficulty across 5 questions
- Final overall assessment at the end
- Data structures study guide with patterns, complexity tables, and practice problems

## Architecture
- **React + TypeScript frontend** — UI, conversation state management, and API calls
- **Python/FastAPI backend** — agentic research loop using Claude's tool use API
- **Claude API** — conducts the interview using research context

## How the Agent Works
1. User enters role, company, and interview type
2. Backend agent autonomously searches for company-specific interview patterns
3. Claude synthesizes the research into a tailored system prompt
4. Interview is conducted using real company context

## Tech Stack
- React, TypeScript, Vite
- Python, FastAPI, Uvicorn
- Claude API (Anthropic) with tool use
- CSS

## Setup

**Backend:**
```bash
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

**Frontend (separate terminal):**
```bash
npm install
npm run dev
```

**Environment variables:**

Frontend `.env`:
```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Backend `backend/.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

## Screenshots
<img width="850" height="722" alt="image" src="https://github.com/user-attachments/assets/b7024e82-3407-4b11-9f44-58b1bf6346ad" />
<img width="963" height="913" alt="image" src="https://github.com/user-attachments/assets/0f1a3866-695a-4c8f-8263-f58e7c08a904" />
