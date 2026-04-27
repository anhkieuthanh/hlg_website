import type { Metadata } from "next";
import { ContactForm } from "../../../components/ContactForm";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { getLocale, t } from "../../../lib/content";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = getLocale(params.locale);
  return {
    title: locale === "vi" ? "Lien he" : "Contact",
    description: t(locale, "contactCopy")
  };
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">Contact</p>
          <h1>{t(locale, "contactTitle")}</h1>
          <p>{t(locale, "contactCopy")}</p>
        </Reveal>
      </section>
      <section className="section alt">
        <Stagger className="container split">
          <div>
            <h2>Hoàng Long Group</h2>
            <p>
              {locale === "vi"
                ? "Để phản hồi nhanh hơn, vui lòng gửi phạm vi hạng mục, bản vẽ hoặc tiêu chuẩn kỹ thuật nếu đã có."
                : "For a faster response, please include the work scope, drawings, or technical standards if available."}
            </p>
            <ul className="feature-list contact-list">
              <li>
                <strong>{locale === "vi" ? "Hạng mục cần phối hợp" : "Cooperation scope"}</strong>
                <p>{locale === "vi" ? "Kết cấu, cấu kiện, gói thi công hoặc nhu cầu năng lực." : "Structures, components, work packages, or capability needs."}</p>
              </li>
              <li>
                <strong>{locale === "vi" ? "Mốc thời gian dự kiến" : "Expected timeline"}</strong>
                <p>{locale === "vi" ? "Thời điểm cần phản hồi, sản xuất, giao hàng hoặc phối hợp công trường." : "Response, fabrication, delivery, or site coordination milestones."}</p>
              </li>
              <li>
                <strong>{locale === "vi" ? "Hồ sơ hiện có" : "Available records"}</strong>
                <p>{locale === "vi" ? "Bản vẽ, BOQ, tiêu chuẩn kỹ thuật hoặc yêu cầu nghiệm thu." : "Drawings, BOQ, technical standards, or acceptance requirements."}</p>
              </li>
            </ul>
          </div>
          <ContactForm locale={locale} />
        </Stagger>
      </section>
    </main>
  );
}
