import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoàng Long Group Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
