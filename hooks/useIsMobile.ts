"use client";

import { useState, useEffect } from "react";

/**
 * useIsMobile — shared hook for responsive breakpoints
 * Avoids duplicating resize listeners across every component.
 *
 * Usage:
 *   const isMobile = useIsMobile();          // default breakpoint 768px
 *   const isSmall  = useIsMobile(480);       // custom breakpoint
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Safe SSR default — assume desktop, hydrate on mount
    if (typeof window === "undefined") return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    // Use matchMedia for efficient, single listener (no polling)
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Set initial value accurately after mount
    setIsMobile(mq.matches);

    // Modern API
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}