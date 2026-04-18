import { Locale, withLocale } from "@hlg/shared";
import Link from "next/link";
import { t } from "../lib/content";
import { Reveal, Stagger } from "./MotionPrimitives";

const controlSteps = {
  vi: [
    ["01", "Tiếp nhận hồ sơ", "Bản vẽ, khối lượng, tiêu chuẩn và yêu cầu bàn giao được làm rõ trước khi phản hồi phạm vi."],
    ["02", "Lập kế hoạch sản xuất", "Vật tư, thiết bị, lô gia công và mốc kiểm soát được tổ chức theo năng lực nhà máy."],
    ["03", "QC và phối hợp", "Các điểm kiểm tra, ảnh hiện trường/xưởng và hồ sơ nghiệm thu được cập nhật theo từng giai đoạn."],
    ["04", "Bàn giao đối tác", "Kết quả được bàn giao cùng đầu mối xử lý phát sinh để đối tác tiếp tục triển khai dự án."]
  ],
  en: [
    ["01", "Review records", "Drawings, quantities, standards, and handover needs are clarified before scope feedback."],
    ["02", "Plan production", "Materials, equipment, fabrication batches, and control milestones are organized around factory capacity."],
    ["03", "QC and coordination", "Inspection points, factory/site evidence, and acceptance records are updated by stage."],
    ["04", "Partner handover", "Outputs are handed over with responsible contacts for project follow-through."]
  ]
};

const trustNotes = {
  vi: [
    "Ưu tiên hồ sơ rõ ràng cho đối tác thẩm định",
    "Tập trung năng lực nhà máy và thiết bị",
    "Có thể phối hợp theo hạng mục hoặc theo gói"
  ],
  en: [
    "Clear records for partner review",
    "Factory and equipment led capability proof",
    "Cooperate by component or work package"
  ]
};

export function ControlFlow({ locale }: { locale: Locale }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="section-heading">
          <h2>{t(locale, "proofTitle")}</h2>
          <p>{t(locale, "proofCopy")}</p>
        </Reveal>
        <Stagger className="process-grid">
          {controlSteps[locale].map(([index, title, copy]) => (
            <article className="process-card" key={index}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function TrustBar({ locale }: { locale: Locale }) {
  return (
    <Stagger className="trust-bar" y={10}>
      {trustNotes[locale].map((item) => (
        <span key={item}>{item}</span>
      ))}
    </Stagger>
  );
}

export function PartnerCta({ locale }: { locale: Locale }) {
  return (
    <section className="section cta-band">
      <Stagger className="container cta-content" y={14}>
        <div>
          <p className="eyebrow">{locale === "vi" ? "Liên hệ hợp tác" : "Partner inquiry"}</p>
          <h2>{t(locale, "partnerCtaTitle")}</h2>
          <p>{t(locale, "partnerCtaCopy")}</p>
        </div>
        <div className="hero-actions">
          <Link className="button" href={withLocale(locale, "/contact")}>
            {t(locale, "partnerCtaPrimary")}
          </Link>
          <Link className="button secondary" href={withLocale(locale, "/capabilities")}>
            {t(locale, "partnerCtaSecondary")}
          </Link>
        </div>
      </Stagger>
    </section>
  );
}
