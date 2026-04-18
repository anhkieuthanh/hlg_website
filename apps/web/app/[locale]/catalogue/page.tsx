import { ProductCard } from "../../../components/Cards";
import { contentFor, getLocale, localized, t } from "../../../lib/content";

export default function CataloguePage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">{t(locale, "catalogueTitle")}</p>
          <h1>{t(locale, "catalogueCopy")}</h1>
        </div>
      </section>
      <section className="section alt">
        <div className="container grid two">
          {content.catalogueCategories.map((category) => (
            <article className="card" key={category.id}>
              <div className="card-body">
                <h3>{localized(locale, category.name)}</h3>
                <p>{localized(locale, category.description)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container grid">
          {content.catalogueProducts.map((product) => (
            <ProductCard key={product.id} locale={locale} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
