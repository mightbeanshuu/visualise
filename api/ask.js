// Vercel Node serverless function — Groq-backed DSA tutor Q&A.
// The Groq API key stays server-side (process.env.GROQ_API_KEY) and is never
// exposed to the browser. Modern Vercel auto-detects /api/*.js as a function.

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = [
  "You are a concise, friendly DSA tutor embedded in an interactive",
  "data-structures-and-algorithms visualisation site.",
  "The learner is studying the pattern/problem shown on the current page.",
  "Explain clearly with: (1) the core intuition, (2) the approach/algorithm,",
  "and (3) time & space complexity. Prefer short paragraphs and tight bullet",
  "points. Use fenced code blocks (```lang) for code and `backticks` for",
  "inline identifiers. Stay focused on the asked pattern/problem; do not",
  "ramble. If the question is off-topic for DSA, gently steer back.",
].join(" ");

async function readBody(req) {
  // Vercel usually pre-parses JSON into req.body, but fall back to the raw stream.
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { return {}; }
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not set" });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  const context = typeof body.context === "string" ? body.context.trim() : "";

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }
  if (question.length > 2000) {
    return res.status(400).json({ error: "Question too long (max 2000 characters)." });
  }

  const userContent = context
    ? `Page context: ${context}\n\nLearner's question: ${question}`
    : question;

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 700,
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!groqRes.ok) {
      let detail = "";
      try {
        const errJson = await groqRes.json();
        detail = errJson?.error?.message || errJson?.message || JSON.stringify(errJson);
      } catch {
        detail = await groqRes.text().catch(() => "");
      }
      return res.status(groqRes.status).json({
        error: `Groq API error (${groqRes.status})`,
        detail: detail || groqRes.statusText,
      });
    }

    const data = await groqRes.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) {
      return res.status(502).json({ error: "Empty response from Groq." });
    }
    return res.status(200).json({ answer });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to reach Groq API.",
      detail: err && err.message ? err.message : String(err),
    });
  }
};
