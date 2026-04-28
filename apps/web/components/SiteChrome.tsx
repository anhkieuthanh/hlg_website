import { Locale, withLocale } from "@hlg/shared";
import Link from "next/link";
import type { PublicSiteConfig } from "../lib/public-api";
import { Reveal, Stagger } from "./MotionPrimitives";
import { PageTransition } from "./PageTransition";
import { MobileNavToggle } from "./MobileNav";
import { BackToTop } from "./BackToTop";

export function SiteChrome({ locale, site, children }: { locale: Locale; site: PublicSiteConfig; children: React.ReactNode }) {
  const headerLinks = site.navigation.filter((item) => item.placement === "header").sort((a, b) => a.order - b.order);
  const capabilityLinks = site.navigation.filter((item) => item.placement === "footerCapabilities").sort((a, b) => a.order - b.order);
  const proofLinks = site.navigation.filter((item) => item.placement === "footerProof").sort((a, b) => a.order - b.order);
  const year = new Date().getFullYear();

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        {locale === "vi" ? "Chuyển đến nội dung chính" : "Skip to main content"}
      </a>
      <PageTransition locale={locale} />
      <header className="topbar">
        <nav className="nav" aria-label="Main navigation">
          <Link className="brand" href={withLocale(locale, "/")}>
            <img src={site.header.logoUrl} alt="Hoàng Long JSC" />
            <span>
              <small>{site.header.tagline}</small>
              {site.header.brandName}
            </span>
          </Link>
          <MobileNavToggle />
          <div className="nav-drawer">
            <div className="nav-links">
              {headerLinks.map((item) => (
                <Link key={item.id} href={linkHref(locale, item.href)}>
                  {item.label}
                </Link>
              ))}
            </div>
            {site.header.cta.enabled ? (
              <Link className="button nav-cta" href={linkHref(locale, site.header.cta.href)}>
                {site.header.cta.label}
              </Link>
            ) : null}
            <div className="locale-switch" aria-label="Language switcher">
              <Link className={locale === "vi" ? "active" : ""} href="/vi" aria-label="Tiếng Việt">
                <span aria-hidden="true">🇻🇳</span>
                <span className="sr-only">Tiếng Viet</span>
              </Link>
              <Link className={locale === "en" ? "active" : ""} href="/en" aria-label="English">
                <span aria-hidden="true">🇺🇸</span>
                <span className="sr-only">English</span>
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <div id="main-content">{children}</div>
      <BackToTop />
      <footer className="footer">
        <Stagger className="container footer-grid" y={14}>
          <div className="footer-brand">
            <img src={site.header.logoUrl} alt="Hoàng Long JSC" />
            <span>
              <strong>{site.header.brandName}</strong>
              <p>{site.footer.brandTagline}</p>
            </span>
          </div>
          <div className="footer-column">
            <h2>{site.footer.capabilitiesTitle}</h2>
            {capabilityLinks.map((item) => (
              <Link key={item.id} href={linkHref(locale, item.href)}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="footer-column">
            <h2>{site.footer.proofTitle}</h2>
            {proofLinks.map((item) => (
              <Link key={item.id} href={linkHref(locale, item.href)}>
                {item.label}
              </Link>
            ))}
            <p>{site.footer.pendingRecords}</p>
          </div>
          <div className="footer-contact">
            <h2>{site.footer.contactTitle}</h2>
            <p>{site.footer.contactCopy}</p>
            {site.footer.contactCta.enabled ? (
              <Link className="button" href={linkHref(locale, site.footer.contactCta.href)}>
                {site.footer.contactCta.label}
              </Link>
            ) : null}
          </div>
        </Stagger>
        <Reveal className="container footer-bottom" delay={0.12} y={10}>
          <span>
            © {year} {site.header.brandName}. {site.footer.copyright}
          </span>
        </Reveal>
      </footer>
    </div>
  );
}

function linkHref(locale: Locale, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  return withLocale(locale, href);
}
