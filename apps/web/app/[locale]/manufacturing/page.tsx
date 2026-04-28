import { getLocale, localized } from "../../../lib/content";
import { ControlFlow, PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { getCapabilities } from "../../../lib/public-api";

export default async function ManufacturingPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const capabilities = await getCapabilities(locale);
  const items = capabilities.filter((item) => item.type !== "certificate");
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{locale === "vi" ? "Sản xuất" : "Manufacturing"}</p>
          <h1>{locale === "vi" ? "Năng lực nhà máy và thiết bị cho kết cấu công nghiệp" : "Factory and equipment capabilities for industrial structures"}</h1>
          <p>
            {locale === "vi"
              ? "Trang này giúp đối tác đánh giá nhanh khả năng tiếp nhận bản vẽ, tổ chức lô gia công, kiểm soát chất lượng và phối hợp bàn giao."
              : "This page helps partners assess drawing intake, batch fabrication, quality control, and handover coordination."}
          </p>
        </Reveal>
      </section>
      <section className="section">
        <div className="container">
          <Reveal className="section-heading">
            <h2>{locale === "vi" ? "Bằng chứng nhà máy trước, lời giới thiệu sau" : "Factory proof first, introduction second"}</h2>
            <p>
              {locale === "vi"
                ? "Mỗi khối năng lực nên được thay bằng ảnh xưởng, máy móc, hồ sơ QC hoặc thông số thật khi có dữ liệu chính thức."
                : "Each capability block should later be replaced with real factory photos, equipment records, QC documents, or verified specs."}
            </p>
          </Reveal>
          <Stagger className="grid">
            {items.map((item) => (
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
            <article className="card proof-card">
              <div className="card-body">
                <div className="meta">
                  <span>{locale === "vi" ? "phối hợp" : "coordination"}</span>
                </div>
                <h3>{locale === "vi" ? "Khả năng nhận phối hợp theo hạng mục" : "Work-package cooperation readiness"}</h3>
                <p>
                  {locale === "vi"
                    ? "Luồng làm việc tập trung vào hồ sơ đầu vào, mốc kiểm soát, tiến độ gia công và đầu mối bàn giao để đối tác dễ ghép vào kế hoạch dự án."
                    : "The workflow focuses on input records, control milestones, fabrication timing, and handover contacts so partners can fit it into project plans."}
                </p>
              </div>
            </article>
          </Stagger>
        </div>
      </section>
      <ControlFlow locale={locale} />
      <PartnerCta locale={locale} />
    </main>
  );
}
