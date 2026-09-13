import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf-code" aria-hidden>
        4<span>0</span>4
      </div>
      <div>
        <p className="nf-label">{"// LINK NOT FOUND"}</p>
        <h1>This short link doesn&apos;t exist or has been removed.</h1>
      </div>
      <Link href="/" className="btn">
        CREATE A SHORT LINK →
      </Link>
    </main>
  );
}
