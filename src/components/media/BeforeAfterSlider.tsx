"use client";

import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import type { BeforeAfterPair } from "@/types";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { cn } from "@/lib/utils";

/**
 * Signature interactive before/after comparison. Mouse-drag and
 * touch-drag on desktop/mobile, arrow-key adjustable when the handle is
 * focused (keyboard-operable per spec section 6), clamped 0-100.
 */
export function BeforeAfterSlider({
  pair,
  className,
}: {
  pair: BeforeAfterPair;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reward moment: when the wipe is pushed to either extreme, the handle
  // shifts from lime (interaction) to gold (completion/achievement).
  const atFullReveal = position <= 3 || position >= 97;

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div className={cn("select-none", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full touch-none overflow-hidden rounded-2xl sm:aspect-video"
        onMouseDown={(e) => {
          setDragging(true);
          updateFromClientX(e.clientX);
        }}
        onMouseMove={(e) => dragging && updateFromClientX(e.clientX)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => {
          setDragging(true);
          updateFromClientX(e.touches[0].clientX);
        }}
        onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
        onTouchEnd={() => setDragging(false)}
      >
        {/* AFTER — full width base layer */}
        <div className="absolute inset-0">
          <PlaceholderMedia asset={pair.after} sizes="(min-width: 640px) 60vw, 100vw" />
          <span className="absolute right-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            After
          </span>
        </div>

        {/* BEFORE — clipped layer */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <PlaceholderMedia asset={pair.before} sizes="(min-width: 640px) 60vw, 100vw" />
          <span className="absolute left-4 top-4 rounded-full bg-ink-950/70 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            Before
          </span>
        </div>

        {/* Handle */}
        <div
          className={cn(
            "absolute inset-y-0 z-10 w-0.5 transition-colors duration-300",
            atFullReveal ? "bg-gold-400/90" : "bg-white/90",
          )}
          style={{ left: `${position}%` }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="Before and after comparison position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
              if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
            }}
            className={cn(
              "absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-white shadow-lg ring-4 transition-all duration-300 focus-visible:ring-lime-400 motion-safe:duration-300",
              atFullReveal
                ? "text-gold-600 ring-gold-400/70 shadow-[0_0_24px_-2px_rgba(233,189,82,0.7)] motion-safe:scale-110"
                : "text-ink-950 ring-white/30",
            )}
          >
            <ChevronsLeftRight className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-lg font-semibold uppercase tracking-tight text-white">
          {pair.title}
        </p>
        <p className="text-sm text-steel-400">{pair.vehicle}</p>
      </div>
    </div>
  );
}
