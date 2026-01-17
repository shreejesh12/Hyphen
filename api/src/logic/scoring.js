import { URL } from "node:url";

const URGENCY = ["urgent","immediately","asap","act now","final warning","limited time","today only"];
const CRED = ["password","otp","verify","login","sign in","account locked","reset","2fa"];
const MONEY = ["payment","fees","fine","upi","refund","bank","gift card","crypto"];
const INTERNSHIP = ["internship","placement","job offer","selected","shortlisted","hr","registration fee","training fee"];

const SHORTENERS = new Set(["bit.ly","tinyurl.com","t.co","cutt.ly","is.gd","ow.ly","rebrand.ly"]);

const countHits = (text, words) => {
  const s = text.toLowerCase();
  return words.reduce((a, w) => a + (s.includes(w) ? 1 : 0), 0);
};

export function scoreText(text) {
  if (!text) return { score: 0, reasons: [], signals: {} };

  let score = 0;
  const reasons = [];

  const urgencyHits = countHits(text, URGENCY);
  if (urgencyHits) { score += 10 + urgencyHits * 3; reasons.push("Urgency/pressure language detected"); }

  const credHits = countHits(text, CRED);
  if (credHits) { score += 18 + credHits * 4; reasons.push("Login/OTP/password verification bait"); }

  const moneyHits = countHits(text, MONEY);
  if (moneyHits) { score += 12 + moneyHits * 4; reasons.push("Money/UPI/refund/payment language present"); }

  const internshipHits = countHits(text, INTERNSHIP);
  if (internshipHits) { score += 8 + internshipHits * 2; reasons.push("Internship/placement bait signals present"); }

  const hasLink = /(https?:\/\/|www\.)\S+/i.test(text);
  if (hasLink) { score += 10; reasons.push("Message contains a link (common attack vector)"); }

  return {
    score: Math.min(100, score),
    reasons,
    signals: { urgencyHits, credHits, moneyHits, internshipHits, hasLink }
  };
}

function isIp(host) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
}

export function scoreUrl(url) {
  if (!url) return { score: 0, reasons: [], signals: {} };

  const normalized = url.startsWith("http://") || url.startsWith("https://")
  ? url
  : `https://${url}`;


  let parsed;
  try { parsed = new URL(normalized); }
  catch { return { score: 60, reasons: ["Invalid URL format / cannot parse"], signals: { valid: false } }; }

  let score = 0;
  const reasons = [];

  const host = parsed.hostname.toLowerCase();
  const full = parsed.toString();

  if (parsed.protocol !== "https:") { score += 15; reasons.push("URL is not HTTPS"); }
  if (SHORTENERS.has(host)) { score += 20; reasons.push("URL shortener used (hides destination)"); }
  if (isIp(host)) { score += 25; reasons.push("Uses raw IP address instead of domain"); }

  const subdomains = host.split(".").length - 2;
  if (subdomains >= 3) { score += 12; reasons.push("Many subdomains (possible lookalike/mimic)"); }

  if (full.length > 120) { score += 10; reasons.push("Very long URL (often used to obfuscate)"); }

  return {
    score: Math.min(100, score),
    reasons,
    signals: { valid: true, host, https: parsed.protocol === "https:", subdomains, length: full.length }
  };
}
