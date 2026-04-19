import type { MetadataRoute } from "next";
import { navigation } from "@hlg/shared";
import { contentFor, getLocale } from "../lib/content";
import { siteUrl } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = siteUrl();
  const locales = ["vi", "en"] as const;
  return locales.flatMap((locale) =>
    buildLocalePaths(getLocale(locale)).map((path) => ({
      url: `${site}/${locale}${path}`,
      lastModified: new Date()
    }))
  );
}

function buildLocalePaths(locale: "vi" | "en") {
  const content = contentFor(locale);
  return [
    ...new Set([
      ...["", ...navigation.map((item) => item.href)],
      ...content.projects.map((item) => `/projects/${item.slug}`),
      ...content.catalogueProducts.map((item) => `/catalogue/${item.slug}`),
      ...content.news.map((item) => `/news/${item.slug}`)
    ])
  ];
}
