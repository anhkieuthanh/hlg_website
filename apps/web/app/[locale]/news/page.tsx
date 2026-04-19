import { NewsCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { getLocale, t } from "../../../lib/content";
import { getNews } from "../../../lib/public-api";
import { localizedMetadata } from "../../../lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return localizedMetadata({
    locale,
    path: "/news",
    title: t(locale, "newsTitle"),
    description: t(locale, "newsCopy")
  });
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
        <h2 className="sr-only">{locale === "vi" ? "Danh sách tin tức" : "News list"}</h2>
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
