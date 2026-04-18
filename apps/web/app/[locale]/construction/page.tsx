import { ProjectCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { contentFor, getLocale } from "../../../lib/content";

export default function ConstructionPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const projects = contentFor(locale).projects;
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{locale === "vi" ? "Xây dựng" : "Construction"}</p>
          <h1>{locale === "vi" ? "Thi công công nghiệp có kiểm soát tiến độ và chất lượng" : "Industrial construction with schedule and quality control"}</h1>
          <p>
            {locale === "vi"
              ? "Mảng xây dựng được đặt trong luồng phối hợp tổng thể: sản xuất, bàn giao cấu kiện, công trường và hồ sơ nghiệm thu."
              : "Construction is framed as part of the overall coordination flow: fabrication, component handover, site execution, and acceptance records."}
          </p>
        </Reveal>
      </section>
      <section className="section">
        <Stagger className="container grid two">
          {projects.map((project) => (
            <ProjectCard key={project.id} locale={locale} project={project} />
          ))}
        </Stagger>
      </section>
      <PartnerCta locale={locale} />
    </main>
  );
}
