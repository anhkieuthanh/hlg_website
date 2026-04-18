import { notFound } from "next/navigation";
import { contentFor, getLocale, localized } from "../../../../lib/content";
import { PartnerCta } from "../../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../../components/MotionPrimitives";

export function generateStaticParams() {
  return contentFor("vi").catalogueProducts.flatMap((product) => [
    { locale: "vi", slug: product.slug },
    ...(product.enPublished ? [{ locale: "en", slug: product.slug }] : [])
  ]);
}

export default function ProductDetailPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = getLocale(params.locale);
  const product = contentFor(locale).catalogueProducts.find((item) => item.slug === params.slug);
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
          <img className="card-media" src={product.image} alt={localized(locale, product.name)} />
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
          {product.specs.map((spec, index) => (
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
