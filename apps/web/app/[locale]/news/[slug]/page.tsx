import { notFound } from "next/navigation";
import { contentFor, getLocale, localized } from "../../../../lib/content";

export function generateStaticParams() {
  return contentFor("vi").news.flatMap((article) => [
    { locale: "vi", slug: article.slug },
    ...(article.enPublished ? [{ locale: "en", slug: article.slug }] : [])
  ]);
}

export default function NewsDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const article = contentFor(locale).news.find((item) => item.slug === params.slug);
  if (!article) notFound();
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{localized(locale, article.category)}</p>
          <h1>{localized(locale, article.title)}</h1>
          <p>{localized(locale, article.excerpt)}</p>
        </div>
      </section>
      <section className="container detail-body">
        <article>
          <img className="card-media" src={article.image} alt={localized(locale, article.title)} />
          <p>{localized(locale, article.body)}</p>
        </article>
      </section>
    </main>
  );
}
