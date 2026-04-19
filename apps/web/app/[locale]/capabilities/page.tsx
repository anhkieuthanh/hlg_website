import { getLocale, localized, t } from "../../../lib/content";
import { ControlFlow, PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { SiteImage } from "../../../components/SiteImage";
import { getCapabilities } from "../../../lib/public-api";
import { localizedMetadata } from "../../../lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return localizedMetadata({
    locale,
    path: "/capabilities",
    title: t(locale, "capabilitiesTitle"),
    description: t(locale, "capabilitiesCopy")
  });
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
          <h2 className="sr-only">{locale === "vi" ? "Danh sách năng lực" : "Capability list"}</h2>
          <Stagger className="grid">
            {capabilities.map((item) => (
              <article className="card" key={item.id}>
                <SiteImage className="card-media" src={item.image} alt={localized(locale, item.title)} />
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
