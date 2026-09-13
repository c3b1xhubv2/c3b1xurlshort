"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { useSWRConfig } from "swr";
import type { LinkResult } from "@/lib/types";

const noopSubscribe = () => () => {};

export function ShortenForm() {
  const { mutate } = useSWRConfig();
  const host = useSyncExternalStore(
    noopSubscribe,
    () => window.location.host,
    () => ""
  );

  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
      mutate("/api/links");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="panel" aria-labelledby="shorten-heading">
      <span className="panel-corners" aria-hidden />
      <h2 id="shorten-heading" className="sr-only">
        Shorten a URL
      </h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label htmlFor="long-url" className="label">
            <span className="idx">01</span>
            LONG URL
          </label>
          <div className="control">
            <span className="prefix prefix-arrow" aria-hidden />
            <input
              id="long-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-very-long-url.com/with/many/segments"
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="custom-slug" className="label">
            <span className="idx">02</span>
            CUSTOM SLUG
            <span className="opt">(OPTIONAL)</span>
          </label>
          <div className="control">
            <span className="prefix" aria-hidden>
              {host && <span className="prefix-host">{host}</span>}/
            </span>
            <input
              id="custom-slug"
              type="text"
              value={customSlug}
              onChange={(e) =>
                setCustomSlug(
                  e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
                )
              }
              placeholder="my-link"
              maxLength={20}
              autoComplete="off"
            />
          </div>
          <span className="hint">a-z · 0-9 · dash · max 20 chars</span>
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" aria-hidden />
              SHORTENING…
            </>
          ) : (
            "SHORTEN LINK →"
          )}
        </button>
      </form>

      {error && (
        <div className="alert" role="alert">
          <span className="alert-icon" aria-hidden>
            !
          </span>
          {error}
        </div>
      )}

      {result && (
        <div className="result" role="status">
          <div className="result-head">
            <b>LINK CREATED</b>
            <span>{result.clicks} CLICKS</span>
          </div>
          <div className="result-body">
            <span className="result-url">
              {result.shortUrl.replace(/\/[^/]*$/, "/")}
              <span>{result.slug}</span>
            </span>
            <button
              type="button"
              className="copy"
              data-copied={copied}
              onClick={() => copy(result.shortUrl)}
            >
              {copied ? "COPIED ✓" : "COPY"}
            </button>
          </div>
          <div className="result-orig">
            ORIGINAL → {result.url}
          </div>
        </div>
      )}
    </section>
  );
}
