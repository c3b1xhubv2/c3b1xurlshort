"use client";

import { useState, useEffect } from "react";

interface LinkResult {
  slug: string;
  url: string;
  shortUrl: string;
  clicks: number;
  createdAt: number;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [links, setLinks] = useState<LinkResult[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    try {
      const res = await fetch("/api/links");
      const data = await res.json();
      setLinks(data.links || []);
    } catch {
      // ignore
    } finally {
      setLoadingLinks(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, customSlug: customSlug || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data);
      setUrl("");
      setCustomSlug("");
      fetchLinks();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <main style={styles.main}>
      {/* Background grid */}
      <div style={styles.grid} aria-hidden />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoDot} />
          <span style={styles.logoText}>SHORT/LINK</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.badge}>LIVE</span>
          <span style={styles.headerMeta}>URL Shortener</span>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroLabel}>
          <span style={styles.heroLabelLine} />
          SHORTEN YOUR URLs
          <span style={styles.heroLabelLine} />
        </div>
        <h1 style={styles.heroTitle}>
          Make links
          <br />
          <span style={styles.heroAccent}>shorter.</span>
        </h1>
        <p style={styles.heroSub}>
          Paste your long URL and get a clean, shareable short link instantly.
        </p>
      </section>

      {/* Form */}
      <section style={styles.formSection}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>LONG URL</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputPrefix}>→</span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-very-long-url.com/with/many/segments"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              CUSTOM SLUG <span style={styles.optional}>(OPTIONAL)</span>
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputPrefix2}>{baseUrl}/</span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="my-link"
                style={{ ...styles.input, paddingLeft: "8px" }}
                maxLength={20}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.btn,
              ...(loading ? styles.btnDisabled : {}),
            }}
          >
            {loading ? (
              <span style={styles.btnLoading}>
                <span style={styles.spinner} />
                SHORTENING...
              </span>
            ) : (
              "SHORTEN LINK →"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={styles.error}>
            <span style={styles.errorIcon}>!</span>
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={styles.result}>
            <div style={styles.resultHeader}>
              <span style={styles.resultIcon}>✓</span>
              <span style={styles.resultLabel}>LINK CREATED</span>
            </div>
            <div style={styles.resultUrl}>
              <span style={styles.resultShortUrl}>{result.shortUrl}</span>
              <button
                onClick={() => copyToClipboard(result.shortUrl)}
                style={styles.copyBtn}
              >
                {copied ? "COPIED!" : "COPY"}
              </button>
            </div>
            <div style={styles.resultMeta}>
              <span style={styles.resultMetaItem}>
                ORIGINAL: <span style={styles.resultMetaValue}>{result.url.slice(0, 50)}{result.url.length > 50 ? "…" : ""}</span>
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Recent Links */}
      <section style={styles.linksSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>RECENT LINKS</h2>
          <span style={styles.sectionCount}>{links.length} TOTAL</span>
        </div>

        {loadingLinks ? (
          <div style={styles.tableEmpty}>Loading...</div>
        ) : links.length === 0 ? (
          <div style={styles.tableEmpty}>No links yet. Create one above!</div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHead}>
              <span style={{ flex: 1 }}>SHORT LINK</span>
              <span style={{ flex: 2 }}>DESTINATION</span>
              <span style={{ width: 80, textAlign: "right" as const }}>CLICKS</span>
            </div>
            {links.map((link) => (
              <div key={link.slug} style={styles.tableRow}>
                <span style={{ flex: 1 }}>
                  <a
                    href={`/${link.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.linkAnchor}
                  >
                    /{link.slug}
                  </a>
                </span>
                <span style={{ flex: 2, ...styles.linkDest }}>
                  {link.url.replace(/^https?:\/\//, "").slice(0, 45)}
                  {link.url.length > 50 ? "…" : ""}
                </span>
                <span style={{ width: 80, textAlign: "right" as const, ...styles.linkClicks }}>
                  {link.clicks}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span>Built with Next.js + Vercel KV</span>
        <span style={styles.footerDot}>·</span>
        <span>Deploy your own instance</span>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f0ede8",
    fontFamily: "'Syne', sans-serif",
    padding: "0 24px 80px",
    maxWidth: 760,
    margin: "0 auto",
    position: "relative",
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "32px 0 48px",
    borderBottom: "1px solid #1f1f1f",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#e8ff47",
    boxShadow: "0 0 8px #e8ff47",
    display: "inline-block",
    animation: "pulse-dot 2s ease-in-out infinite",
  },
  logoText: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.15em",
    color: "#f0ede8",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.2em",
    color: "#0a0a0a",
    background: "#e8ff47",
    padding: "3px 8px",
    borderRadius: 2,
  },
  headerMeta: {
    fontSize: 12,
    color: "#5a5650",
    letterSpacing: "0.1em",
    fontFamily: "'DM Mono', monospace",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    padding: "72px 0 56px",
  },
  heroLabel: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 11,
    letterSpacing: "0.25em",
    color: "#5a5650",
    marginBottom: 28,
    fontFamily: "'DM Mono', monospace",
  },
  heroLabelLine: {
    flex: 1,
    height: 1,
    background: "#1f1f1f",
    display: "inline-block",
  },
  heroTitle: {
    fontSize: "clamp(52px, 8vw, 88px)",
    fontWeight: 800,
    lineHeight: 1.0,
    letterSpacing: "-0.03em",
    marginBottom: 20,
    color: "#f0ede8",
  },
  heroAccent: {
    color: "#e8ff47",
    fontStyle: "italic",
  },
  heroSub: {
    fontSize: 16,
    color: "#6a6660",
    lineHeight: 1.6,
    maxWidth: 400,
    fontWeight: 400,
  },
  formSection: {
    position: "relative",
    zIndex: 1,
    background: "#111",
    border: "1px solid #222",
    borderRadius: 2,
    padding: "40px",
    marginBottom: 48,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "#5a5650",
    fontFamily: "'DM Mono', monospace",
    fontWeight: 500,
  },
  optional: {
    color: "#3a3a38",
    marginLeft: 6,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: 2,
    transition: "border-color 0.2s",
  },
  inputPrefix: {
    color: "#e8ff47",
    padding: "0 14px",
    fontSize: 16,
    fontFamily: "'DM Mono', monospace",
    userSelect: "none",
    borderRight: "1px solid #1f1f1f",
    height: "52px",
    display: "flex",
    alignItems: "center",
  },
  inputPrefix2: {
    color: "#4a4a48",
    padding: "0 8px 0 14px",
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
    whiteSpace: "nowrap",
    userSelect: "none",
    borderRight: "1px solid #1f1f1f",
    height: "52px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#f0ede8",
    fontSize: 14,
    padding: "0 16px",
    height: "52px",
    fontFamily: "'DM Mono', monospace",
  },
  btn: {
    background: "#e8ff47",
    color: "#0a0a0a",
    border: "none",
    borderRadius: 2,
    padding: "18px 32px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.12em",
    cursor: "pointer",
    fontFamily: "'Syne', sans-serif",
    transition: "background 0.2s, transform 0.1s",
    alignSelf: "flex-start",
  },
  btnDisabled: {
    background: "#2a2a1a",
    color: "#6a6a50",
    cursor: "not-allowed",
  },
  btnLoading: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  spinner: {
    width: 12,
    height: 12,
    border: "2px solid #6a6a50",
    borderTopColor: "#e8ff47",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.6s linear infinite",
  },
  error: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 20px",
    background: "rgba(255,69,69,0.08)",
    border: "1px solid rgba(255,69,69,0.2)",
    borderRadius: 2,
    color: "#ff6666",
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
  },
  errorIcon: {
    background: "#ff4545",
    color: "#fff",
    width: 18,
    height: 18,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  result: {
    marginTop: 20,
    padding: "20px",
    background: "rgba(232,255,71,0.05)",
    border: "1px solid rgba(232,255,71,0.2)",
    borderRadius: 2,
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  resultIcon: {
    background: "#e8ff47",
    color: "#0a0a0a",
    width: 18,
    height: 18,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 800,
  },
  resultLabel: {
    fontSize: 11,
    letterSpacing: "0.2em",
    color: "#e8ff47",
    fontFamily: "'DM Mono', monospace",
  },
  resultUrl: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "#0a0a0a",
    border: "1px solid #2a2a2a",
    borderRadius: 2,
    padding: "14px 16px",
    marginBottom: 12,
  },
  resultShortUrl: {
    fontSize: 16,
    fontWeight: 600,
    color: "#e8ff47",
    fontFamily: "'DM Mono', monospace",
    wordBreak: "break-all",
  },
  copyBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#8a8680",
    padding: "6px 14px",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 10,
    letterSpacing: "0.15em",
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    flexShrink: 0,
    transition: "all 0.2s",
  },
  resultMeta: {
    fontSize: 12,
    color: "#5a5650",
    fontFamily: "'DM Mono', monospace",
  },
  resultMetaItem: {
    letterSpacing: "0.05em",
  },
  resultMetaValue: {
    color: "#8a8680",
  },
  linksSection: {
    position: "relative",
    zIndex: 1,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    letterSpacing: "0.2em",
    color: "#5a5650",
    fontWeight: 600,
    fontFamily: "'DM Mono', monospace",
  },
  sectionCount: {
    fontSize: 11,
    letterSpacing: "0.15em",
    color: "#3a3a38",
    fontFamily: "'DM Mono', monospace",
  },
  table: {
    border: "1px solid #1f1f1f",
    borderRadius: 2,
    overflow: "hidden",
  },
  tableHead: {
    display: "flex",
    gap: 16,
    padding: "12px 20px",
    background: "#111",
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#4a4a48",
    fontFamily: "'DM Mono', monospace",
    borderBottom: "1px solid #1f1f1f",
  },
  tableRow: {
    display: "flex",
    gap: 16,
    padding: "16px 20px",
    borderBottom: "1px solid #141414",
    alignItems: "center",
    transition: "background 0.15s",
  },
  tableEmpty: {
    padding: "40px 20px",
    textAlign: "center",
    color: "#3a3a38",
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
    border: "1px solid #1f1f1f",
    borderRadius: 2,
  },
  linkAnchor: {
    color: "#e8ff47",
    textDecoration: "none",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    fontWeight: 500,
  },
  linkDest: {
    color: "#5a5650",
    fontFamily: "'DM Mono', monospace",
    fontSize: 12,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  linkClicks: {
    color: "#8a8680",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
  },
  footer: {
    position: "relative",
    zIndex: 1,
    marginTop: 80,
    paddingTop: 24,
    borderTop: "1px solid #1a1a1a",
    fontSize: 12,
    color: "#3a3a38",
    fontFamily: "'DM Mono', monospace",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  footerDot: {
    color: "#2a2a2a",
  },
};
