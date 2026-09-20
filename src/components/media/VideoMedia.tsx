"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import type { VideoAsset } from "@/types";
import { cn } from "@/lib/utils";

/** Subscribe to a media query without setState-in-effect churn (SSR-safe). */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Autoplaying, muted, looping background video that behaves itself:
 *  - honors prefers-reduced-motion (renders the poster still, never plays)
 *  - lazy: below-the-fold clips only fetch their source once near the viewport
 *  - viewport-aware: pauses when scrolled out of view, resumes when back
 *  - responsive source: swaps to a lighter mobile derivative when one exists
 *
 * `priority` marks the hero: it loads eagerly and autoplays immediately.
 * Everything else defers until an IntersectionObserver says it's close.
 */
export function VideoMedia({
  asset,
  className,
  objectClassName,
  priority = false,
}: {
  asset: VideoAsset;
  className?: string;
  /** extra classes on the <video>/<img> element, e.g. object-position */
  objectClassName?: string;
  priority?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const src = isMobile && asset.srcMobile ? asset.srcMobile : asset.src;

  const [inView, setInView] = useState(priority);
  const [canLoad, setCanLoad] = useState(priority);

  // Lazy load + track viewport visibility (setState here fires from an
  // external observer callback, not synchronously inside the effect body).
  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setCanLoad(true);
      },
      { threshold: 0.2, rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  // Drive playback from visibility, once a source is attached.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reducedMotion) return;
    if (inView && canLoad) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, canLoad, reducedMotion, src]);

  if (reducedMotion) {
    return (
      <div
        ref={containerRef}
        className={cn("relative h-full w-full overflow-hidden", className)}
      >
        <Image
          src={asset.poster}
          alt={asset.alt}
          fill
          sizes="100vw"
          priority={priority}
          className={cn("object-cover", objectClassName)}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
    >
      <video
        ref={videoRef}
        className={cn("h-full w-full object-cover", objectClassName)}
        poster={asset.poster}
        muted
        loop
        playsInline
        autoPlay={priority}
        preload={priority ? "auto" : "none"}
        aria-label={asset.alt}
        {...(canLoad ? { src } : {})}
      />
    </div>
  );
}
