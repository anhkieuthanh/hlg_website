import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, localized } from "../../../../lib/content";
import { PartnerCta } from "../../../../components/ExperienceSections";
import { Reveal } from "../../../../components/MotionPrimitives";
import { getNewsArticle } from "../../../../lib/public-api";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const locale = getLocale(params.locale);
  const article = await getNewsArticle(locale, params.slug);
  if (!article) return {};
  return {
    title: localized(locale, article.title),
    description: localized(locale, article.excerpt),
    openGraph: { images: article.image ? [{ url: article.image }] : undefined }
  };
}

export default async function NewsDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const article = await getNewsArticle(locale, params.slug);
  if (!article) notFound();
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{localized(locale, article.category)}</p>
          <h1>{localized(locale, article.title)}</h1>
          <p>{localized(locale, article.excerpt)}</p>
        </Reveal>
      </section>
      <Reveal className="container detail-body">
        <article>
          <div className="card-media-wrap">
            <Image className="card-media" src={article.image || "/assets/industrial-hero.png"} alt={localized(locale, article.title)} fill priority sizes="(max-width: 768px) 100vw, 60vw" />
          </div>
          <p>{localized(locale, article.body)}</p>
        </article>
      </Reveal>
      <PartnerCta locale={locale} />
    </main>
  );
}
