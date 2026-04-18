export type Locale = "vi" | "en";

export const locales: Locale[] = ["vi", "en"];

export type Role = "SUPER_ADMIN" | "CONTENT_EDITOR" | "LEAD_MANAGER" | "VIEWER";

export const roles: Role[] = ["SUPER_ADMIN", "CONTENT_EDITOR", "LEAD_MANAGER", "VIEWER"];

export type PublishStatus = "draft" | "published" | "archived";
export type LeadStatus = "new" | "in_progress" | "resolved" | "archived";

export type LocalizedText = {
  vi: string;
  en?: string;
};

export type SeoFields = {
  title: LocalizedText;
  description: LocalizedText;
  image?: string;
};

export type MediaAsset = {
  id: string;
  url: string;
  alt: LocalizedText;
  type: "image" | "pdf";
};

export type Project = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  sector: LocalizedText;
  location: LocalizedText;
  year: number;
  scale: LocalizedText;
  role: LocalizedText;
  result: LocalizedText;
  featured: boolean;
  status: PublishStatus;
  enPublished: boolean;
  heroImage: string;
  gallery: MediaAsset[];
  seo: SeoFields;
};

export type CatalogueCategory = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  status: PublishStatus;
  enPublished: boolean;
};

export type CatalogueProduct = {
  id: string;
  slug: string;
  categoryId: string;
  name: LocalizedText;
  summary: LocalizedText;
  specs: Array<{ label: LocalizedText; value: LocalizedText }>;
  status: PublishStatus;
  enPublished: boolean;
  image: string;
  seo: SeoFields;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  category: LocalizedText;
  tags: string[];
  publishedAt: string;
  status: PublishStatus;
  enPublished: boolean;
  image: string;
  seo: SeoFields;
};

export type CapabilityItem = {
  id: string;
  type: "factory" | "equipment" | "certificate";
  title: LocalizedText;
  description: LocalizedText;
  metric?: LocalizedText;
  image: string;
  status: PublishStatus;
  enPublished: boolean;
};

export type ContactLead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
};

export const fallbackImage = "/assets/industrial-hero.png";

export const navigation = [
  { href: "/about", label: { vi: "Giới thiệu", en: "About" } },
  { href: "/manufacturing", label: { vi: "Sản xuất", en: "Manufacturing" } },
  { href: "/construction", label: { vi: "Xây dựng", en: "Construction" } },
  { href: "/capabilities", label: { vi: "Năng lực", en: "Capabilities" } },
  { href: "/projects", label: { vi: "Dự án", en: "Projects" } },
  { href: "/catalogue", label: { vi: "Catalogue", en: "Catalogue" } },
  { href: "/news", label: { vi: "Tin tức", en: "News" } },
  { href: "/contact", label: { vi: "Liên hệ", en: "Contact" } }
];

export const companyStats = [
  { value: "20+", label: { vi: "năm kinh nghiệm", en: "years of experience" } },
  { value: "120+", label: { vi: "dự án tiêu biểu", en: "signature projects" } },
  { value: "3", label: { vi: "cụm nhà máy", en: "factory clusters" } },
  { value: "ISO", label: { vi: "quy trình kiểm soát", en: "controlled processes" } }
];

export const capabilityItems: CapabilityItem[] = [
  {
    id: "factory-main",
    type: "factory",
    title: { vi: "Cụm nhà máy sản xuất kết cấu", en: "Structural fabrication complex" },
    description: {
      vi: "Không gian sản xuất được tổ chức theo luồng vật tư, gia công, kiểm tra chất lượng và đóng gói.",
      en: "Production space organized around material flow, fabrication, quality control, and packing."
    },
    metric: { vi: "Quản trị theo lô sản xuất", en: "Batch-based production control" },
    image: fallbackImage,
    status: "published",
    enPublished: true
  },
  {
    id: "equipment-cnc",
    type: "equipment",
    title: { vi: "Thiết bị gia công và lắp dựng", en: "Fabrication and erection equipment" },
    description: {
      vi: "Hệ thống máy cắt, hàn, nâng hạ và kiểm định hỗ trợ yêu cầu kỹ thuật của dự án B2B.",
      en: "Cutting, welding, lifting, and inspection equipment supports B2B technical requirements."
    },
    metric: { vi: "Theo dõi bảo trì định kỳ", en: "Scheduled maintenance tracking" },
    image: fallbackImage,
    status: "published",
    enPublished: true
  },
  {
    id: "certificate-iso",
    type: "certificate",
    title: { vi: "Chứng chỉ và hồ sơ năng lực", en: "Certificates and capability records" },
    description: {
      vi: "Hồ sơ chứng nhận, tiêu chuẩn thi công và quy trình an toàn được quản lý tập trung.",
      en: "Certifications, construction standards, and safety procedures are centrally managed."
    },
    metric: { vi: "Sẵn sàng cung cấp khi thẩm định", en: "Ready for partner due diligence" },
    image: fallbackImage,
    status: "published",
    enPublished: true
  }
];

export const projectSeed: Project[] = [
  {
    id: "project-industrial-plant",
    slug: "nha-may-cong-nghiep-mien-nam",
    title: { vi: "Nhà máy công nghiệp miền Nam", en: "Southern industrial plant" },
    excerpt: {
      vi: "Tổ hợp nhà xưởng và hạ tầng phụ trợ cho khách hàng sản xuất quy mô lớn.",
      en: "Factory complex and auxiliary infrastructure for a large-scale manufacturer."
    },
    body: {
      vi: "Hoàng Long Group đảm nhiệm phần kết cấu, phối hợp tiến độ sản xuất và thi công để bàn giao theo yêu cầu vận hành của khách hàng.",
      en: "Hoang Long Group handled structural works and coordinated fabrication with construction to meet operational handover needs."
    },
    sector: { vi: "Nhà xưởng công nghiệp", en: "Industrial factory" },
    location: { vi: "Miền Nam, Việt Nam", en: "Southern Vietnam" },
    year: 2025,
    scale: { vi: "42.000 m2", en: "42,000 sqm" },
    role: { vi: "Sản xuất và thi công", en: "Fabrication and construction" },
    result: { vi: "Bàn giao đúng tiến độ, kiểm soát chất lượng theo từng giai đoạn.", en: "Delivered on schedule with stage-based quality control." },
    featured: true,
    status: "published",
    enPublished: true,
    heroImage: fallbackImage,
    gallery: [],
    seo: {
      title: { vi: "Dự án nhà máy công nghiệp miền Nam", en: "Southern industrial plant project" },
      description: { vi: "Case study sản xuất và xây dựng nhà máy công nghiệp.", en: "Fabrication and construction case study for an industrial plant." }
    }
  },
  {
    id: "project-logistics-yard",
    slug: "ha-tang-kho-van-logistics",
    title: { vi: "Hạ tầng kho vận logistics", en: "Logistics yard infrastructure" },
    excerpt: {
      vi: "Dự án hạ tầng phục vụ vận hành kho bãi, luồng xe và khu vực kỹ thuật.",
      en: "Infrastructure project supporting warehousing, vehicle flows, and technical zones."
    },
    body: {
      vi: "Dự án tập trung vào độ bền vận hành, điều phối thi công theo từng khu vực và hạn chế gián đoạn hoạt động.",
      en: "The project prioritized operational durability, phased construction, and minimal disruption."
    },
    sector: { vi: "Hạ tầng logistics", en: "Logistics infrastructure" },
    location: { vi: "Đồng Nai", en: "Dong Nai" },
    year: 2024,
    scale: { vi: "18.000 m2", en: "18,000 sqm" },
    role: { vi: "Thi công hạ tầng", en: "Infrastructure contractor" },
    result: { vi: "Tối ưu luồng vận hành và mặt bằng khai thác.", en: "Improved operational flow and site utilization." },
    featured: true,
    status: "published",
    enPublished: true,
    heroImage: fallbackImage,
    gallery: [],
    seo: {
      title: { vi: "Dự án hạ tầng kho vận logistics", en: "Logistics yard infrastructure project" },
      description: { vi: "Case study thi công hạ tầng logistics.", en: "Case study for logistics infrastructure construction." }
    }
  }
];

export const catalogueCategories: CatalogueCategory[] = [
  {
    id: "cat-steel",
    slug: "ket-cau-thep",
    name: { vi: "Kết cấu thép", en: "Steel structures" },
    description: {
      vi: "Hạng mục kết cấu và cấu kiện phục vụ nhà xưởng, kho vận và công trình công nghiệp.",
      en: "Structural components for factories, logistics, and industrial projects."
    },
    status: "published",
    enPublished: true
  },
  {
    id: "cat-services",
    slug: "hang-muc-thi-cong",
    name: { vi: "Hạng mục thi công", en: "Construction packages" },
    description: {
      vi: "Các gói thi công hạ tầng, hoàn thiện và phối hợp triển khai công trường.",
      en: "Infrastructure, finishing, and site coordination packages."
    },
    status: "published",
    enPublished: true
  }
];

export const catalogueProducts: CatalogueProduct[] = [
  {
    id: "prod-frame",
    slug: "khung-thep-nha-xuong",
    categoryId: "cat-steel",
    name: { vi: "Khung thép nhà xưởng", en: "Factory steel frame" },
    summary: {
      vi: "Cấu kiện sản xuất theo bản vẽ kỹ thuật và yêu cầu tải trọng dự án.",
      en: "Components fabricated from technical drawings and project load requirements."
    },
    specs: [
      { label: { vi: "Ứng dụng", en: "Application" }, value: { vi: "Nhà xưởng, kho, mái che", en: "Factories, warehouses, canopies" } },
      { label: { vi: "Hồ sơ", en: "Documentation" }, value: { vi: "Bản vẽ, QC, nghiệm thu", en: "Drawings, QC, handover records" } }
    ],
    status: "published",
    enPublished: true,
    image: fallbackImage,
    seo: {
      title: { vi: "Khung thép nhà xưởng", en: "Factory steel frame" },
      description: { vi: "Catalogue B2B cho khung thép nhà xưởng.", en: "B2B catalogue item for factory steel frames." }
    }
  },
  {
    id: "prod-site-infra",
    slug: "thi-cong-ha-tang-cong-truong",
    categoryId: "cat-services",
    name: { vi: "Thi công hạ tầng công trường", en: "Site infrastructure works" },
    summary: {
      vi: "Gói thi công nền, đường nội bộ, thoát nước và hạ tầng phụ trợ.",
      en: "Works package for ground, internal roads, drainage, and auxiliary infrastructure."
    },
    specs: [
      { label: { vi: "Phạm vi", en: "Scope" }, value: { vi: "Theo hồ sơ thiết kế", en: "Based on design documents" } },
      { label: { vi: "Quản lý", en: "Management" }, value: { vi: "Tiến độ, an toàn, chất lượng", en: "Schedule, safety, quality" } }
    ],
    status: "published",
    enPublished: true,
    image: fallbackImage,
    seo: {
      title: { vi: "Thi công hạ tầng công trường", en: "Site infrastructure works" },
      description: { vi: "Gói thi công hạ tầng cho dự án công nghiệp.", en: "Infrastructure works package for industrial projects." }
    }
  }
];

export const newsSeed: NewsArticle[] = [
  {
    id: "news-quality-control",
    slug: "kiem-soat-chat-luong-trong-san-xuat",
    title: { vi: "Kiểm soát chất lượng trong sản xuất kết cấu", en: "Quality control in structural fabrication" },
    excerpt: {
      vi: "Các điểm kiểm soát giúp dự án công nghiệp giữ đúng thông số, tiến độ và hồ sơ nghiệm thu.",
      en: "Control points that help industrial projects maintain specifications, schedule, and handover records."
    },
    body: {
      vi: "Một quy trình sản xuất B2B hiệu quả cần kết nối bản vẽ, vật tư, gia công, kiểm tra, đóng gói và bàn giao theo từng lô.",
      en: "An effective B2B production workflow connects drawings, materials, fabrication, inspection, packing, and handover by batch."
    },
    category: { vi: "Kiến thức ngành", en: "Industry insight" },
    tags: ["quality", "manufacturing"],
    publishedAt: "2026-01-15T00:00:00.000Z",
    status: "published",
    enPublished: true,
    image: fallbackImage,
    seo: {
      title: { vi: "Kiểm soát chất lượng trong sản xuất kết cấu", en: "Quality control in structural fabrication" },
      description: { vi: "Bài viết SEO về QC trong sản xuất công nghiệp.", en: "SEO article about QC in industrial fabrication." }
    }
  }
];

export function textFor(locale: Locale, value: LocalizedText): string {
  if (locale === "en") return value.en || "";
  return value.vi;
}

export function isVisibleInLocale(locale: Locale, status: PublishStatus, enPublished: boolean): boolean {
  if (status !== "published") return false;
  return locale === "vi" || enPublished;
}

export function withLocale(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

export function assertLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "vi";
}
