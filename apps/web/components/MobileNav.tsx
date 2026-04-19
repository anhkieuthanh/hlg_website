"use client";

import { Locale, withLocale } from "@hlg/shared";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicSiteConfig } from "../lib/public-api";

export function MobileNav({
  locale,
  links,
  cta
}: {
  locale: Locale;
  links: PublicSiteConfig["navigation"];
  cta: PublicSiteConfig["header"]["cta"];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="mobile-nav">
      <button
        className="mobile-menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span className="sr-only">{locale === "vi" ? "Mở menu" : "Open menu"}</span>
      </button>
      <div className={open ? "mobile-menu open" : "mobile-menu"} id="mobile-menu-panel">
        {links.map((item) => (
          <Link key={item.id} href={linkHref(locale, item.href)} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        {cta.enabled ? (
          <Link className="button" href={linkHref(locale, cta.href)} onClick={() => setOpen(false)}>
            {cta.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function linkHref(locale: Locale, href: string) {
  if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return href;
  return withLocale(locale, href);
}
