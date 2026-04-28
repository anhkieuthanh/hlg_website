import type { Metadata } from "next";
import Image from "next/image";
import { getLocale, localized, t } from "../../../lib/content";
import { ControlFlow, PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { getCapabilities } from "../../../lib/public-api";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = getLocale(params.locale);
  return {
    title: locale === "vi" ? "Nang luc" : "Capabilities",
    description: t(locale, "capabilitiesCopy")
  };
}

export default async function CapabilitiesPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const capabilities = await getCapabilities(locale);
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{locale === "vi" ? "Năng lực" : "Capabilities"}</p>
          <h1>{t(locale, "capabilitiesTitle")}</h1>
          <p>{t(locale, "capabilitiesCopy")}</p>
        </Reveal>
      </section>
      <section className="section alt">
        <div className="container">
          <Reveal className="section-heading">
            <h2>{locale === "vi" ? "Bộ bằng chứng cho thẩm định đối tác" : "Proof set for partner due diligence"}</h2>
            <p>
              {locale === "vi"
                ? "Mỗi nhóm năng lực trả lời một câu hỏi thẩm định: có xưởng không, có thiết bị không, có quy trình và hồ sơ kiểm soát không."
                : "Each capability group answers a review question: factory readiness, equipment readiness, and control-record readiness."}
            </p>
          </Reveal>
          <Stagger className="grid">
            {capabilities.map((item) => (
              <article className="card" key={item.id}>
                <div className="card-media-wrap">
                  <Image className="card-media" src={item.image || "/assets/industrial-hero.png"} alt={localized(locale, item.title)} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
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
          </Stagger>
        </div>
      </section>
      <ControlFlow locale={locale} />
      <PartnerCta locale={locale} />
    </main>
  );
}
