import { ProductCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { contentFor, getLocale, localized, t } from "../../../lib/content";

export default function CataloguePage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const content = contentFor(locale);
  return (
    <main>
      <section className="detail-hero">
        <Reveal className="container">
          <p className="eyebrow">{t(locale, "catalogueTitle")}</p>
          <h1>{t(locale, "catalogueCopy")}</h1>
          <p>
            {locale === "vi"
              ? "Catalogue được tổ chức như danh sách hạng mục có thể phối hợp sản xuất/thi công, kèm hồ sơ và yêu cầu đầu vào cần làm rõ."
              : "The catalogue is organized as cooperation-ready fabrication or construction scopes, with records and input requirements to clarify."}
          </p>
        </Reveal>
      </section>
      <section className="section alt">
        <Stagger className="container grid two">
          {content.catalogueCategories.map((category) => (
            <article className="card" key={category.id}>
              <div className="card-body">
                <h3>{localized(locale, category.name)}</h3>
                <p>{localized(locale, category.description)}</p>
              </div>
            </article>
          ))}
        </Stagger>
      </section>
      <section className="section">
        <Stagger className="container grid">
          {content.catalogueProducts.map((product) => (
            <ProductCard key={product.id} locale={locale} product={product} />
          ))}
        </Stagger>
      </section>
      <PartnerCta locale={locale} />
    </main>
  );
}
