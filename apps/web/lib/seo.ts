import type { Metadata } from "next";
import type { Locale } from "@hlg/shared";

const DEFAULT_SITE_URL = "http://localhost:3000";

export function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return url.replace(/\/$/, "");
}

export function localizedMetadata({
  locale,
  path,
  title,
  description,
  image = "/assets/industrial-hero-1440.webp"
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const cleanPath = path === "/" ? "" : path;
  const base = siteUrl();
  const localizedPath = `/${locale}${cleanPath}`;
  const canonical = `${base}${localizedPath}`;
  const fullTitle = title.includes("Hoàng Long") || title.includes("Hoang Long") ? title : `${title} | Hoàng Long Group`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
      languages: {
        vi: `${base}/vi${cleanPath}`,
        en: `${base}/en${cleanPath}`
      }
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: "Hoàng Long Group",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
      images: [{ url: `${base}${image}`, width: 1440, height: 960 }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${base}${image}`]
    }
  };
}
