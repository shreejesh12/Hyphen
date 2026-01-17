import OpenAI from "openai";

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function getClient() {
  const key = process.env.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;
  if (!key) throw new Error("OPENAI_API_KEY missing in api/.env");
  return new OpenAI({ apiKey: key });
}

export async function aiSecondOpinion({ text, url }) {
  const client = getClient();

  const prompt = `
You are CampusShield, a campus-focused scam/phishing detector.
Classify the input as one of: Safe, Warning, Dangerous.

Return STRICT JSON ONLY with keys:
classification: "Safe"|"Warning"|"Dangerous"
confidence: integer 50-95
category: short string like "Credential Phishing"|"Internship Scam"|"Payment/Refund Fraud"|"Malicious Link"|"General Suspicious"
explanation: array of 3-6 short bullet reasons (strings)
recommendedAction: one short sentence

Input:
MESSAGE: ${text || "(none)"}
URL: ${url || "(none)"}

Rules:
- If it asks for OTP/password/login OR urgent verification => likely Dangerous.
- If it asks for money/UPI/fees/refund => likely Warning/Dangerous.
- If internship/job offer + fee => Dangerous.
- If URL shortener or non-https + suspicious => Warning/Dangerous.
`;

  const resp = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "Return only valid JSON. No markdown." },
      { role: "user", content: prompt }
    ],
    temperature: 0.2
  });

  const raw = resp.choices?.[0]?.message?.content || "{}";

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI returned non-JSON output. Try again.");
  }

  const classification = ["Safe", "Warning", "Dangerous"].includes(parsed.classification)
    ? parsed.classification
    : "Warning";

  const confidence = clamp(Number(parsed.confidence || 70), 50, 95);

  return {
    source: "ai",
    classification,
    confidence,
    category: String(parsed.category || "General Suspicious"),
    explanation: Array.isArray(parsed.explanation) ? parsed.explanation.slice(0, 10) : [],
    recommendedAction: String(parsed.recommendedAction || "Be cautious and verify via official sources.")
  };
}
