# Ask-AI widget — Groq setup

The "Ask AI" widget on the pattern hub pages calls a Vercel serverless
function at `/api/ask`, which talks to Groq's LLM. The Groq API key stays
**server-side only** — it is never shipped to the browser.

## 1. Get a Groq API key

1. Go to <https://console.groq.com> and sign in (free).
2. Open **API Keys** → **Create API Key**.
3. Copy the key (starts with `gsk_…`). You only see it once.

## 2. Add it to Vercel

1. Open the project on <https://vercel.com> → **Settings** → **Environment
   Variables**.
2. Add a new variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** your `gsk_…` key
   - **Environments:** Production (and Preview/Development if you want it on
     preview deploys too).
3. Click **Save**.
4. **Redeploy** the project (Deployments → ⋯ → Redeploy, or push a commit).
   Env vars only take effect on a fresh deploy.

Without `GROQ_API_KEY` set, `/api/ask` returns
`500 { "error": "GROQ_API_KEY not set" }` and the widget shows that message.

## 3. Test locally

```bash
npm i -g vercel          # if you don't have the CLI
vercel link              # link to the project (once)
vercel env pull          # pulls GROQ_API_KEY into .env.local
vercel dev               # serves the static site + /api/ask on localhost
```

Then open a hub page (e.g. `http://localhost:3000/graphs/bfs-patterns/`),
click the sparkle button bottom-right, and ask a question.

Quick API check:

```bash
curl -s -X POST http://localhost:3000/api/ask \
  -H 'Content-Type: application/json' \
  -d '{"question":"Why is BFS shortest path on an unweighted graph?","context":"BFS Hub"}'
```

## Function contract

`POST /api/ask`

- Request: `{ "question": string (1–2000 chars), "context"?: string }`
- Success: `200 { "answer": string }`
- Errors: `405` non-POST · `400` empty/oversized question or bad JSON ·
  `500` missing key / network · upstream Groq status passed through with
  `{ error, detail }`.

Model: `llama-3.3-70b-versatile` · `temperature 0.3` · `max_tokens 700`.
