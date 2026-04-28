"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Children, useEffect, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const mounted = useMounted();
  const enabled = mounted && !reducedMotion;

  return (
    <motion.div
      className={className}
      initial={enabled ? { opacity: 0, y } : false}
      whileInView={enabled ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.45, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, delay = 0, y = 18 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const mounted = useMounted();
  const enabled = mounted && !reducedMotion;

  return (
    <motion.div
      className={className}
      initial={enabled ? "hidden" : false}
      whileInView={enabled ? "show" : undefined}
      viewport={{ once: true, amount: 0.14 }}
      variants={
        enabled
          ? {
              hidden: {},
              show: {
                transition: {
                  delayChildren: delay,
                  staggerChildren: 0.08
                }
              }
            }
          : undefined
      }
    >
      {motionChildren(children, y, enabled)}
    </motion.div>
  );
}

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

function motionChildren(children: ReactNode, y: number, enabled: boolean) {
  return Children.map(children, (child) => (
    <motion.div
      className="motion-item"
      variants={
        enabled
          ? {
              hidden: { opacity: 0, y },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
            }
          : undefined
      }
    >
      {child}
    </motion.div>
  ));
}
