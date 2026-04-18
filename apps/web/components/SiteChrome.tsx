import { Locale, navigation, withLocale } from "@hlg/shared";
import Link from "next/link";
import { localized } from "../lib/content";

export function SiteChrome({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <header className="topbar">
        <nav className="nav" aria-label="Main navigation">
          <Link className="brand" href={withLocale(locale, "/")}>
            <span>Manufacturing + Construction</span>
            Hoàng Long Group
          </Link>
          <div className="nav-links">
            {navigation.map((item) => (
              <Link key={item.href} href={withLocale(locale, item.href)}>
                {localized(locale, item.label)}
              </Link>
            ))}
          </div>
          <div className="locale-switch" aria-label="Language switcher">
            <Link className={locale === "vi" ? "active" : ""} href="/vi">
              VI
            </Link>
            <Link className={locale === "en" ? "active" : ""} href="/en">
              EN
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="footer">
        <div className="container">
          <strong>Hoàng Long Group</strong>
          <p>Manufacturing, construction and B2B industrial capability platform.</p>
        </div>
      </footer>
    </div>
  );
}
