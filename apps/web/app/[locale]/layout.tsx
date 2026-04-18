import { Locale } from "@hlg/shared";
import { SiteChrome } from "../../components/SiteChrome";
import { getLocale } from "../../lib/content";

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const locale = getLocale(params.locale);
  return <SiteChrome locale={locale}>{children}</SiteChrome>;
}
