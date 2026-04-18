import { ProjectCard } from "../../../components/Cards";
import { contentFor, getLocale } from "../../../lib/content";

export default function ConstructionPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const projects = contentFor(locale).projects;
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{locale === "vi" ? "Xây dựng" : "Construction"}</p>
          <h1>{locale === "vi" ? "Thi công công nghiệp có kiểm soát tiến độ và chất lượng" : "Industrial construction with schedule and quality control"}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container grid two">
          {projects.map((project) => (
            <ProjectCard key={project.id} locale={locale} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}
