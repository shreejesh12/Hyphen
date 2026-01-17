import express from "express";
import cors from "cors";
import { aiSecondOpinion } from "./logic/ai.js";
import helmet from "helmet";
import dotenv from "dotenv";
import { analyzePayload } from "./logic/analyze.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json({ limit: "256kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Rules-only (fast)
app.post("/analyze", (req, res) => {
  try {
    const { text = "", url = "" } = req.body || {};
    res.json(analyzePayload({ text, url }));
  } catch (err) {
    res.status(400).json({ error: "Bad request", message: err?.message || String(err) });
  }
});

// AI-only (always calls AI)
app.post("/analyze-ai", async (req, res) => {
  try {
    const { text = "", url = "" } = req.body || {};
    const ai = await aiSecondOpinion({ text, url });
    res.json(ai);
  } catch (err) {
    res.status(400).json({ error: "Bad request", message: err?.message || String(err) });
  }
});

// Smart (rules first, AI only if borderline)
app.post("/analyze-smart", async (req, res) => {
  try {
    const { text = "", url = "" } = req.body || {};

    const rules = analyzePayload({ text, url });

    // Borderline window: only then call AI
    const borderline = rules.riskScore >= 30 && rules.riskScore <= 70;

    if (!borderline) {
      return res.json({ source: "rules", ...rules });
    }

    const ai = await aiSecondOpinion({ text, url });

    // Combine: take the higher severity between rules + AI
    const severity = { Safe: 0, Warning: 1, Dangerous: 2 };
    const finalClass =
      severity[ai.classification] > severity[rules.classification]
        ? ai.classification
        : rules.classification;

    // Map class -> score baseline (for display)
    const baseScore = finalClass === "Dangerous" ? 80 : finalClass === "Warning" ? 55 : 20;

    return res.json({
      source: "hybrid",
      riskScore: Math.max(rules.riskScore, baseScore),
      classification: finalClass,
      category: ai.category || rules.category,
      confidence: ai.confidence || rules.confidence,
      recommendedAction: ai.recommendedAction || rules.recommendedAction,
      explanation: Array.from(new Set([...(rules.explanation || []), ...(ai.explanation || [])])).slice(0, 10),
      signals: rules.signals
    });
  } catch (err) {
    res.status(400).json({ error: "Bad request", message: err?.message || String(err) });
  }
});


const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
