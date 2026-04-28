import { companyStats, withLocale } from "@hlg/shared";
import Link from "next/link";
import { ProjectCard, NewsCard } from "../../components/Cards";
import { ControlFlow, PartnerCta, TrustBar } from "../../components/ExperienceSections";
import { Reveal, Stagger } from "../../components/MotionPrimitives";
import { getLocale, localized, t } from "../../lib/content";
import { getHomeContent } from "../../lib/public-api";

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = await getHomeContent(locale);
  const factoryProof = content.capabilities.filter((item) => item.type !== "certificate");

  return (
    <main>
      <section className="hero">
        <img src="/assets/industrial-hero.png" alt="" />
        <Stagger className="hero-content" y={14}>
          <p className="eyebrow">{t(locale, "eyebrow")}</p>
          <h1>{t(locale, "heroTitle")}</h1>
          <p>{t(locale, "heroCopy")}</p>
          <TrustBar locale={locale} />
          <div className="hero-actions">
            <Link className="button" href={withLocale(locale, "/contact")}>
              {t(locale, "primaryCta")}
            </Link>
            <Link className="button secondary" href={withLocale(locale, "/manufacturing")}>
              {t(locale, "secondaryCta")}
            </Link>
          </div>
          <Stagger className="stats" delay={0.12} y={12}>
            {companyStats.map((stat) => (
              <div className="stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{localized(locale, stat.label)}</span>
              </div>
            ))}
          </Stagger>
        </Stagger>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal className="section-heading">
            <h2>{t(locale, "manufacturingTitle")}</h2>
            <p>{t(locale, "manufacturingCopy")}</p>
          </Reveal>
          <Stagger className="grid">
            {factoryProof.map((item) => (
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
                  <span>{locale === "vi" ? "hồ sơ" : "records"}</span>
                </div>
                <h3>{locale === "vi" ? "Hồ sơ kiểm soát để đối tác thẩm định" : "Control records for partner review"}</h3>
                <p>
                  {locale === "vi"
                    ? "Cấu trúc website ưu tiên các bằng chứng có thể thay bằng dữ liệu thật: năng lực xưởng, thiết bị, QC, nghiệm thu và đầu mối phối hợp."
                    : "The site structure prioritizes proof that can be replaced with real records: factory capacity, equipment, QC, acceptance, and coordination contacts."}
                </p>
                <Link href={withLocale(locale, "/capabilities")}>{t(locale, "partnerCtaSecondary")}</Link>
              </div>
            </article>
          </Stagger>
        </div>
      </section>

      <ControlFlow locale={locale} />

      <section className="section alt">
        <div className="container">
          <Reveal className="section-heading">
            <h2>{t(locale, "projectsTitle")}</h2>
            <p>{t(locale, "projectsCopy")}</p>
          </Reveal>
          <Stagger className="grid two">
            {content.projects.map((project) => (
              <ProjectCard key={project.id} locale={locale} project={project} />
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section band">
        <Stagger className="container split" y={14}>
          <div>
            <p className="eyebrow">{t(locale, "catalogueTitle")}</p>
            <h2>{t(locale, "catalogueCopy")}</h2>
          </div>
          <ul className="feature-list">
            {content.products.map((product) => (
              <li key={product.id}>
                <strong>{localized(locale, product.name)}</strong>
                <p>{localized(locale, product.summary)}</p>
              </li>
            ))}
          </ul>
        </Stagger>
      </section>

      <section className="section alt">
        <div className="container">
          <Reveal className="section-heading">
            <h2>{t(locale, "newsTitle")}</h2>
            <p>{t(locale, "newsCopy")}</p>
          </Reveal>
          <Stagger className="grid">
            {content.news.map((article) => (
              <NewsCard key={article.id} locale={locale} article={article} />
            ))}
          </Stagger>
        </div>
      </section>

      <PartnerCta locale={locale} />
    </main>
  );
}
