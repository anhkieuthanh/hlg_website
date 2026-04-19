import { notFound } from "next/navigation";
import { getLocale, localized } from "../../../../lib/content";
import { PartnerCta } from "../../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../../components/MotionPrimitives";
import { SiteImage } from "../../../../components/SiteImage";
import { getCatalogueProduct } from "../../../../lib/public-api";
import { localizedMetadata } from "../../../../lib/seo";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const product = await getCatalogueProduct(locale, params.slug);
  if (!product) {
    return localizedMetadata({
      locale,
      path: `/catalogue/${params.slug}`,
      title: locale === "vi" ? "Catalogue" : "Catalogue",
      description:
        locale === "vi"
          ? "Hạng mục có thể phối hợp sản xuất và thi công cùng Hoàng Long Group."
          : "Cooperation-ready fabrication and construction scopes from Hoang Long Group."
    });
  }
  return localizedMetadata({
    locale,
    path: `/catalogue/${product.slug}`,
    title: localized(locale, product.name),
    description: localized(locale, product.summary),
    image: product.image || "/assets/industrial-hero-1440.webp"
  });
}

export default async function ProductDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const product = await getCatalogueProduct(locale, params.slug);
  if (!product) notFound();
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">Catalogue</p>
          <h1>{localized(locale, product.name)}</h1>
          <p>{localized(locale, product.summary)}</p>
        </Reveal>
      </section>
      <Stagger className="container detail-body">
        <article>
          <SiteImage className="card-media" src={product.image} alt={localized(locale, product.name)} sizes="(max-width: 900px) 100vw, 760px" />
          <p>{localized(locale, product.summary)}</p>
          <div className="insight-panel">
            <h2>{locale === "vi" ? "Cách dùng hạng mục này trong hợp tác" : "How this scope fits cooperation"}</h2>
            <p>
              {locale === "vi"
                ? "Đối tác có thể gửi bản vẽ, tiêu chuẩn kỹ thuật, khối lượng dự kiến và mốc cần phản hồi để Hoàng Long đánh giá khả năng phối hợp."
                : "Partners can send drawings, technical standards, expected quantities, and response milestones so Hoang Long can assess fit."}
            </p>
          </div>
        </article>
        <aside className="facts">
          {(product.specs || []).map((spec: any, index: number) => (
            <div className="fact" key={index}>
              <span>{localized(locale, spec.label)}</span>
              <strong>{localized(locale, spec.value)}</strong>
            </div>
          ))}
        </aside>
      </Stagger>
      <PartnerCta locale={locale} />
    </main>
  );
}
