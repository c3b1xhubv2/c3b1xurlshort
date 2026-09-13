import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="header">
      <Link href="/" className="brand" aria-label="SHORT/LINK home">
        <span className="brand-mark" aria-hidden>
          /
        </span>
        <span className="brand-name">SHORT/LINK</span>
      </Link>

      <div className="status">
        <span className="status-dot" aria-hidden />
        <b>LIVE</b>
        <span className="status-text">/ URL SHORTENER</span>
      </div>
    </header>
  );
}
