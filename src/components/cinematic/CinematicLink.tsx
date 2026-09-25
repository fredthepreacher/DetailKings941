"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CINEMATIC_ENABLED } from "@/lib/cinematic/flag";
import { cinematicStore, preloadOverlay, type CinematicSource } from "@/lib/cinematic/store";
import { track } from "@/lib/analytics";

/**
 * A "doorway": a link that, with the cinematic flag on, opens the Build My
 * Detail experience by travelling *into* this exact element. With the flag
 * off it is a plain link to the conventional /contact quote page.
 *
 * It stays a real <a href> either way — middle-click, cmd/ctrl-click, and
 * no-JS all behave like a normal website.
 */
export function CinematicLink({
  service,
  tone = "ink",
  label,
  icon,
  className,
  children,
}: {
  service?: string;
  tone?: CinematicSource["tone"];
  label: string;
  icon?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const query = service ? `?service=${encodeURIComponent(service)}` : "";

  // Approaching the doorway is intent: preload the overlay module once the
  // link is within ~one screen of the viewport.
  useEffect(() => {
    if (!CINEMATIC_ENABLED) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          preloadOverlay();
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!CINEMATIC_ENABLED) {
    return (
      <Link href={`/contact${query}`} className={className}>
        {children}
      </Link>
    );
  }

  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab / new-window intents natively.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    cinematicStore.begin({ el: e.currentTarget, tone, label, icon }, service ?? null);
    track("cinematic_transition_started", { doorway: "build-my-detail", service: service ?? null });
    if (service) track("service_selected", { service, source: "build-my-detail" });
  };

  return (
    <Link
      ref={ref}
      href={`/build-my-detail${query}`}
      scroll={false}
      onClick={onClick}
      onPointerEnter={preloadOverlay}
      onFocus={preloadOverlay}
      onTouchStart={preloadOverlay}
      data-cinematic-doorway=""
      className={className}
    >
      {children}
    </Link>
  );
}
