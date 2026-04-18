import { NewsCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { contentFor, getLocale, t } from "../../../lib/content";

export default function NewsPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);
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
          {content.news.map((article) => (
            <NewsCard key={article.id} locale={locale} article={article} />
          ))}
        </Stagger>
      </section>
      <PartnerCta locale={locale} />
    </main>
  );
}
