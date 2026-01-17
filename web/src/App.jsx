import React, { useEffect, useMemo, useRef, useState } from "react";


const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

const SAMPLES = [
  {
    tag: "Internship Scam",
    text: "Congrats! You are shortlisted for internship. Pay ₹299 registration fee TODAY to confirm your seat. Send UPI screenshot immediately.",
    url: "bit.ly/internship-confirm",
  },
  {
    tag: "OTP Phishing",
    text: "URGENT: Your college email will be disabled in 30 minutes. Verify OTP and login now to avoid account lock.",
    url: "http://accounts-security-verification.com/login",
  },
  {
    tag: "Refund Fraud",
    text: "Refund initiated for your fee payment. To receive money, verify UPI and share OTP now. Act immediately to avoid cancellation.",
    url: "tinyurl.com/refund-check",
  },
  {
    tag: "Normal Message",
    text: "Reminder: Tomorrow’s lecture is at 2 PM in Room B-204. All updates will be posted on the official portal.",
    url: "",
  },
];

const short = (s, n = 80) => (s && s.length > n ? s.slice(0, n) + "…" : s || "");

function clsx(...a) {
  return a.filter(Boolean).join(" ");
}

function pill(kind, theme) {
  const isDark = theme === "dark";
  const map = {
    Safe: isDark
      ? { bg: "#062A1A", bd: "#134E2F", tx: "#7EF2B3" }
      : { bg: "#ECFDF3", bd: "#B7F7D1", tx: "#0F7A3B" },
    Warning: isDark
      ? { bg: "#2A1A05", bd: "#5A2D0C", tx: "#FDBA74" }
      : { bg: "#FFF7ED", bd: "#FED7AA", tx: "#9A3412" },
    Dangerous: isDark
      ? { bg: "#2A0A0A", bd: "#7F1D1D", tx: "#FCA5A5" }
      : { bg: "#FEF2F2", bd: "#FECACA", tx: "#991B1B" },
    Neutral: isDark
      ? { bg: "#0B1220", bd: "#1F2A44", tx: "#C7D2FE" }
      : { bg: "#F1F5F9", bd: "#CBD5E1", tx: "#334155" },
  };

  const c = map[kind] || map.Neutral;
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 12px",
    borderRadius: 999,
    background: c.bg,
    border: `1px solid ${c.bd}`,
    color: c.tx,
    fontWeight: 900,
    fontSize: 13,
    whiteSpace: "nowrap",
  };
}
function HeroDashboard({ theme, engine, setEngine, goToAnalyzer, stats }) {
  const isDark = theme === "dark";

  const bg = isDark
    ? "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.22), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(56,189,248,0.18), transparent 55%), #050A14"
    : "radial-gradient(1200px 600px at 20% 10%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(56,189,248,0.14), transparent 55%), #F8FAFC";

  const cardBg = isDark ? "rgba(11,18,32,0.75)" : "rgba(255,255,255,0.75)";
  const border = isDark ? "#1F2A44" : "#E2E8F0";
  const txt = isDark ? "#E5E7EB" : "#0F172A";
  const muted = isDark ? "#93A4C7" : "#64748B";

  const tile = {
    background: cardBg,
    border: `1px solid ${border}`,
    borderRadius: 18,
    padding: 16,
    backdropFilter: "blur(10px)",
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        background: bg,
        color: txt,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1150,
          margin: "0 auto",
          padding: "26px 22px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "grid", gap: 18 }}>
          {/* HERO HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 14,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 44, fontWeight: 1000, letterSpacing: -1 }}>
                CampusShield
              </div>
              <div style={{ marginTop: 8, color: muted, fontSize: 15, maxWidth: 720, lineHeight: 1.6 }}>
                Detect campus scams and phishing from messages + links.
                Fast rules, optional AI, and a shareable risk report for students and admins.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: 10,
                  border: `1px solid ${border}`,
                  borderRadius: 14,
                  background: isDark ? "rgba(7,13,26,0.75)" : "rgba(248,250,252,0.75)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 900, color: muted }}>Engine</div>
                <select
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  style={{
                    background: isDark ? "#070D1A" : "white",
                    color: txt,
                    border: `1px solid ${isDark ? "#2B3B60" : "#CBD5E1"}`,
                    borderRadius: 12,
                    padding: "8px 10px",
                    fontWeight: 900,
                  }}
                >
                  <option value="rules">Rules (fast)</option>
                  <option value="smart">Smart (rules + AI)</option>
                  <option value="ai">AI only</option>
                </select>
              </div>

              <button
                onClick={goToAnalyzer}
                style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  border: `1px solid ${isDark ? "#E5E7EB" : "#0F172A"}`,
                  background: isDark ? "#E5E7EB" : "#0F172A",
                  color: isDark ? "#0B1220" : "white",
                  fontWeight: 950,
                  cursor: "pointer",
                }}
              >
                Start analyzing →
              </button>
            </div>
          </div>

          {/* TILES */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 14,
            }}
          >
            {/* Quick stats */}
            <div style={{ ...tile, gridColumn: "span 5" }}>
              <div style={{ fontWeight: 950, marginBottom: 10 }}>Quick stats</div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, color: muted, fontWeight: 800 }}>Analyses</div>
                  <div style={{ fontSize: 28, fontWeight: 1000, marginTop: 6 }}>
                    {stats.total}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, color: muted, fontWeight: 800 }}>Last score</div>
                  <div style={{ fontSize: 28, fontWeight: 1000, marginTop: 6 }}>
                    {stats.lastScore ?? "—"}
                  </div>
                </div>
                <div style={{ padding: 12, borderRadius: 14, border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 12, color: muted, fontWeight: 800 }}>Last label</div>
                  <div style={{ fontSize: 18, fontWeight: 1000, marginTop: 10 }}>
                    {stats.lastClass ?? "—"}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, color: muted, fontSize: 13, lineHeight: 1.6 }}>
                Tip: Use <b style={{ color: txt }}>Smart</b> for fast + accurate behavior.
                Rules-only is instant but can under/over-shoot sometimes.
              </div>
            </div>

            {/* How it works */}
            <div style={{ ...tile, gridColumn: "span 7" }}>
              <div style={{ fontWeight: 950, marginBottom: 10 }}>How it works</div>
              <div style={{ display: "grid", gap: 10, color: isDark ? "#C7D2FE" : "#334155", lineHeight: 1.6 }}>
                <div><b>1)</b> Paste a message and/or link.</div>
                <div><b>2)</b> We detect scam signals (urgency, money/UPI, OTP bait, shortened URLs, fake domains).</div>
                <div><b>3)</b> You get a risk score, category, confidence, and recommended action.</div>
                <div><b>4)</b> Copy report to share with admin/IT for quick verification.</div>
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <span style={{ ...pill("Neutral", theme) }}>Internship scams</span>
                <span style={{ ...pill("Neutral", theme) }}>OTP phishing</span>
                <span style={{ ...pill("Neutral", theme) }}>Refund fraud</span>
                <span style={{ ...pill("Neutral", theme) }}>Suspicious links</span>
              </div>
            </div>

            {/* Demo script */}
            <div style={{ ...tile, gridColumn: "span 12" }}>
              <div style={{ fontWeight: 950, marginBottom: 10 }}>30-second demo script</div>
              <ol style={{ margin: 0, paddingLeft: 18, color: isDark ? "#C7D2FE" : "#334155", lineHeight: 1.8 }}>
                <li>Load “Internship Scam” → Analyze.</li>
                <li>Show score + category + reasons.</li>
                <li>Switch engine: Rules → Smart (compare output).</li>
                <li>Run “Normal Message” to show Safe.</li>
                <li>Copy report and say it can be sent to IT/admin.</li>
              </ol>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ textAlign: "center", color: muted, fontSize: 13, marginTop: 8 }}>
            Scroll for the Analyzer ↓
          </div>
        </div>
      </div>
    </section>
  );
}
function Gauge({ value = 0, theme }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const isDark = theme === "dark";
  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: isDark ? "#1F2A44" : "#E2E8F0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${v}%`,
            background: isDark ? "#E5E7EB" : "#0F172A",
          }}
        />
      </div>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: isDark ? "#93A4C7" : "#64748B",
        }}
      >
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
}

function Section({ title, subtitle, right, theme, children }) {
  const isDark = theme === "dark";
  return (
    <div
      style={{
        background: isDark ? "#0B1220" : "white",
        border: `1px solid ${isDark ? "#1F2A44" : "#E2E8F0"}`,
        borderRadius: 18,
        padding: 16,
        boxShadow: isDark ? "none" : "0 1px 0 rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 950, color: isDark ? "#E5E7EB" : "#0F172A" }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ marginTop: 4, fontSize: 12.5, color: isDark ? "#93A4C7" : "#64748B" }}>
              {subtitle}
            </div>
          )}
        </div>
        {right}
      </div>
      <div style={{ marginTop: 12 }}>{children}</div>
    </div>
  );
}

function Tab({ active, onClick, children, theme }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 12px",
        borderRadius: 12,
        border: `1px solid ${active ? (isDark ? "#E5E7EB" : "#0F172A") : isDark ? "#1F2A44" : "#E2E8F0"}`,
        background: active ? (isDark ? "#E5E7EB" : "#0F172A") : isDark ? "#0B1220" : "white",
        color: active ? (isDark ? "#0B1220" : "white") : isDark ? "#E5E7EB" : "#0F172A",
        fontWeight: 900,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function btn(theme, variant = "ghost") {
  const isDark = theme === "dark";
  if (variant === "primary") {
    return {
      padding: "11px 14px",
      borderRadius: 14,
      border: `1px solid ${isDark ? "#E5E7EB" : "#0F172A"}`,
      background: isDark ? "#E5E7EB" : "#0F172A",
      color: isDark ? "#0B1220" : "white",
      fontWeight: 950,
      cursor: "pointer",
    };
  }
  return {
    padding: "11px 14px",
    borderRadius: 14,
    border: `1px solid ${isDark ? "#1F2A44" : "#E2E8F0"}`,
    background: isDark ? "#0B1220" : "white",
    color: isDark ? "#E5E7EB" : "#0F172A",
    fontWeight: 900,
    cursor: "pointer",
  };
}

function inputStyle(theme) {
  const isDark = theme === "dark";
  return {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${isDark ? "#1F2A44" : "#CBD5E1"}`,
    background: isDark ? "#0B1220" : "white",
    color: isDark ? "#E5E7EB" : "#0F172A",
    outline: "none",
  };
}

function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [theme, setTheme] = useState("light"); // light | dark
  const [mode, setMode] = useState("both"); // text | url | both
  const [engine, setEngine] = useState("smart"); // rules | smart | ai

  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const analyzerRef = useRef(null);

const stats = useMemo(() => {
  const last = history[0]?.output;
  return {
    total: history.length,
    lastScore: last?.riskScore != null ? `${last?.riskScore}/100` : null,
    lastClass: last?.classification ?? null,
  };
}, [history]);

function goToAnalyzer() {
  analyzerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}

  const [showSignals, setShowSignals] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  // Theme persistence
  useEffect(() => {
    const saved = localStorage.getItem("campusshield_theme");
    if (saved === "dark" || saved === "light") setTheme(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("campusshield_theme", theme);
  }, [theme]);

  const endpoint = useMemo(() => {
    if (engine === "rules") return "/analyze";
    if (engine === "ai") return "/analyze-ai";
    return "/analyze-smart";
  }, [engine]);

  const payload = useMemo(() => {
    if (mode === "text") return { text, url: "" };
    if (mode === "url") return { text: "", url };
    return { text, url };
  }, [mode, text, url]);

  const riskScore = result?.riskScore ?? 0;
  const classification = result?.classification || "Neutral";

  async function analyze() {
    setCopied(false);
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.message || "Request failed");

      setResult(data);
      setHistory((h) => [{ ts: Date.now(), engine, mode, input: payload, output: data }, ...h].slice(0, 10));
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setText("");
    setUrl("");
    setResult(null);
    setError("");
    setCopied(false);
    setShowSignals(false);
    setShowRaw(false);
  }

  function loadSample(s) {
    setText(s.text);
    setUrl(s.url);
    setResult(null);
    setError("");
    setCopied(false);
  }

  async function copyReport() {
    if (!result) return;
    const report = [
      "CampusShield Risk Report",
      "-----------------------",
      `Risk Score: ${result.riskScore ?? "N/A"}/100`,
      `Classification: ${result.classification ?? "N/A"}`,
      `Category: ${result.category || "N/A"}`,
      `Confidence: ${result.confidence ?? "N/A"}%`,
      `Engine: ${engine}`,
      "",
      "Recommended Action:",
      `${result.recommendedAction || "N/A"}`,
      "",
      "Why this was flagged:",
      ...(result.explanation || []).map((r) => `- ${r}`),
      "",
      "Input:",
      payload.text ? `Message: ${payload.text}` : "Message: (none)",
      payload.url ? `URL: ${payload.url}` : "URL: (none)",
    ].join("\n");

    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  const isDark = theme === "dark";

  const pageBg = isDark ? "#050A14" : "#F8FAFC";
  const headerBg = isDark ? "#070D1A" : "white";
  const border = isDark ? "#1F2A44" : "#E2E8F0";
  const txt = isDark ? "#E5E7EB" : "#0F172A";
  const muted = isDark ? "#93A4C7" : "#64748B";

  const totalAnalyses = history.length;
  const lastRisk = history[0]?.output?.riskScore ?? null;
  const lastClass = history[0]?.output?.classification ?? null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: pageBg,
        color: txt,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      }}
    >
      {/* TOP BAR */}
      <div style={{ borderBottom: `1px solid ${border}`, background: headerBg }}>
        <div
          style={{
            width: "100%",
            padding: "18px 22px",
            display: "flex",
            justifyContent: "space-between",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 30, fontWeight: 1000, letterSpacing: -0.7 }}>CampusShield</div>
            <div style={{ marginTop: 4, color: muted, fontSize: 13 }}>
              AI-powered safety assistant for campus messages & links
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                padding: 10,
                border: `1px solid ${border}`,
                borderRadius: 14,
                background: isDark ? "#050A14" : "#F8FAFC",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, color: muted }}>Engine</div>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                style={{
                  background: isDark ? "#070D1A" : "white",
                  color: txt,
                  border: `1px solid ${isDark ? "#2B3B60" : "#CBD5E1"}`,
                  borderRadius: 12,
                  padding: "8px 10px",
                  fontWeight: 900,
                }}
              >
                <option value="rules">Rules (fast)</option>
                <option value="smart">Smart (rules + AI when needed)</option>
                <option value="ai">AI only</option>
              </select>
            </div>

            <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} style={btn(theme)}>
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button onClick={resetAll} style={btn(theme)}>
              Reset
            </button>
          </div>
        </div>
      </div>
<HeroDashboard
  theme={theme}
  engine={engine}
  setEngine={setEngine}
  goToAnalyzer={goToAnalyzer}
  stats={stats}
/>

      {/* ONE-COLUMN DASHBOARD */}
      <div style={{ width: "100%", padding: "18px 22px", boxSizing: "border-box", maxWidth: 1100, margin: "0 auto" }}>
        {/* Dashboard intro */}

        <div style={{ height: 14 }} />

<div ref={analyzerRef} />
        {/* Analyze */}
        <Section
          title="Analyze"
          subtitle={`API: ${API_BASE}${endpoint}`}
          theme={theme}
          right={
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tab theme={theme} active={mode === "text"} onClick={() => setMode("text")}>
                Message
              </Tab>
              <Tab theme={theme} active={mode === "url"} onClick={() => setMode("url")}>
                URL
              </Tab>
              <Tab theme={theme} active={mode === "both"} onClick={() => setMode("both")}>
                Both
              </Tab>
            </div>
          }
        >
          {mode !== "url" && (
            <div>
              <div style={{ fontWeight: 950, fontSize: 13, marginBottom: 6, color: txt }}>Message</div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={7}
                placeholder="Paste email / WhatsApp / Telegram / announcement text…"
                style={{ ...inputStyle(theme), resize: "vertical" }}
              />
            </div>
          )}

          {mode !== "text" && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 950, fontSize: 13, marginBottom: 6, color: txt }}>URL</div>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="example.com / https://…" style={inputStyle(theme)} />
            </div>
          )}

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={analyze} disabled={loading} style={btn(theme, "primary")}>
              {loading ? "Analyzing…" : "Analyze"}
            </button>

            <button onClick={() => loadSample(SAMPLES[0])} style={btn(theme)}>
              Load Sample
            </button>

            {result && (
              <>
                <button onClick={copyReport} style={btn(theme)}>
                  {copied ? "Copied ✅" : "Copy report"}
                </button>

                <button onClick={() => downloadJson("campusshield_result.json", result)} style={btn(theme)}>
                  Download JSON
                </button>
              </>
            )}
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SAMPLES.map((s) => (
              <button
                key={s.tag}
                onClick={() => loadSample(s)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: `1px solid ${border}`,
                  background: isDark ? "#070D1A" : "white",
                  fontWeight: 950,
                  cursor: "pointer",
                  color: txt,
                }}
              >
                {s.tag}
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 14,
                background: isDark ? "#2A0A0A" : "#FEF2F2",
                border: `1px solid ${isDark ? "#7F1D1D" : "#FECACA"}`,
                color: isDark ? "#FCA5A5" : "#991B1B",
              }}
            >
              <b>Error:</b> {error}
            </div>
          )}
        </Section>

        <div style={{ height: 14 }} />

        {/* Result */}
        <Section title="Result" subtitle={result ? "Score + classification + reasons" : "Run Analyze to see results"} theme={theme}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ fontSize: 34, fontWeight: 1000 }}>{result ? `${riskScore}/100` : "—"}</div>
            <div style={pill(result ? classification : "Neutral", theme)}>{result ? classification : "No result yet"}</div>
            <div style={pill("Neutral", theme)}>Category: {result?.category || "—"}</div>
            <div style={pill("Neutral", theme)}>Confidence: {result?.confidence ?? "—"}%</div>
          </div>

          <Gauge value={result ? riskScore : 0} theme={theme} />

          <div style={{ marginTop: 10 }}>
            <b>Recommended action:</b>{" "}
            <span style={{ color: isDark ? "#C7D2FE" : "#334155" }}>
              {result?.recommendedAction || "Run an analysis to see recommended next steps."}
            </span>
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => setShowSignals((s) => !s)} disabled={!result} style={{ ...btn(theme), opacity: result ? 1 : 0.6 }}>
              {showSignals ? "Hide signals" : "Show signals"}
            </button>

            <button onClick={() => setShowRaw((s) => !s)} disabled={!result} style={{ ...btn(theme), opacity: result ? 1 : 0.6 }}>
              {showRaw ? "Hide raw JSON" : "Show raw JSON"}
            </button>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 1000, marginBottom: 8 }}>Why it was flagged</div>
            {result?.explanation?.length ? (
              <ul style={{ margin: 0, paddingLeft: 18, color: isDark ? "#C7D2FE" : "#334155", lineHeight: 1.6 }}>
                {result.explanation.map((r, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    {r}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ color: muted }}>No explanation yet.</div>
            )}
          </div>

          {showSignals && (
            <div
              style={{
                marginTop: 12,
                background: isDark ? "#070D1A" : "#F8FAFC",
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 1000, marginBottom: 6 }}>Signals (debug)</div>
              <pre style={{ margin: 0, fontSize: 12, color: isDark ? "#C7D2FE" : "#334155", overflowX: "auto" }}>
                {JSON.stringify(result?.signals || {}, null, 2)}
              </pre>
            </div>
          )}

          {showRaw && (
            <div
              style={{
                marginTop: 12,
                background: isDark ? "#070D1A" : "#F8FAFC",
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 1000, marginBottom: 6 }}>Raw response</div>
              <pre style={{ margin: 0, fontSize: 12, color: isDark ? "#C7D2FE" : "#334155", overflowX: "auto" }}>
                {JSON.stringify(result || {}, null, 2)}
              </pre>
            </div>
          )}
        </Section>

        <div style={{ height: 14 }} />

        {/* History (stacked at bottom) */}
        <Section title="History" subtitle={`Last ${history.length} analyses (click to restore)`} theme={theme}>
          {history.length === 0 ? (
            <div style={{ color: muted }}>No history yet. Run a sample to populate this.</div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {history.map((h) => (
                <button
                  key={h.ts}
                  onClick={() => {
                    setText(h.input.text || "");
                    setUrl(h.input.url || "");
                    setResult(h.output);
                    setError("");
                    setEngine(h.engine);
                    setMode(h.mode);
                  }}
                  style={{
                    textAlign: "left",
                    padding: 12,
                    borderRadius: 14,
                    border: `1px solid ${border}`,
                    background: isDark ? "#070D1A" : "white",
                    cursor: "pointer",
                    color: txt,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 1000 }}>{h.output?.riskScore ?? "—"}/100</div>
                    <div style={pill(h.output?.classification || "Neutral", theme)}>{h.output?.classification || "Neutral"}</div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: muted }}>
                    {new Date(h.ts).toLocaleTimeString()} • {h.engine} • {h.mode}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 12, color: isDark ? "#C7D2FE" : "#334155", lineHeight: 1.4 }}>
                    Msg: {short(h.input.text, 72)}
                    <br />
                    URL: {short(h.input.url, 72)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </Section>

        <div style={{ height: 30 }} />
      </div>
    </div>
  );
}
