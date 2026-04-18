import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hoàng Long Group",
  description: "Corporate B2B website for manufacturing and construction capabilities."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
