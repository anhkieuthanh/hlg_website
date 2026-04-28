import { Locale, withLocale } from "@hlg/shared";
import Link from "next/link";
import { localized, t } from "../lib/content";

export function ProjectCard({ locale, project }: { locale: Locale; project: any }) {
  return (
    <Link className="card" href={withLocale(locale, `/projects/${project.slug}`)}>
      <img className="card-media" src={project.heroImage || "/assets/industrial-hero.png"} alt={localized(locale, project.title)} />
      <div className="card-body">
        <div className="meta">
          <span>{project.year}</span>
          <span>{localized(locale, project.sector)}</span>
        </div>
        <h3>{localized(locale, project.title)}</h3>
        <p>{localized(locale, project.excerpt)}</p>
        <strong>{t(locale, "readMore")}</strong>
      </div>
    </Link>
  );
}

export function ProductCard({ locale, product }: { locale: Locale; product: any }) {
  return (
    <Link className="card" href={withLocale(locale, `/catalogue/${product.slug}`)}>
      <img className="card-media" src={product.image || "/assets/industrial-hero.png"} alt={localized(locale, product.name)} />
      <div className="card-body">
        <h3>{localized(locale, product.name)}</h3>
        <p>{localized(locale, product.summary)}</p>
      </div>
    </Link>
  );
}

export function NewsCard({ locale, article }: { locale: Locale; article: any }) {
  return (
    <Link className="card" href={withLocale(locale, `/news/${article.slug}`)}>
      <img className="card-media" src={article.image || "/assets/industrial-hero.png"} alt={localized(locale, article.title)} />
      <div className="card-body">
        <div className="meta">
          <span>{localized(locale, article.category)}</span>
        </div>
        <h3>{localized(locale, article.title)}</h3>
        <p>{localized(locale, article.excerpt)}</p>
      </div>
    </Link>
  );
}
