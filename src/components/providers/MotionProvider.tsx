"use client";

import { MotionConfig } from "framer-motion";

/** Makes every Framer Motion animation honor prefers-reduced-motion. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
