"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Live `prefers-reduced-motion: reduce` subscription. SSR-safe: the server
 * snapshot is `false` (full motion) so markup is stable; the real value is
 * read on the client after hydration. Mirrors the local hook in Reveal.tsx so
 * cinematic code has a shared, reusable source of truth.
 */
export function useReducedMotion(): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
