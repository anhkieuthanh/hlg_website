"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject } from "react";
import type { Locale } from "@hlg/shared";

export function PageTransition({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [pending, setPending] = useState(false);
  const showTimer = useRef<number | null>(null);
  const fallbackTimer = useRef<number | null>(null);
  const routeKey = useMemo(() => pathname, [pathname]);

  useEffect(() => {
    clearTimers(showTimer, fallbackTimer);
    setPending(false);
  }, [routeKey]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!target || target.target || target.hasAttribute("download")) return;

      const url = new URL(target.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const current = `${window.location.pathname}${window.location.search}`;
      const next = `${url.pathname}${url.search}`;
      if (next === current || (url.hash && next === current)) return;

      clearTimers(showTimer, fallbackTimer);
      showTimer.current = window.setTimeout(() => setPending(true), 120);
      fallbackTimer.current = window.setTimeout(() => setPending(false), 8000);
    }

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearTimers(showTimer, fallbackTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {pending ? (
        <motion.div
          className="page-transition"
          aria-live="polite"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.18, ease: "easeOut" }}
        >
          <div className="page-transition-bar" />
          <motion.div
            className="page-transition-panel"
            initial={reducedMotion ? false : { opacity: 0, y: -8 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <span className="page-transition-mark" aria-hidden="true" />
            <span>{locale === "vi" ? "Đang mở trang" : "Opening page"}</span>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function clearTimers(...timers: Array<MutableRefObject<number | null>>) {
  timers.forEach((timer) => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  });
}
