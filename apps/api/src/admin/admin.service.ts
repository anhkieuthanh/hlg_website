import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { LeadStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { defaultSettingValue, isSiteSettingKey, type SiteSettingKey } from "../site-settings";

type CollectionName = "projects" | "catalogue-categories" | "catalogue-products" | "news" | "capabilities" | "media";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [
      newLeads,
      draftProjects,
      publishedProjects,
      draftArticles,
      publishedArticles,
      products,
      capabilities,
      projectsMissingEn,
      articlesMissingEn,
      capabilitiesMissingEn
    ] = await Promise.all([
      this.prisma.contactLead.count({ where: { status: "new", deletedAt: null } }),
      this.prisma.project.count({ where: { status: "draft", deletedAt: null } }),
      this.prisma.project.count({ where: { status: "published", deletedAt: null } }),
      this.prisma.newsArticle.count({ where: { status: "draft", deletedAt: null } }),
      this.prisma.newsArticle.count({ where: { status: "published", deletedAt: null } }),
      this.prisma.catalogueProduct.count({ where: { deletedAt: null } }),
      this.prisma.capabilityItem.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { status: "published", enPublished: false, deletedAt: null } }),
      this.prisma.newsArticle.count({ where: { status: "published", enPublished: false, deletedAt: null } }),
      this.prisma.capabilityItem.count({ where: { status: "published", enPublished: false, deletedAt: null } })
    ]);
    return {
      newLeads,
      draftProjects,
      publishedProjects,
      draftArticles,
      publishedArticles,
      products,
      capabilities,
      missingEn: projectsMissingEn + articlesMissingEn + capabilitiesMissingEn
    };
  }

  listLeads(status?: LeadStatus) {
    return this.prisma.contactLead.findMany({
      where: { deletedAt: null, ...(status ? { status } : {}) },
      orderBy: { createdAt: "desc" }
    });
  }

  updateLeadStatus(id: string, status: LeadStatus) {
    return this.prisma.contactLead.update({ where: { id }, data: { status } });
  }

  async exportLeadsCsv() {
    const leads = await this.listLeads();
    const header = ["id", "createdAt", "status", "name", "email", "phone", "company", "message"];
    const rows = leads.map((lead) =>
      header.map((field) => this.csvCell(String((lead as unknown as Record<string, unknown>)[field] ?? ""))).join(",")
    );
    return [header.join(","), ...rows].join("\n");
  }

  list(collection: CollectionName) {
    const model = this.model(collection);
    return model.findMany({ where: { deletedAt: null }, orderBy: { createdAt: "desc" } });
  }

  get(collection: CollectionName, id: string) {
    const model = this.model(collection);
    return model.findFirst({ where: { id, deletedAt: null } });
  }

  async create(collection: CollectionName, data: Record<string, unknown>) {
    const model = this.model(collection);
    return model.create({ data });
  }

  async update(collection: CollectionName, id: string, data: Record<string, unknown>) {
    const model = this.model(collection);
    const existing = await this.get(collection, id);
    if (!existing) throw new NotFoundException("Record not found");
    return model.update({ where: { id }, data });
  }

  async softDelete(collection: CollectionName, id: string) {
    const model = this.model(collection);
    const existing = await this.get(collection, id);
    if (!existing) throw new NotFoundException("Record not found");
    return model.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getSetting(key: string) {
    const settingKey = this.settingKey(key);
    const setting = await this.prisma.siteSetting.findUnique({ where: { key: settingKey } });
    if (setting) return setting;
    return this.prisma.siteSetting.create({
      data: {
        key: settingKey,
        value: defaultSettingValue(settingKey) as Prisma.InputJsonValue
      }
    });
  }

  async updateSetting(key: string, value: unknown) {
    const settingKey = this.settingKey(key);
    return this.prisma.siteSetting.upsert({
      where: { key: settingKey },
      update: { value: value as Prisma.InputJsonValue },
      create: { key: settingKey, value: value as Prisma.InputJsonValue }
    });
  }

  private model(collection: CollectionName) {
    const models: Record<CollectionName, any> = {
      projects: this.prisma.project,
      "catalogue-categories": this.prisma.catalogueCategory,
      "catalogue-products": this.prisma.catalogueProduct,
      news: this.prisma.newsArticle,
      capabilities: this.prisma.capabilityItem,
      media: this.prisma.mediaAsset
    };
    const model = models[collection];
    if (!model) throw new BadRequestException("Unknown collection");
    return model;
  }

  private settingKey(key: string): SiteSettingKey {
    if (!isSiteSettingKey(key)) throw new BadRequestException("Unknown setting key");
    return key;
  }

  private csvCell(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
  }
}
