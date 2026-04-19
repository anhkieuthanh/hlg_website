import { notFound } from "next/navigation";
import { getLocale, localized, t } from "../../../../lib/content";
import { PartnerCta } from "../../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../../components/MotionPrimitives";
import { SiteImage } from "../../../../components/SiteImage";
import { getProject } from "../../../../lib/public-api";
import { localizedMetadata } from "../../../../lib/seo";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const project = await getProject(locale, params.slug);
  if (!project) {
    return localizedMetadata({
      locale,
      path: `/projects/${params.slug}`,
      title: t(locale, "projectsTitle"),
      description: t(locale, "projectsCopy")
    });
  }
  return localizedMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: localized(locale, project.title),
    description: localized(locale, project.excerpt),
    image: project.heroImage || "/assets/industrial-hero-1440.webp"
  });
}

export default async function ProjectDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const project = await getProject(locale, params.slug);
  if (!project) notFound();
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{localized(locale, project.sector)}</p>
          <h1>{localized(locale, project.title)}</h1>
          <p>{localized(locale, project.excerpt)}</p>
        </Reveal>
      </section>
      <Stagger className="container detail-body">
        <article>
          <SiteImage className="card-media" src={project.heroImage} alt={localized(locale, project.title)} sizes="(max-width: 900px) 100vw, 760px" />
          <p>{localized(locale, project.body)}</p>
          <p>{localized(locale, project.result)}</p>
          <div className="insight-panel">
            <h2>{locale === "vi" ? "Điểm đáng chú ý cho đối tác" : "Partner review notes"}</h2>
            <p>
              {locale === "vi"
                ? "Case study này nên được dùng để đánh giá cách Hoàng Long nhận vai trò, phối hợp tiến độ và kiểm soát chất lượng trong phạm vi được giao."
                : "Use this case study to evaluate how Hoang Long takes scope ownership, coordinates schedule, and controls quality within assigned work."}
            </p>
          </div>
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
      </Stagger>
      <PartnerCta locale={locale} />
    </main>
  );
}
