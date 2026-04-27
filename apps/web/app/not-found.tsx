import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="detail-hero" style={{ textAlign: "center", padding: "120px 0 80px" }}>
        <div className="container">
          <p className="eyebrow">404</p>
          <h1 style={{ fontSize: "clamp(38px, 6vw, 64px)" }}>Page not found</h1>
          <p style={{ color: "var(--steel)", fontSize: "18px", maxWidth: "520px", margin: "0 auto 32px" }}>
            The page you are looking for does not exist or has been moved.
          </p>
          <Link className="button" href="/vi">
            Go to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
