import { scoreText, scoreUrl } from "./scoring.js";

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function labelFor(score) {
  if (score >= 70) return "Dangerous";
  if (score >= 35) return "Warning";
  return "Safe";
}

function actionFor(label) {
  if (label === "Dangerous") return "Do NOT click. Report it to your campus IT/security team.";
  if (label === "Warning") return "Don’t click yet. Verify via official sources first.";
  return "Looks okay, but stay cautious and verify if unsure.";
}

// Simple category heuristic (judge-friendly)
function categoryFor({ textSignals, urlSignals }) {
  const { moneyHits = 0, internshipHits = 0, credHits = 0 } = textSignals || {};
  const { host = "" } = urlSignals || {};

  if (internshipHits >= 1) return "Internship Scam";
  if (moneyHits >= 1) return "Payment / Refund Fraud";
  if (credHits >= 1) return "Credential Phishing";
  if (host && (host.includes("login") || host.includes("verify") || host.includes("secure"))) return "Credential Phishing";
  return "General Suspicious";
}

// Confidence is not "ML probability"—it's a calibrated-looking heuristic for demo.
function confidenceFor(score) {
  // higher confidence at extremes, lower in the middle
  const mid = Math.abs(score - 50);
  const conf = clamp(Math.round(50 + mid), 50, 95);
  return conf;
}

export function analyzePayload({ text, url }) {
  const cleanText = String(text || "").trim();
  const cleanUrl = String(url || "").trim();
  if (!cleanText && !cleanUrl) throw new Error("Provide at least one of: text or url");

  const t = scoreText(cleanText);
  
  const u = scoreUrl(cleanUrl);

  let score = Math.round(t.score * 0.55 + u.score * 0.45);
  score = clamp(score, 0, 100);
const { urgencyHits=0, moneyHits=0, internshipHits=0, credHits=0, hasLink=false } = t.signals || {};
const { host="", https=true } = u.signals || {};
const shorteners = new Set(["bit.ly","tinyurl.com","t.co","cutt.ly","is.gd","ow.ly","rebrand.ly"]);
const isShortener = shorteners.has(host);

// Hard overrides: never allow "Safe" if strong scam combos exist
if ((moneyHits && urgencyHits) || (moneyHits && internshipHits) || (credHits && hasLink)) {
  score = Math.max(score, 75); // Dangerous
}
if (isShortener && (moneyHits || internshipHits || credHits || urgencyHits)) {
  score = Math.max(score, 65); // Warning/Dangerous
}
if (!https && (credHits || moneyHits)) {
  score = Math.max(score, 60);
}

  const classification = labelFor(score);
  const category = categoryFor({ textSignals: t.signals, urlSignals: u.signals });
  const confidence = confidenceFor(score);

  const explanation = Array.from(new Set([...t.reasons, ...u.reasons])).slice(0, 10);

  return {
    riskScore: score,
    classification,
    category,
    confidence, // percent
    recommendedAction: actionFor(classification),
    explanation,
    signals: { text: t.signals, url: u.signals }
  };
}