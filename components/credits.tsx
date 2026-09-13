import Image from "next/image";

export function Credits() {
  return (
    <footer className="credits">
      <div className="credits-frame">
        <Image
          src="/brand/c3b1xhub-banner.gif"
          alt="C3B1XHUB banner"
          width={600}
          height={200}
          unoptimized
          className="credits-banner"
        />
      </div>

      <div className="credits-row">
        <div className="credits-dev">
          <Image
            src="/brand/c3b1xhub-logo.png"
            alt="C3B1XHUB logo"
            width={44}
            height={44}
            className="credits-logo"
          />
          <div>
            <div className="credits-label">DEVELOPMENT BY</div>
            <div className="credits-name">
              C3B1X<span>HUB</span>
            </div>
          </div>
        </div>

        <div className="credits-meta">
          <span>Built with Next.js + Vercel KV</span>
          <span aria-hidden>·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
