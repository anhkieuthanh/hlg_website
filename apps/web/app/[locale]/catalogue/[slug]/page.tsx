import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, localized } from "../../../../lib/content";
import { PartnerCta } from "../../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../../components/MotionPrimitives";
import { getCatalogueProduct } from "../../../../lib/public-api";

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const locale = getLocale(params.locale);
  const product = await getCatalogueProduct(locale, params.slug);
  if (!product) return {};
  return {
    title: localized(locale, product.name),
    description: localized(locale, product.summary),
    openGraph: { images: product.image ? [{ url: product.image }] : undefined }
  };
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
          <div className="card-media-wrap">
            <Image className="card-media" src={product.image || "/assets/industrial-hero.png"} alt={localized(locale, product.name)} fill priority sizes="(max-width: 768px) 100vw, 60vw" />
          </div>
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
