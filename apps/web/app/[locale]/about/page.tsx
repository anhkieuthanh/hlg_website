import { getLocale } from "../../../lib/content";

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{locale === "vi" ? "Giới thiệu" : "About"}</p>
          <h1>{locale === "vi" ? "Nền tảng năng lực cho đối tác B2B" : "A capability platform for B2B partners"}</h1>
          <p>
            {locale === "vi"
              ? "Hoàng Long Group kết nối kinh nghiệm sản xuất, thi công và quản lý dự án để phục vụ khách hàng công nghiệp."
              : "Hoang Long Group connects manufacturing, construction, and project management experience for industrial customers."}
          </p>
        </div>
      </section>
    </main>
  );
}
