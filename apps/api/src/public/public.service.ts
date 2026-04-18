import { Injectable } from "@nestjs/common";
import { LeadStatus } from "@prisma/client";
import { assertLocale, Locale } from "@hlg/shared";
import { PrismaService } from "../prisma.service";

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

  capabilities(localeInput?: string) {
    const locale = assertLocale(localeInput);
    return this.prisma.capabilityItem.findMany({ where: visibleWhere(locale), orderBy: { createdAt: "asc" } });
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
