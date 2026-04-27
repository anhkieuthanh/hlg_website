import type { Metadata } from "next";
import { NewsCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { getLocale, t } from "../../../lib/content";
import { getNews } from "../../../lib/public-api";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = getLocale(params.locale);
  return {
    title: t(locale, "newsTitle"),
    description: t(locale, "newsCopy")
  };
}

export default async function NewsPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const news = await getNews(locale);
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{t(locale, "newsTitle")}</p>
          <h1>{t(locale, "newsCopy")}</h1>
        </Reveal>
      </section>
      <section className="section">
        <Stagger className="container grid">
          {news.map((article) => (
            <NewsCard key={article.id} locale={locale} article={article} />
          ))}
        </Stagger>
      </section>
      <PartnerCta locale={locale} />
    </main>
  );
}
