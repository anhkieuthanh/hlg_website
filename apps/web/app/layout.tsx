import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter"
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hoanglonggroup.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hoang Long Group — Structural Fabrication & Industrial Construction",
    template: "%s | Hoang Long Group"
  },
  description:
    "Hoang Long Group is a B2B structural fabrication and industrial construction partner with 20+ years of experience, 120+ projects, and 3 factory clusters.",
  openGraph: {
    type: "website",
    siteName: "Hoang Long Group",
    locale: "vi_VN",
    alternateLocale: "en_US",
    images: [{ url: "/assets/industrial-hero.png", width: 1200, height: 630, alt: "Hoang Long Group" }]
  },
  twitter: {
    card: "summary_large_image"
  },
  alternates: {
    languages: {
      vi: "/vi",
      en: "/en"
    }
  },
  icons: {
    icon: "/assets/hoang-long-logo.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#11539a"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
