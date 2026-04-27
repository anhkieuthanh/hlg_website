import type { Metadata } from "next";
import { ProjectCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { getLocale } from "../../../lib/content";
import { getProjects } from "../../../lib/public-api";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = getLocale(params.locale);
  return {
    title: locale === "vi" ? "Xay dung" : "Construction",
    description:
      locale === "vi"
        ? "Thi cong cong nghiep co kiem soat tien do va chat luong."
        : "Industrial construction with schedule and quality control."
  };
}

export default async function ConstructionPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const projects = await getProjects(locale);
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
