import { contentFor, getLocale, localized } from "../../../lib/content";

export default function ManufacturingPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const items = contentFor(locale).capabilities.filter((item) => item.type !== "certificate");
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{locale === "vi" ? "Sản xuất" : "Manufacturing"}</p>
          <h1>{locale === "vi" ? "Năng lực nhà máy và thiết bị" : "Factory and equipment capabilities"}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container grid">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <img className="card-media" src={item.image} alt={localized(locale, item.title)} />
              <div className="card-body">
                <h3>{localized(locale, item.title)}</h3>
                <p>{localized(locale, item.description)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
