import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#f0ede8",
        fontFamily: "'Syne', sans-serif",
        gap: 24,
        textAlign: "center",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          color: "#1f1f1f",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        404
      </div>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Link not found
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "#5a5650",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          This short link doesn't exist or has been removed.
        </p>
      </div>
      <Link
        href="/"
        style={{
          background: "#e8ff47",
          color: "#0a0a0a",
          padding: "14px 28px",
          borderRadius: 2,
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.1em",
        }}
      >
        CREATE A SHORT LINK →
      </Link>
    </main>
  );
}
