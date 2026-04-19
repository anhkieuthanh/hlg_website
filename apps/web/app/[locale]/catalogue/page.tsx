import { ProductCard } from "../../../components/Cards";
import { PartnerCta } from "../../../components/ExperienceSections";
import { Reveal, Stagger } from "../../../components/MotionPrimitives";
import { getLocale, localized, t } from "../../../lib/content";
import { getCatalogue } from "../../../lib/public-api";
import { localizedMetadata } from "../../../lib/seo";

export function generateMetadata({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return localizedMetadata({
    locale,
    path: "/catalogue",
    title: t(locale, "catalogueTitle"),
    description: t(locale, "catalogueCopy")
  });
}

export default async function CataloguePage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const catalogue = await getCatalogue(locale);
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
        <h2 className="sr-only">{locale === "vi" ? "Danh mục catalogue" : "Catalogue categories"}</h2>
        <Stagger className="container grid two">
          {catalogue.categories.map((category) => (
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
        <h2 className="sr-only">{locale === "vi" ? "Hạng mục catalogue" : "Catalogue scopes"}</h2>
        <Stagger className="container grid">
          {catalogue.products.map((product) => (
            <ProductCard key={product.id} locale={locale} product={product} />
          ))}
        </Stagger>
      </section>
      <PartnerCta locale={locale} />
    </main>
  );
}
