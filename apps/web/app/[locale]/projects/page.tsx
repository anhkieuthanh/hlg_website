import { ProjectCard } from "../../../components/Cards";
import { contentFor, getLocale, t } from "../../../lib/content";

export default function ProjectsPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{t(locale, "projectsTitle")}</p>
          <h1>{t(locale, "projectsCopy")}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          {content.projects.map((project) => (
            <ProjectCard key={project.id} locale={locale} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
