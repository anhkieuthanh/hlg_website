import { Locale, navigation, withLocale } from "@hlg/shared";
import Link from "next/link";
import { localized, t } from "../lib/content";
import { Reveal, Stagger } from "./MotionPrimitives";
import { PageTransition } from "./PageTransition";

const capabilityFooterLinks = ["/manufacturing", "/capabilities", "/catalogue", "/construction"];
const proofFooterLinks = ["/projects", "/news"];

export function SiteChrome({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const capabilityLinks = navigation.filter((item) => capabilityFooterLinks.includes(item.href));
  const proofLinks = navigation.filter((item) => proofFooterLinks.includes(item.href));
  const year = new Date().getFullYear();

  return (
    <div className="site-shell">
      <PageTransition locale={locale} />
      <header className="topbar">
        <nav className="nav" aria-label="Main navigation">
          <Link className="brand" href={withLocale(locale, "/")}>
            <img src="/assets/hoang-long-logo.svg" alt="Hoàng Long JSC" />
            <span>
              <small>Manufacturing + Construction</small>
              Hoàng Long Group
            </span>
          </Link>
          <div className="nav-links">
            {navigation.map((item) => (
              <Link key={item.href} href={withLocale(locale, item.href)}>
                {localized(locale, item.label)}
              </Link>
            ))}
          </div>
          <div className="locale-switch" aria-label="Language switcher">
            <Link className={locale === "vi" ? "active" : ""} href="/vi" aria-label="Tiếng Việt">
              <span aria-hidden="true">🇻🇳</span>
              <span className="sr-only">Tiếng Việt</span>
            </Link>
            <Link className={locale === "en" ? "active" : ""} href="/en" aria-label="English">
              <span aria-hidden="true">🇺🇸</span>
              <span className="sr-only">English</span>
            </Link>
          </div>
        </nav>
      </header>
      {children}
      <footer className="footer">
        <Stagger className="container footer-grid" y={14}>
          <div className="footer-brand">
            <img src="/assets/hoang-long-logo.svg" alt="Hoàng Long JSC" />
            <span>
              <strong>Hoàng Long Group</strong>
              <p>{t(locale, "footerTagline")}</p>
            </span>
          </div>
          <div className="footer-column">
            <h2>{t(locale, "footerCapabilities")}</h2>
            {capabilityLinks.map((item) => (
              <Link key={item.href} href={withLocale(locale, item.href)}>
                {localized(locale, item.label)}
              </Link>
            ))}
          </div>
          <div className="footer-column">
            <h2>{t(locale, "footerProof")}</h2>
            {proofLinks.map((item) => (
              <Link key={item.href} href={withLocale(locale, item.href)}>
                {localized(locale, item.label)}
              </Link>
            ))}
            <p>{t(locale, "footerPendingRecords")}</p>
          </div>
          <div className="footer-contact">
            <h2>{t(locale, "footerContact")}</h2>
            <p>{t(locale, "footerContactCopy")}</p>
            <Link className="button" href={withLocale(locale, "/contact")}>
              {t(locale, "partnerCtaPrimary")}
            </Link>
          </div>
        </Stagger>
        <Reveal className="container footer-bottom" delay={0.12} y={10}>
          <span>© {year} Hoàng Long Group. {t(locale, "footerCopyright")}</span>
        </Reveal>
      </footer>
    </div>
  );
}
