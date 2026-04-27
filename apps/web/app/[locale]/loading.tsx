export default function Loading() {
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <div className="loading-skeleton" style={{ width: "120px", height: "16px" }} />
          <div className="loading-skeleton" style={{ width: "60%", height: "48px", marginTop: "16px" }} />
          <div className="loading-skeleton" style={{ width: "80%", height: "20px", marginTop: "12px" }} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="grid" style={{ gap: "18px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="loading-skeleton" style={{ height: "280px", borderRadius: "8px" }} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
