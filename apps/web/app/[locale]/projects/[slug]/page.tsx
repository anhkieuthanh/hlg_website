import { notFound } from "next/navigation";
import { contentFor, getLocale, localized, t } from "../../../../lib/content";

export function generateStaticParams() {
  return contentFor("vi").projects.flatMap((project) => [
    { locale: "vi", slug: project.slug },
    ...(project.enPublished ? [{ locale: "en", slug: project.slug }] : [])
  ]);
}

export default function ProjectDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const project = contentFor(locale).projects.find((item) => item.slug === params.slug);
  if (!project) notFound();
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{localized(locale, project.sector)}</p>
          <h1>{localized(locale, project.title)}</h1>
          <p>{localized(locale, project.excerpt)}</p>
        </div>
      </section>
      <section className="container detail-body">
        <article>
          <img className="card-media" src={project.heroImage} alt={localized(locale, project.title)} />
          <p>{localized(locale, project.body)}</p>
          <p>{localized(locale, project.result)}</p>
        </article>
        <aside className="facts">
          <div className="fact">
            <span>{t(locale, "location")}</span>
            <strong>{localized(locale, project.location)}</strong>
          </div>
          <div className="fact">
            <span>{t(locale, "year")}</span>
            <strong>{project.year}</strong>
          </div>
          <div className="fact">
            <span>{t(locale, "scale")}</span>
            <strong>{localized(locale, project.scale)}</strong>
          </div>
          <div className="fact">
            <span>{t(locale, "role")}</span>
            <strong>{localized(locale, project.role)}</strong>
          </div>
          <div className="fact">
            <span>{t(locale, "result")}</span>
            <strong>{localized(locale, project.result)}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}
