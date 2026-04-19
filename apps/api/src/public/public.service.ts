import { Injectable } from "@nestjs/common";
import { LeadStatus, Prisma } from "@prisma/client";
import { assertLocale, Locale } from "@hlg/shared";
import { PrismaService } from "../prisma.service";
import {
  defaultFooterSettings,
  defaultHeaderSettings,
  defaultNavigationSettings,
  localizeText,
  normalizeNavigationItems,
  type FooterSettings,
  type HeaderSettings
} from "../site-settings";

const visibleWhere = (locale: Locale) => ({
  deletedAt: null,
  status: "published" as const,
  ...(locale === "en" ? { enPublished: true } : {})
});

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async home(localeInput?: string) {
    const locale = assertLocale(localeInput);
    const [projects, products, news, capabilities] = await Promise.all([
      this.prisma.project.findMany({ where: { ...visibleWhere(locale), featured: true }, take: 4, orderBy: { year: "desc" } }),
      this.prisma.catalogueProduct.findMany({ where: visibleWhere(locale), take: 6, include: { category: true } }),
      this.prisma.newsArticle.findMany({ where: visibleWhere(locale), take: 3, orderBy: { publishedAt: "desc" } }),
      this.prisma.capabilityItem.findMany({ where: visibleWhere(locale), take: 6 })
    ]);
    return { projects, products, news, capabilities };
  }

  listProjects(localeInput?: string) {
    const locale = assertLocale(localeInput);
    return this.prisma.project.findMany({ where: visibleWhere(locale), orderBy: [{ featured: "desc" }, { year: "desc" }] });
  }

  project(localeInput: string | undefined, slug: string) {
    const locale = assertLocale(localeInput);
    return this.prisma.project.findFirst({ where: { slug, ...visibleWhere(locale) } });
  }

  async catalogue(localeInput?: string) {
    const locale = assertLocale(localeInput);
    const [categories, products] = await Promise.all([
      this.prisma.catalogueCategory.findMany({ where: visibleWhere(locale), orderBy: { createdAt: "asc" } }),
      this.prisma.catalogueProduct.findMany({ where: visibleWhere(locale), include: { category: true }, orderBy: { createdAt: "asc" } })
    ]);
    return { categories, products };
  }

  news(localeInput?: string) {
    const locale = assertLocale(localeInput);
    return this.prisma.newsArticle.findMany({ where: visibleWhere(locale), orderBy: { publishedAt: "desc" } });
  }

  newsArticle(localeInput: string | undefined, slug: string) {
    const locale = assertLocale(localeInput);
    return this.prisma.newsArticle.findFirst({ where: { slug, ...visibleWhere(locale) } });
  }

  capabilities(localeInput?: string) {
    const locale = assertLocale(localeInput);
    return this.prisma.capabilityItem.findMany({ where: visibleWhere(locale), orderBy: { createdAt: "asc" } });
  }

  async site(localeInput?: string) {
    const locale = assertLocale(localeInput);
    const settings = await this.prisma.siteSetting.findMany({
      where: { key: { in: ["site.header", "site.footer", "site.navigation"] } }
    });
    const byKey = new Map(settings.map((setting) => [setting.key, setting.value]));
    const header = { ...defaultHeaderSettings, ...((byKey.get("site.header") as Prisma.JsonObject | undefined) || {}) } as HeaderSettings;
    const footer = { ...defaultFooterSettings, ...((byKey.get("site.footer") as Prisma.JsonObject | undefined) || {}) } as FooterSettings;
    const navigation = normalizeNavigationItems(byKey.get("site.navigation") || defaultNavigationSettings);

    return {
      header: {
        logoUrl: header.logoUrl || defaultHeaderSettings.logoUrl,
        brandName: localizeText(locale, header.brandName, "Hoàng Long Group"),
        tagline: localizeText(locale, header.tagline, "Manufacturing + Construction"),
        cta: {
          enabled: header.cta?.enabled === true,
          href: header.cta?.href || "/contact",
          label: localizeText(locale, header.cta?.label, locale === "vi" ? "Liên hệ hợp tác" : "Partner with us")
        }
      },
      navigation: navigation
        .filter((item) => item.enabled)
        .map((item) => ({
          id: item.id,
          href: item.href,
          placement: item.placement,
          order: item.order,
          label: localizeText(locale, item.label, item.href)
        })),
      footer: {
        brandTagline: localizeText(locale, footer.brandTagline),
        capabilitiesTitle: localizeText(locale, footer.capabilitiesTitle),
        proofTitle: localizeText(locale, footer.proofTitle),
        contactTitle: localizeText(locale, footer.contactTitle),
        contactCopy: localizeText(locale, footer.contactCopy),
        pendingRecords: localizeText(locale, footer.pendingRecords),
        copyright: localizeText(locale, footer.copyright),
        contactCta: {
          enabled: footer.contactCta?.enabled !== false,
          href: footer.contactCta?.href || "/contact",
          label: localizeText(locale, footer.contactCta?.label, locale === "vi" ? "Liên hệ hợp tác" : "Partner with us")
        }
      }
    };
  }

  async submitLead(data: { name: string; email: string; phone?: string; company?: string; message: string }) {
    const lead = await this.prisma.contactLead.create({
      data: {
        ...data,
        status: LeadStatus.new
      }
    });
    return { ok: true, leadId: lead.id };
  }
}
