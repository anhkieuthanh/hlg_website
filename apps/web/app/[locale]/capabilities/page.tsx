import { contentFor, getLocale, localized, t } from "../../../lib/content";

export default function CapabilitiesPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{locale === "vi" ? "Năng lực" : "Capabilities"}</p>
          <h1>{t(locale, "capabilitiesTitle")}</h1>
        </div>
      </section>
      <section className="section alt">
        <div className="container grid">
          {content.capabilities.map((item) => (
            <article className="card" key={item.id}>
              <img className="card-media" src={item.image} alt={localized(locale, item.title)} />
              <div className="card-body">
                <div className="meta">
                  <span>{item.type}</span>
                </div>
                <h3>{localized(locale, item.title)}</h3>
                <p>{localized(locale, item.description)}</p>
                {item.metric ? <strong>{localized(locale, item.metric)}</strong> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
