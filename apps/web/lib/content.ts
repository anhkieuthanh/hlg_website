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
    eyebrow: "Năng lực sản xuất kết cấu",
    heroTitle: "Hoàng Long Group",
    heroCopy:
      "Đối tác sản xuất kết cấu và phối hợp thi công công nghiệp cho các đội dự án, tổng thầu và đơn vị cần năng lực gia công có kiểm soát.",
    primaryCta: "Liên hệ hợp tác",
    secondaryCta: "Xem năng lực sản xuất",
    capabilitiesTitle: "Bằng chứng năng lực từ nhà máy, thiết bị đến hồ sơ kiểm soát",
    capabilitiesCopy:
      "Các khối năng lực được trình bày theo cách đối tác có thể kiểm tra: không gian sản xuất, thiết bị, quy trình lô và hồ sơ bàn giao.",
    projectsTitle: "Dự án tiêu biểu",
    projectsCopy: "Case study nhấn vai trò Hoàng Long, quy mô, kết quả và cách phối hợp triển khai.",
    catalogueTitle: "Hạng mục có thể hợp tác",
    catalogueCopy: "Các cấu kiện và gói công việc được mô tả như năng lực nhận phối hợp, không phải danh mục bán lẻ.",
    newsTitle: "Tin tức và góc nhìn ngành",
    newsCopy: "Nội dung công ty và bài SEO phục vụ uy tín thương hiệu dài hạn.",
    contactTitle: "Liên hệ hợp tác năng lực",
    contactCopy: "Gửi thông tin hạng mục, bản vẽ hoặc nhu cầu phối hợp để đội ngũ phụ trách phản hồi bước tiếp theo.",
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
    result: "Kết quả",
    proofTitle: "Luồng kiểm soát đối tác có thể thẩm định",
    proofCopy: "Từ bản vẽ, vật tư, gia công, QC đến bàn giao, mỗi bước đều cần có đầu mối và hồ sơ rõ ràng.",
    manufacturingTitle: "Nhà máy và thiết bị là trọng tâm chứng minh năng lực",
    manufacturingCopy: "Trang này ưu tiên các năng lực giúp đối tác đánh giá khả năng gia công, lắp dựng và kiểm soát lô sản xuất.",
    partnerCtaTitle: "Trao đổi năng lực cho hạng mục của bạn",
    partnerCtaCopy: "Gửi thông tin sơ bộ để Hoàng Long phản hồi phạm vi có thể phối hợp, hồ sơ cần chuẩn bị và đầu mối làm việc.",
    partnerCtaPrimary: "Liên hệ hợp tác",
    partnerCtaSecondary: "Xem năng lực",
    footerTagline: "Hồ sơ năng lực sản xuất kết cấu và phối hợp thi công công nghiệp cho đối tác B2B.",
    footerCapabilities: "Năng lực chính",
    footerProof: "Bằng chứng",
    footerContact: "Liên hệ hợp tác",
    footerContactCopy: "Gửi hạng mục, bản vẽ, tiêu chuẩn kỹ thuật hoặc nhu cầu phối hợp để đội ngũ phụ trách phản hồi bước tiếp theo.",
    footerPendingRecords: "Hồ sơ, chứng chỉ và thông tin pháp lý sẽ được cập nhật khi dữ liệu chính thức được xác nhận.",
    footerCopyright: "Tất cả quyền được bảo lưu."
  },
  en: {
    eyebrow: "Structural fabrication capability",
    heroTitle: "Hoang Long Group",
    heroCopy:
      "A structural fabrication and industrial construction coordination partner for project teams, main contractors, and companies that need controlled production capacity.",
    primaryCta: "Partner with us",
    secondaryCta: "View manufacturing capability",
    capabilitiesTitle: "Capability proof across factory, equipment, and control records",
    capabilitiesCopy:
      "Capabilities are framed for partner review: production space, equipment, batch control, and handover records.",
    projectsTitle: "Signature projects",
    projectsCopy: "Case studies emphasize Hoang Long's role, scale, outcomes, and delivery coordination.",
    catalogueTitle: "Cooperation scopes",
    catalogueCopy: "Components and work packages are presented as cooperation capabilities, not a retail product catalogue.",
    newsTitle: "News and industry insight",
    newsCopy: "Company updates and SEO articles support long-term brand authority.",
    contactTitle: "Discuss capability cooperation",
    contactCopy: "Send the scope, drawings, or cooperation need so the responsible team can respond with next steps.",
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
    result: "Result",
    proofTitle: "A control flow partners can review",
    proofCopy: "From drawings, materials, fabrication, QC, to handover, each stage needs clear ownership and records.",
    manufacturingTitle: "Factory and equipment are the core capability proof",
    manufacturingCopy: "This page focuses on capabilities that help partners assess fabrication, erection, and batch control readiness.",
    partnerCtaTitle: "Discuss capability for your work package",
    partnerCtaCopy: "Send the initial scope so Hoang Long can respond on fit, required records, and working contacts.",
    partnerCtaPrimary: "Partner with us",
    partnerCtaSecondary: "View capabilities",
    footerTagline: "A structural fabrication and industrial construction coordination capability profile for B2B partners.",
    footerCapabilities: "Core capabilities",
    footerProof: "Proof",
    footerContact: "Partner inquiry",
    footerContactCopy: "Send the work package, drawings, technical standards, or cooperation need so the responsible team can respond with next steps.",
    footerPendingRecords: "Records, certificates, and legal information will be updated once official data is confirmed.",
    footerCopyright: "All rights reserved."
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
