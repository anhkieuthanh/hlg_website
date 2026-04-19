import { notFound } from "next/navigation";
import { getLocale, localized } from "../../../../lib/content";
import { PartnerCta } from "../../../../components/ExperienceSections";
import { Reveal } from "../../../../components/MotionPrimitives";
import { SiteImage } from "../../../../components/SiteImage";
import { getNewsArticle } from "../../../../lib/public-api";
import { localizedMetadata } from "../../../../lib/seo";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const article = await getNewsArticle(locale, params.slug);
  if (!article) {
    return localizedMetadata({
      locale,
      path: `/news/${params.slug}`,
      title: locale === "vi" ? "Tin tức" : "News",
      description:
        locale === "vi"
          ? "Tin tức và góc nhìn ngành từ Hoàng Long Group."
          : "News and industry insights from Hoang Long Group."
    });
  }
  return localizedMetadata({
    locale,
    path: `/news/${article.slug}`,
    title: localized(locale, article.title),
    description: localized(locale, article.excerpt),
    image: article.image || "/assets/industrial-hero-1440.webp"
  });
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
          <SiteImage className="card-media" src={article.image} alt={localized(locale, article.title)} sizes="(max-width: 900px) 100vw, 760px" />
          <p>{localized(locale, article.body)}</p>
        </article>
      </Reveal>
      <PartnerCta locale={locale} />
    </main>
  );
}
