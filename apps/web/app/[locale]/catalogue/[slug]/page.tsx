import { notFound } from "next/navigation";
import { contentFor, getLocale, localized } from "../../../../lib/content";

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
        <div className="container">
          <p className="eyebrow">Catalogue</p>
          <h1>{localized(locale, product.name)}</h1>
          <p>{localized(locale, product.summary)}</p>
        </div>
      </section>
      <section className="container detail-body">
        <article>
          <img className="card-media" src={product.image} alt={localized(locale, product.name)} />
          <p>{localized(locale, product.summary)}</p>
        </article>
        <aside className="facts">
          {product.specs.map((spec, index) => (
            <div className="fact" key={index}>
              <span>{localized(locale, spec.label)}</span>
              <strong>{localized(locale, spec.value)}</strong>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
