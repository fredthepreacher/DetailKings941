"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate } from "framer-motion";
import { X } from "lucide-react";
import { QuoteFlow } from "@/components/forms/QuoteFlow";

export type OriginRect = { top: number; left: number; width: number; height: number; radius: number };
export type DeviceTier = "full" | "lite";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The Build My Detail cinematic surface. Rendered in a portal at document.body
 * level (outside the receding page shell). The visible frame is a single
 * transform-animated "surface" layer that scales out of / collapses back into
 * the originating CTA (a shared-element FLIP); the form content cross-fades on
 * top so text is never distorted by the scale. Fully imperative so the reverse
 * transition is a true mirror of the forward one, toward the exact origin.
 */
export default function CinematicOverlay({
  origin,
  service,
  reduced,
  tier,
  closing,
  onClosed,
  onRequestClose,
}: {
  origin: OriginRect | null;
  service?: string;
  reduced: boolean;
  tier: DeviceTier;
  closing: boolean;
  onClosed: () => void;
  onRequestClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef(false);

  const radiusEnd = () =>
    typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches ? 24 : 0;

  // ---- Enter animation (runs once on mount) --------------------------------
  useLayoutEffect(() => {
    const backdrop = backdropRef.current;
    const surface = surfaceRef.current;
    const content = contentRef.current;
    const panel = panelRef.current;
    if (!backdrop || !surface || !content || !panel) return;

    const controls = [
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.35, ease: "linear" }),
    ];

    if (reduced || !origin) {
      // Restrained: no camera travel, just a soft fade-in.
      controls.push(animate(surface, { opacity: [0, 1] }, { duration: 0.2 }));
      controls.push(animate(content, { opacity: [0, 1] }, { duration: 0.2 }));
    } else {
      const t = panel.getBoundingClientRect();
      const sx = origin.width / t.width;
      const sy = origin.height / t.height;
      const dx = origin.left - t.left;
      const dy = origin.top - t.top;
      surface.style.transformOrigin = "0 0";
      controls.push(
        animate(
          surface,
          {
            x: [dx, 0],
            y: [dy, 0],
            scaleX: [sx, 1],
            scaleY: [sy, 1],
            borderRadius: [999, radiusEnd()],
            opacity: [0.65, 1],
          },
          { duration: tier === "lite" ? 0.44 : 0.52, ease: EASE },
        ),
      );
      controls.push(
        animate(
          content,
          { opacity: [0, 1], y: [14, 0] },
          { duration: 0.4, delay: 0.14, ease: EASE },
        ),
      );
    }

    return () => controls.forEach((c) => c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Reverse animation (mirror of enter), then unmount -------------------
  useEffect(() => {
    if (!closing || closedRef.current) return;
    closedRef.current = true;

    const backdrop = backdropRef.current;
    const surface = surfaceRef.current;
    const content = contentRef.current;
    const panel = panelRef.current;

    const finish = () => onClosed();

    if (!backdrop || !surface || !content || !panel) return finish();

    if (reduced || !origin) {
      animate(backdrop, { opacity: 0 }, { duration: 0.2 });
      animate(content, { opacity: 0 }, { duration: 0.16 });
      const s = animate(surface, { opacity: 0 }, { duration: 0.2 });
      s.finished.then(finish).catch(finish);
      return;
    }

    // Recompute the target frame at close time (viewport may have changed).
    const t = panel.getBoundingClientRect();
    const sx = origin.width / t.width;
    const sy = origin.height / t.height;
    const dx = origin.left - t.left;
    const dy = origin.top - t.top;
    surface.style.transformOrigin = "0 0";

    animate(backdrop, { opacity: 0 }, { duration: 0.34, ease: "linear" });
    animate(content, { opacity: 0, y: 8 }, { duration: 0.18, ease: "linear" });
    const s = animate(
      surface,
      {
        x: [0, dx],
        y: [0, dy],
        scaleX: [1, sx],
        scaleY: [1, sy],
        borderRadius: [radiusEnd(), 999],
        opacity: [1, 0.6],
      },
      { duration: tier === "lite" ? 0.4 : 0.46, ease: EASE },
    );
    s.finished.then(finish).catch(finish);
  }, [closing, origin, reduced, tier, onClosed]);

  // ---- Escape + focus trap + initial focus ---------------------------------
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // Move focus into the dialog without yanking the mobile keyboard open.
    panel.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onRequestClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeEl = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (activeEl === first || activeEl === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onRequestClose]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100]">
      <div
        ref={backdropRef}
        aria-hidden
        onClick={onRequestClose}
        className="absolute inset-0 bg-black/75"
        style={{ opacity: 0 }}
      />
      <div className="absolute inset-0 flex items-stretch justify-center overflow-y-auto overscroll-contain sm:items-start sm:p-6">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cinematic-title"
          tabIndex={-1}
          className="relative flex min-h-full w-full max-w-2xl flex-col outline-none sm:my-auto sm:min-h-0"
        >
          {/* Animated surface — the only layer that scales (no text to distort). */}
          <div
            ref={surfaceRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 border border-white/10 bg-ink-900 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.85)] sm:rounded-3xl"
          />
          {/* Content — cross-fades in on top of the surface. */}
          <div ref={contentRef} className="relative flex flex-1 flex-col" style={{ opacity: 0 }}>
            <div className="flex items-center justify-between px-6 pt-6 sm:px-8">
              <div>
                <p className="edge-label">Build My Detail</p>
                <h2
                  id="cinematic-title"
                  className="mt-2 font-display text-2xl font-bold uppercase leading-none tracking-tight text-white"
                >
                  Let&apos;s scope your <span className="gold-text">detail</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={onRequestClose}
                aria-label="Close and go back"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-steel-200 transition-colors hover:border-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 px-4 pb-6 pt-5 sm:px-6 sm:pb-8">
              <QuoteFlow
                variant="cinematic"
                persistKey="build-my-detail"
                preselectedService={service}
                onDone={onRequestClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
