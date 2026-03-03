# AI Interview Coach

An AI-powered mock interview app that asks real interview questions and gives structured, honest feedback after each answer.

## Features
- Behavioral, Technical CS, and System Design interviews
- Feedback after every answer: what you missed, critique, what you did well, and what a strong answer looks like
- Gradually increasing difficulty across 5 questions
- Final overall assessment at the end

## Tech Stack
- React
- TypeScript
- Claude API (Anthropic)
- CSS

## Screenshots
<img width="850" height="722" alt="image" src="https://github.com/user-attachments/assets/b7024e82-3407-4b11-9f44-58b1bf6346ad" />
<img width="963" height="913" alt="image" src="https://github.com/user-attachments/assets/0f1a3866-695a-4c8f-8263-f58e7c08a904" />


## Setup

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file in the root:
```
VITE_ANTHROPIC_API_KEY=your_key_here
```
4. Get an API key at console.anthropic.com
5. Run `npm run dev`

## Notes
Built as a portfolio project. In production I'd move the API call to a backend to avoid exposing the key in the browser.
