import { getLocale } from "../../../lib/content";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { localizedMetadata } from "../../../lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return localizedMetadata({
    locale,
    path: "/about",
    title: locale === "vi" ? "Giới thiệu Hoàng Long Group" : "About Hoang Long Group",
    description:
      locale === "vi"
        ? "Hồ sơ năng lực B2B của Hoàng Long Group cho sản xuất kết cấu, thi công và quản lý dự án công nghiệp."
        : "Hoang Long Group B2B capability profile for structural fabrication, construction, and industrial project coordination."
  });
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{locale === "vi" ? "Giới thiệu" : "About"}</p>
          <h1>{locale === "vi" ? "Nền tảng năng lực cho đối tác B2B" : "A capability platform for B2B partners"}</h1>
          <p>
            {locale === "vi"
              ? "Hoàng Long Group kết nối kinh nghiệm sản xuất, thi công và quản lý dự án để phục vụ khách hàng công nghiệp."
              : "Hoang Long Group connects manufacturing, construction, and project management experience for industrial customers."}
          </p>
        </Reveal>
      </section>
      <section className="section alt">
        <Stagger className="container proof-layout">
          <div>
            <p className="eyebrow">{locale === "vi" ? "Định vị hợp tác" : "Cooperation position"}</p>
            <h2>{locale === "vi" ? "Một hồ sơ năng lực để đối tác thẩm định nhanh" : "A capability profile partners can review quickly"}</h2>
          </div>
          <div className="insight-panel">
            <p>
              {locale === "vi"
                ? "Website ưu tiên năng lực sản xuất kết cấu, thiết bị, quy trình kiểm soát và dự án đã triển khai. Các dữ liệu thật như địa chỉ, chứng chỉ, ảnh xưởng và hồ sơ pháp lý có thể được thay vào khi được xác nhận."
                : "The website prioritizes structural fabrication capability, equipment, control processes, and delivered projects. Real addresses, certificates, factory photos, and legal records can be added once confirmed."}
              </p>
          </div>
        </Stagger>
      </section>
      <PartnerCta locale={locale} />
    </main>
  );
}
