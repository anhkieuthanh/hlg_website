import { navigation, type Locale } from "@hlg/shared";
import { localized, t, contentFor } from "./content";

const API_BASE_URL = process.env.HLG_API_URL || "http://127.0.0.1:4001";

export type PublicSiteConfig = {
  header: {
    logoUrl: string;
    brandName: string;
    tagline: string;
    cta: {
      enabled: boolean;
      href: string;
      label: string;
    };
  };
  navigation: Array<{
    id: string;
    href: string;
    placement: "header" | "footerCapabilities" | "footerProof";
    order: number;
    label: string;
  }>;
  footer: {
    brandTagline: string;
    capabilitiesTitle: string;
    proofTitle: string;
    contactTitle: string;
    contactCopy: string;
    pendingRecords: string;
    copyright: string;
    contactCta: {
      enabled: boolean;
      href: string;
      label: string;
    };
  };
};

export async function getSiteConfig(locale: Locale): Promise<PublicSiteConfig> {
  return getPublicJson<PublicSiteConfig>(`/api/public/site?locale=${locale}`, fallbackSiteConfig(locale));
}

export async function getNews(locale: Locale) {
  return getPublicJson<any[]>(`/api/public/news?locale=${locale}`, contentFor(locale).news);
}

export async function getNewsArticle(locale: Locale, slug: string) {
  const fallback = contentFor(locale).news.find((item) => item.slug === slug) || null;
  return getPublicJson<any | null>(`/api/public/news/${slug}?locale=${locale}`, fallback);
}

export async function getHomeContent(locale: Locale) {
  const fallback = contentFor(locale);
  return getPublicJson<{
    projects: any[];
    products: any[];
    news: any[];
    capabilities: any[];
  }>(`/api/public/home?locale=${locale}`, {
    projects: fallback.projects.filter((item: any) => item.featured).slice(0, 4),
    products: fallback.catalogueProducts.slice(0, 6),
    news: fallback.news.slice(0, 3),
    capabilities: fallback.capabilities.slice(0, 6)
  });
}

export async function getProjects(locale: Locale) {
  return getPublicJson<any[]>(`/api/public/projects?locale=${locale}`, contentFor(locale).projects);
}

export async function getProject(locale: Locale, slug: string) {
  const fallback = contentFor(locale).projects.find((item) => item.slug === slug) || null;
  return getPublicJson<any | null>(`/api/public/projects/${slug}?locale=${locale}`, fallback);
}

export async function getCatalogue(locale: Locale) {
  return getPublicJson<{ categories: any[]; products: any[] }>(`/api/public/catalogue?locale=${locale}`, {
    categories: contentFor(locale).catalogueCategories,
    products: contentFor(locale).catalogueProducts
  });
}

export async function getCatalogueProduct(locale: Locale, slug: string) {
  const catalogue = await getCatalogue(locale);
  return catalogue.products.find((item) => item.slug === slug) || null;
}

export async function getCapabilities(locale: Locale) {
  return getPublicJson<any[]>(`/api/public/capabilities?locale=${locale}`, contentFor(locale).capabilities);
}

async function getPublicJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(new URL(path, API_BASE_URL), { cache: "no-store" });
    if (!response.ok) return fallback;
    return response.json();
  } catch {
    return fallback;
  }
}

function fallbackSiteConfig(locale: Locale): PublicSiteConfig {
  const headerItems = navigation.map((item, index) => ({
    id: `header-${index}`,
    href: item.href,
    placement: "header" as const,
    order: index + 1,
    label: localized(locale, item.label)
  }));
  const footerCapabilities = ["/manufacturing", "/capabilities", "/catalogue", "/construction"].map((href, index) => {
    const item = navigation.find((entry) => entry.href === href)!;
    return {
      id: `footer-capabilities-${index}`,
      href,
      placement: "footerCapabilities" as const,
      order: index + 1,
      label: localized(locale, item.label)
    };
  });
  const footerProof = ["/projects", "/news"].map((href, index) => {
    const item = navigation.find((entry) => entry.href === href)!;
    return {
      id: `footer-proof-${index}`,
      href,
      placement: "footerProof" as const,
      order: index + 1,
      label: localized(locale, item.label)
    };
  });

  return {
    header: {
      logoUrl: "/assets/hoang-long-logo.svg",
      brandName: locale === "vi" ? "Hoàng Long Group" : "Hoang Long Group",
      tagline: "Manufacturing + Construction",
      cta: { enabled: true, href: "/contact", label: t(locale, "partnerCtaPrimary") }
    },
    navigation: [...headerItems, ...footerCapabilities, ...footerProof],
    footer: {
      brandTagline: t(locale, "footerTagline"),
      capabilitiesTitle: t(locale, "footerCapabilities"),
      proofTitle: t(locale, "footerProof"),
      contactTitle: t(locale, "footerContact"),
      contactCopy: t(locale, "footerContactCopy"),
      pendingRecords: t(locale, "footerPendingRecords"),
      copyright: t(locale, "footerCopyright"),
      contactCta: { enabled: true, href: "/contact", label: t(locale, "partnerCtaPrimary") }
    }
  };
}
