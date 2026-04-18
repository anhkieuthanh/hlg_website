import type { MetadataRoute } from "next";
import { catalogueProducts, navigation, newsSeed, projectSeed } from "@hlg/shared";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const locales = ["vi", "en"];
  const staticPaths = ["", ...navigation.map((item) => item.href)];
  const dynamicPaths = [
    ...projectSeed.map((item) => `/projects/${item.slug}`),
    ...catalogueProducts.map((item) => `/catalogue/${item.slug}`),
    ...newsSeed.map((item) => `/news/${item.slug}`)
  ];
  return locales.flatMap((locale) =>
    [...staticPaths, ...dynamicPaths].map((path) => ({
      url: `${site}/${locale}${path}`,
      lastModified: new Date()
    }))
  );
}
