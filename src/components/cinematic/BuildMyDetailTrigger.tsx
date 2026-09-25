"use client";

import Link from "next/link";
import { type MouseEvent, type ReactNode } from "react";
import { cinematicEnabled } from "@/lib/flags";
import { useCinematic } from "./CinematicContext";

/**
 * Renders as a real link to the quote page, so it works with no JS, before the
 * cinematic chunk has loaded, and when the flag is off. When cinematic mode is
 * enabled it intercepts a plain left-click and opens the in-place experience
 * anchored to this exact element; the chunk is warmed on hover/focus.
 */
export function BuildMyDetailTrigger({
  href,
  service,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  href: string;
  service?: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const { open, preload } = useCinematic();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle modified clicks (new tab/window) and non-primary buttons.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    if (!cinematicEnabled()) return; // fall through to normal navigation
    e.preventDefault();
    open(e.currentTarget, { service, href });
  };

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
      onPointerEnter={preload}
      onFocus={preload}
    >
      {children}
    </Link>
  );
}
