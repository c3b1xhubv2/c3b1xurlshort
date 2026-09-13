"use client";

import useSWR from "swr";
import type { LinkResult } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function shortDest(url: string) {
  const clean = url.replace(/^https?:\/\//, "");
  return clean.length > 50 ? `${clean.slice(0, 48)}…` : clean;
}

export function RecentLinks() {
  const { data, isLoading } = useSWR<{ links: LinkResult[] }>(
    "/api/links",
    fetcher
  );

  const links = data?.links ?? [];
  const maxClicks = Math.max(1, ...links.map((l) => l.clicks));

  return (
    <section className="links" aria-labelledby="recent-heading">
      <div className="links-head">
        <h2 id="recent-heading">
          <span>//</span> RECENT LINKS
        </h2>
        <span>{links.length} TOTAL</span>
      </div>

      {isLoading ? (
        <div className="empty">LOADING…</div>
      ) : links.length === 0 ? (
        <div className="empty">No links yet. Create one above.</div>
      ) : (
        <div className="table" role="table">
          <div className="row row-head" role="row">
            <span role="columnheader">SHORT LINK</span>
            <span role="columnheader" className="dest">
              DESTINATION
            </span>
            <span role="columnheader" className="clicks">
              CLICKS
            </span>
          </div>
          {links.map((link) => (
            <div key={link.slug} className="row" role="row">
              <span role="cell">
                <a
                  href={`/${link.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="slug"
                >
                  /{link.slug}
                </a>
              </span>
              <span role="cell" className="dest" title={link.url}>
                {shortDest(link.url)}
              </span>
              <span role="cell" className="clicks">
                {link.clicks}
                <span className="bar" aria-hidden>
                  <i
                    style={{
                      width: `${Math.max(2, (link.clicks / maxClicks) * 100)}%`,
                    }}
                  />
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
