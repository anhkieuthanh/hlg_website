import { ContactForm } from "../../../components/ContactForm";
import { getLocale, t } from "../../../lib/content";

export default function ContactPage({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  return (
    <main>
      <section className="detail-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>{t(locale, "contactTitle")}</h1>
          <p>{t(locale, "contactCopy")}</p>
        </div>
      </section>
      <section className="section alt">
        <div className="container split">
          <div>
            <h2>Hoàng Long Group</h2>
            <p>Email: contact@hoanglong.example</p>
            <p>Hotline: +84 000 000 000</p>
            <p>{locale === "vi" ? "Địa chỉ trụ sở và nhà máy sẽ được cập nhật khi chốt dữ liệu thật." : "Head office and factory addresses will be updated when source data is confirmed."}</p>
          </div>
          <ContactForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
