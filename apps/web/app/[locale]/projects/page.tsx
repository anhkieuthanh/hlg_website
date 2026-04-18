import { ProjectCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { contentFor, getLocale, t } from "../../../lib/content";

export default function ProjectsPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{t(locale, "projectsTitle")}</p>
          <h1>{t(locale, "projectsCopy")}</h1>
          <p>
            {locale === "vi"
              ? "Ưu tiên đọc theo vai trò, quy mô và kết quả để hiểu Hoàng Long có thể phối hợp ở điểm nào trong dự án."
              : "Review role, scale, and outcomes first to understand where Hoang Long can support a project."}
          </p>
        </Reveal>
      </section>
      <section className="section">
        <Stagger className="container grid two">
          {content.projects.map((project) => (
            <ProjectCard key={project.id} locale={locale} project={project} />
          ))}
        </Stagger>
      </section>
      <PartnerCta locale={locale} />
    </main>
  );
}
