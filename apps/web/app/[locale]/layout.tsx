import type { Metadata } from "next";
import { Locale } from "@hlg/shared";
import { SiteChrome } from "../../components/SiteChrome";
import { getLocale, t } from "../../lib/content";
import { getSiteConfig } from "../../lib/public-api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = getLocale(params.locale);
  return {
    title: {
      default:
        locale === "vi"
          ? "Hoang Long Group — San xuat ket cau & Thi cong cong nghiep"
          : "Hoang Long Group — Structural Fabrication & Industrial Construction",
      template: "%s | Hoang Long Group"
    },
    description: t(locale, "heroCopy"),
    alternates: {
      canonical: `/${locale}`,
      languages: { vi: "/vi", en: "/en" }
    },
    openGraph: {
      locale: locale === "vi" ? "vi_VN" : "en_US"
    }
  };
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
