"use client";
import { useState } from "react";

const SUGGESTIONS = [
  "iPhone 17 Pro", "Samsung Galaxy S25", "MacBook Pro M4",
  "Sony WH-1000XM6", "PlayStation 6", "Apple Watch Ultra 3",
];

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z"/>
    </svg>
  );
}

function ResultIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

export default function Home() {
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  async function search(query) {
    const term = query ?? product;
    if (!term.trim()) return;
    if (query) setProduct(query);
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: term }),
      });
      const data = await res.json();
      setResult(data.result || data.error || "No result returned.");
    } catch {
      setResult("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") search();
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* ── Header ── */}
        <header className="header">
          <div className="badge">
            <span className="badge-dot" />
            AI-Powered
          </div>
          <h1 className="title">
            <span className="title-gradient">Product Search</span>
            <br />Made Intelligent
          </h1>
          <p className="subtitle">
            Ask about any product and get detailed insights, specs, pricing, and recommendations — instantly.
          </p>
        </header>

        {/* ── Search Card ── */}
        <section className="search-card">
          <div className="search-label">
            <SparkleIcon />
            What are you looking for?
          </div>

          <div className="input-wrapper">
            <input
              id="product-search-input"
              className="search-input"
              type="text"
              placeholder="e.g. iPhone 17 Pro, Sony WH-1000XM6…"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Product search"
              autoComplete="off"
            />
            <span className="input-icon"><SearchIcon /></span>
          </div>

          <button
            id="search-btn"
            className="search-btn"
            onClick={() => search()}
            disabled={loading || !product.trim()}
            aria-label="Search product"
          >
            {loading ? (
              <>
                <span className="spinner" />
                Searching…
              </>
            ) : (
              <>
                <SearchIcon />
                Search Product
              </>
            )}
          </button>

          {/* ── Suggestions ── */}
          <div className="suggestions">
            <span className="suggestions-label">Popular searches:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                className="suggestion-chip"
                onClick={() => search(s)}
                disabled={loading}
                aria-label={`Search for ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* ── Results ── */}
        {(result || loading) && (
          <section className="result-card" aria-live="polite">
            <div className="result-header">
              <div className="result-title">
                {loading ? (
                  <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#8b5cf6' }} />Generating…</>
                ) : (
                  <><ResultIcon />AI Response</>
                )}
              </div>
              {result && !loading && (
                <button
                  id="copy-btn"
                  className={`copy-btn${copied ? " copied" : ""}`}
                  onClick={copyResult}
                  aria-label="Copy result"
                >
                  <CopyIcon />
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <div className="result-body">
              {loading ? (
                <div className="empty-state">
                  <p className="empty-desc">Fetching insights for <strong style={{ color: '#a78bfa' }}>{product}</strong>…</p>
                </div>
              ) : (
                <pre className="result-text">{result}</pre>
              )}
            </div>
          </section>
        )}

        {/* ── Empty state (no search yet) ── */}
        {!result && !loading && (
          <section className="result-card">
            <div className="empty-state">
              <div className="empty-icon"><BoxIcon /></div>
              <p className="empty-title">No search yet</p>
              <p className="empty-desc">Enter a product name above and hit Search to get AI-powered insights.</p>
            </div>
          </section>
        )}

        {/* ── Footer ── */}
        <footer className="footer">
          Built with Next.js &amp; AI ·{" "}
          <a href="#" aria-label="Learn more">Learn more</a>
        </footer>
      </div>
    </div>
  );
}
