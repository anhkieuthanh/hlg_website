import { Locale } from "@hlg/shared";
import { SiteChrome } from "../../components/SiteChrome";
import { getLocale } from "../../lib/content";
import { getSiteConfig } from "../../lib/public-api";

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const locale = getLocale(params.locale);
  const site = await getSiteConfig(locale);
  return (
    <SiteChrome locale={locale} site={site}>
      {children}
    </SiteChrome>
  );
}
