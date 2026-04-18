import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  capabilityItems,
  catalogueCategories,
  catalogueProducts,
  newsSeed,
  projectSeed
} from "@hlg/shared";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@hoanglong.local";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const totpSecret =
    process.env.ADMIN_TOTP_SECRET === undefined ? "JBSWY3DPEHPK3PXP" : process.env.ADMIN_TOTP_SECRET || null;
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.SUPER_ADMIN,
      totpSecret,
      isActive: true
    },
    create: {
      email,
      name: "Hoang Long Admin",
      passwordHash,
      role: Role.SUPER_ADMIN,
      totpSecret
    }
  });

  for (const item of capabilityItems) {
    await prisma.capabilityItem.upsert({
      where: { id: item.id },
      update: item,
      create: item
    });
  }

  for (const project of projectSeed) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project
    });
  }

  for (const category of catalogueCategories) {
    await prisma.catalogueCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const product of catalogueProducts) {
    await prisma.catalogueProduct.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  for (const article of newsSeed) {
    await prisma.newsArticle.upsert({
      where: { slug: article.slug },
      update: { ...article, publishedAt: new Date(article.publishedAt) },
      create: { ...article, publishedAt: new Date(article.publishedAt) }
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "brand" },
    update: {
      value: {
        name: "Hoang Long Group",
        displayName: "Hoàng Long Group",
        primaryCta: { vi: "Xem dự án tiêu biểu", en: "View signature projects" }
      }
    },
    create: {
      key: "brand",
      value: {
        name: "Hoang Long Group",
        displayName: "Hoàng Long Group",
        primaryCta: { vi: "Xem dự án tiêu biểu", en: "View signature projects" }
      }
    }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
