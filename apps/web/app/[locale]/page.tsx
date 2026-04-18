import { companyStats, withLocale } from "@hlg/shared";
import Link from "next/link";
import { ProjectCard, ProductCard, NewsCard } from "../../components/Cards";
import { contentFor, getLocale, localized, t } from "../../lib/content";

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);

  return (
    <main>
      <section className="hero">
        <img src="/assets/industrial-hero.png" alt="" />
        <div className="hero-content">
          <p className="eyebrow">{t(locale, "eyebrow")}</p>
          <h1>{t(locale, "heroTitle")}</h1>
          <p>{t(locale, "heroCopy")}</p>
          <div className="hero-actions">
            <Link className="button" href={withLocale(locale, "/projects")}>
              {t(locale, "primaryCta")}
            </Link>
            <Link className="button secondary" href={withLocale(locale, "/contact")}>
              {t(locale, "secondaryCta")}
            </Link>
          </div>
          <div className="stats">
            {companyStats.map((stat) => (
              <div className="stat" key={stat.value}>
                <strong>{stat.value}</strong>
                <span>{localized(locale, stat.label)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-heading">
            <h2>{t(locale, "capabilitiesTitle")}</h2>
            <p>{t(locale, "capabilitiesCopy")}</p>
          </div>
          <div className="grid">
            {content.capabilities.map((item) => (
              <article className="card" key={item.id}>
                <img className="card-media" src={item.image} alt={localized(locale, item.title)} />
                <div className="card-body">
                  <div className="meta">
                    <span>{item.type}</span>
                  </div>
                  <h3>{localized(locale, item.title)}</h3>
                  <p>{localized(locale, item.description)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <h2>{t(locale, "projectsTitle")}</h2>
            <p>{t(locale, "projectsCopy")}</p>
          </div>
          <div className="grid two">
            {content.projects.map((project) => (
              <ProjectCard key={project.id} locale={locale} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="container split">
          <div>
            <p className="eyebrow">{t(locale, "catalogueTitle")}</p>
            <h2>{t(locale, "catalogueCopy")}</h2>
          </div>
          <ul className="feature-list">
            {content.catalogueProducts.map((product) => (
              <li key={product.id}>
                <strong>{localized(locale, product.name)}</strong>
                <p>{localized(locale, product.summary)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-heading">
            <h2>{t(locale, "newsTitle")}</h2>
            <p>{t(locale, "newsCopy")}</p>
          </div>
          <div className="grid">
            {content.news.map((article) => (
              <NewsCard key={article.id} locale={locale} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
