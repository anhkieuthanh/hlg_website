import { NewsCard } from "../../../components/Cards";
import { contentFor, getLocale, t } from "../../../lib/content";

export default function NewsPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{t(locale, "newsTitle")}</p>
          <h1>{t(locale, "newsCopy")}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container grid">
          {content.news.map((article) => (
            <NewsCard key={article.id} locale={locale} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
