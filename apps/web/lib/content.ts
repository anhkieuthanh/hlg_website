import {
  assertLocale,
  capabilityItems,
  catalogueCategories,
  catalogueProducts,
  companyStats,
  Locale,
  navigation,
  newsSeed,
  projectSeed,
  textFor
} from "@hlg/shared";

export const dictionary = {
  vi: {
    eyebrow: "Sản xuất và xây dựng B2B",
    heroTitle: "Hoàng Long Group",
    heroCopy:
      "Đối tác sản xuất, thi công và quản lý dự án công nghiệp với hệ thống năng lực được tổ chức cho khách hàng doanh nghiệp.",
    primaryCta: "Xem dự án tiêu biểu",
    secondaryCta: "Liên hệ",
    capabilitiesTitle: "Năng lực được tổ chức từ nhà máy đến công trường",
    capabilitiesCopy:
      "Website v1 ưu tiên chứng minh năng lực qua nhà máy, thiết bị, chứng chỉ, dự án thực tế và catalogue B2B.",
    projectsTitle: "Dự án tiêu biểu",
    projectsCopy: "Case study trình bày quy mô, vai trò, kết quả và bằng chứng triển khai.",
    catalogueTitle: "Catalogue B2B",
    catalogueCopy: "Danh mục sản phẩm và hạng mục thi công được quản trị song ngữ trong CMS.",
    newsTitle: "Tin tức và góc nhìn ngành",
    newsCopy: "Nội dung công ty và bài SEO phục vụ uy tín thương hiệu dài hạn.",
    contactTitle: "Liên hệ Hoàng Long Group",
    contactCopy: "Gửi thông tin để đội ngũ phụ trách phản hồi yêu cầu hợp tác hoặc dự án.",
    submit: "Gửi liên hệ",
    name: "Họ tên",
    email: "Email",
    phone: "Điện thoại",
    company: "Công ty",
    message: "Nội dung",
    readMore: "Xem chi tiết",
    location: "Địa điểm",
    year: "Năm",
    scale: "Quy mô",
    role: "Vai trò",
    result: "Kết quả"
  },
  en: {
    eyebrow: "B2B manufacturing and construction",
    heroTitle: "Hoang Long Group",
    heroCopy:
      "A manufacturing, construction, and industrial project partner with capabilities structured for enterprise customers.",
    primaryCta: "View signature projects",
    secondaryCta: "Contact",
    capabilitiesTitle: "Capabilities organized from factory to site",
    capabilitiesCopy:
      "The v1 website proves capability through factories, equipment, certificates, case studies, and a B2B catalogue.",
    projectsTitle: "Signature projects",
    projectsCopy: "Case studies present scale, role, outcomes, and delivery evidence.",
    catalogueTitle: "B2B catalogue",
    catalogueCopy: "Product and construction package data managed bilingually in the CMS.",
    newsTitle: "News and industry insight",
    newsCopy: "Company updates and SEO articles support long-term brand authority.",
    contactTitle: "Contact Hoang Long Group",
    contactCopy: "Send your details so the responsible team can respond to partnership or project needs.",
    submit: "Send inquiry",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    message: "Message",
    readMore: "Read more",
    location: "Location",
    year: "Year",
    scale: "Scale",
    role: "Role",
    result: "Result"
  }
};

export function getLocale(input?: string): Locale {
  return assertLocale(input);
}

export function t(locale: Locale, key: keyof (typeof dictionary)["vi"]) {
  return dictionary[locale][key];
}

export function localized(locale: Locale, value: { vi: string; en?: string }) {
  return textFor(locale, value);
}

export function contentFor(locale: Locale) {
  const visible = <T extends { status: string; enPublished: boolean }>(item: T) =>
    item.status === "published" && (locale === "vi" || item.enPublished);

  return {
    locale,
    nav: navigation,
    stats: companyStats,
    capabilities: capabilityItems.filter(visible),
    projects: projectSeed.filter(visible),
    catalogueCategories: catalogueCategories.filter(visible),
    catalogueProducts: catalogueProducts.filter(visible),
    news: newsSeed.filter(visible)
  };
}
