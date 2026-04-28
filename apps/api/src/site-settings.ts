import { navigation, textFor, type Locale } from "@hlg/shared";

export const SITE_SETTING_KEYS = ["site.header", "site.footer", "site.navigation"] as const;
export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

type LocalizedText = {
  vi: string;
  en?: string;
};

export type HeaderSettings = {
  logoUrl: string;
  brandName: LocalizedText;
  tagline: LocalizedText;
  cta: {
    enabled: boolean;
    href: string;
    label: LocalizedText;
  };
};

export type FooterSettings = {
  brandTagline: LocalizedText;
  capabilitiesTitle: LocalizedText;
  proofTitle: LocalizedText;
  contactTitle: LocalizedText;
  contactCopy: LocalizedText;
  pendingRecords: LocalizedText;
  copyright: LocalizedText;
  contactCta: {
    enabled: boolean;
    href: string;
    label: LocalizedText;
  };
};

export type NavigationSettingsItem = {
  id: string;
  href: string;
  placement: "header" | "footerCapabilities" | "footerProof";
  order: number;
  enabled: boolean;
  label: LocalizedText;
};

export const defaultHeaderSettings: HeaderSettings = {
  logoUrl: "/assets/hoang-long-logo.svg",
  brandName: { vi: "Hoàng Long Group", en: "Hoang Long Group" },
  tagline: { vi: "Manufacturing + Construction", en: "Manufacturing + Construction" },
  cta: {
    enabled: false,
    href: "/contact",
    label: { vi: "Liên hệ hợp tác", en: "Partner with us" }
  }
};

export const defaultFooterSettings: FooterSettings = {
  brandTagline: {
    vi: "Hồ sơ năng lực sản xuất kết cấu và phối hợp thi công công nghiệp cho đối tác B2B.",
    en: "A structural fabrication and industrial construction coordination capability profile for B2B partners."
  },
  capabilitiesTitle: { vi: "Năng lực chính", en: "Core capabilities" },
  proofTitle: { vi: "Bằng chứng", en: "Proof" },
  contactTitle: { vi: "Liên hệ hợp tác", en: "Partner inquiry" },
  contactCopy: {
    vi: "Gửi hạng mục, bản vẽ, tiêu chuẩn kỹ thuật hoặc nhu cầu phối hợp để đội ngũ phụ trách phản hồi bước tiếp theo.",
    en: "Send the work package, drawings, technical standards, or cooperation need so the responsible team can respond with next steps."
  },
  pendingRecords: {
    vi: "Hồ sơ, chứng chỉ và thông tin pháp lý sẽ được cập nhật khi dữ liệu chính thức được xác nhận.",
    en: "Records, certificates, and legal information will be updated once official data is confirmed."
  },
  copyright: { vi: "Tất cả quyền được bảo lưu.", en: "All rights reserved." },
  contactCta: {
    enabled: true,
    href: "/contact",
    label: { vi: "Liên hệ hợp tác", en: "Partner with us" }
  }
};

export const defaultNavigationSettings: NavigationSettingsItem[] = [
  ...navigation.map((item, index) => ({
    id: `header-${item.href.replace(/\W+/g, "-").replace(/^-|-$/g, "") || "home"}`,
    href: item.href,
    placement: "header" as const,
    order: index + 1,
    enabled: true,
    label: item.label
  })),
  ...["/manufacturing", "/capabilities", "/catalogue", "/construction"].map((href, index) => {
    const item = navigation.find((entry) => entry.href === href)!;
    return {
      id: `footer-capabilities-${href.replace(/\W+/g, "-").replace(/^-|-$/g, "")}`,
      href,
      placement: "footerCapabilities" as const,
      order: index + 1,
      enabled: true,
      label: item.label
    };
  }),
  ...["/projects", "/news"].map((href, index) => {
    const item = navigation.find((entry) => entry.href === href)!;
    return {
      id: `footer-proof-${href.replace(/\W+/g, "-").replace(/^-|-$/g, "")}`,
      href,
      placement: "footerProof" as const,
      order: index + 1,
      enabled: true,
      label: item.label
    };
  })
];

export function defaultSettingValue(key: SiteSettingKey) {
  if (key === "site.header") return defaultHeaderSettings;
  if (key === "site.footer") return defaultFooterSettings;
  return defaultNavigationSettings;
}

export function isSiteSettingKey(input: string): input is SiteSettingKey {
  return SITE_SETTING_KEYS.includes(input as SiteSettingKey);
}

export function localizeText(locale: Locale, value: LocalizedText | undefined, fallback = "") {
  if (!value) return fallback;
  return textFor(locale, value) || fallback;
}

export function normalizeNavigationItems(input: unknown): NavigationSettingsItem[] {
  if (!Array.isArray(input)) return defaultNavigationSettings;
  return input
    .map((item, index) => {
      const record = item as Partial<NavigationSettingsItem>;
      const placement: NavigationSettingsItem["placement"] =
        record.placement === "footerCapabilities" || record.placement === "footerProof" ? record.placement : "header";
      return {
        id: String(record.id || `menu-${index + 1}`),
        href: String(record.href || "/"),
        placement,
        order: Number.isFinite(Number(record.order)) ? Number(record.order) : index + 1,
        enabled: record.enabled !== false,
        label: {
          vi: String(record.label?.vi || "Menu"),
          en: record.label?.en ? String(record.label.en) : undefined
        }
      };
    })
    .sort((a, b) => a.order - b.order);
}
