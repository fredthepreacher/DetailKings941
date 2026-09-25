"use client";

import { useEffect, useEffectEvent, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { animate, useMotionValue, type AnimationPlaybackControls } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { services } from "@/data/services";
import { heroVideo } from "@/data/media";
import { DynamicIcon } from "@/lib/icons";
import { cinematicStore, type CinematicSource } from "@/lib/cinematic/store";
import { track } from "@/lib/analytics";
import { BuildMyDetailExperience } from "@/components/cinematic/BuildMyDetailExperience";
import { cn } from "@/lib/utils";

/*
 * CINEMATIC SPATIAL NAVIGATION — Build My Detail doorway.
 *
 * One progress value `p` (0 = the touched element, 1 = inside the experience)
 * drives every layer, so the whole scene moves as one camera and any
 * interruption (Back mid-flight, Esc, double-tap) simply retargets the spring:
 *
 *   stage (the live page)  scales ~7% around the touched element and drifts
 *                          toward screen center — the camera dollying in
 *   scrim                  dims the receding page
 *   frame                  a clip window that starts as the exact source rect
 *                          (same radius, same tone) and opens to the viewport —
 *                          the element *becomes* the interface
 *   chip                   the source's label/icon, travelling from where it
 *                          was touched to its place in the new interface
 *   env / content          real media + the quote flow arrive last
 *
 * Every write is transform / opacity / clip-path on fixed layers — no layout.
 * The reverse journey re-measures the source and plays the same path back.
 */

type Rect = { top: number; left: number; width: number; height: number };
type Geo = {
  w: number;
  h: number;
  from: Rect;
  radius: number;
  chip: { dx: number; dy: number; scale: number };
  stage: { tx: number; ty: number };
  hasSource: boolean;
};

const OPEN = { type: "spring", duration: 0.72, bounce: 0 } as const;
const CLOSE = { type: "spring", duration: 0.6, bounce: 0 } as const;
const REDUCED = { duration: 0.2, ease: "easeOut" } as const;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

const stageEl = () => document.querySelector<HTMLElement>("[data-cinematic-stage]");
const recedeEls = () => document.querySelectorAll<HTMLElement>("[data-cinematic-recede]");

export type OverlayProps = {
  open: boolean;
  source: CinematicSource | null;
  service: string | null;
  onExited: () => void;
};

/** Entry point for the lazily loaded module (keeps the component type static). */
export function renderOverlay(props: OverlayProps) {
  return <BuildMyDetailOverlay {...props} />;
}

function BuildMyDetailOverlay({ open, source, service, onExited }: OverlayProps) {
  const router = useRouter();
  const p = useMotionValue(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const chipFromRef = useRef<HTMLSpanElement>(null);
  const chipToRef = useRef<HTMLSpanElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const closeWrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const geo = useRef<Geo | null>(null);
  const reduced = useRef(false);
  const runId = useRef(0);
  const opening = useRef(false);
  const pausedVideos = useRef<HTMLVideoElement[]>([]);

  const selected = services.find((s) => s.slug === service);
  const tone = source?.tone ?? "ink";
  const fromLabel = source?.label ?? selected?.name ?? "Build My Detail";
  const toLabel = selected?.name ?? "Build My Detail";
  const icon = source?.icon ?? selected?.icon;
  const envSrc = selected?.image?.src ?? heroVideo.poster;

  /** Untransformed geometry of the source, frame, chip and stage. */
  const measure = useEffectEvent((): Geo => {
    const frame = frameRef.current!;
    const chip = chipRef.current!;
    const stage = stageEl();
    const w = frame.clientWidth;
    const h = frame.clientHeight;

    const prevStage = stage?.style.transform ?? "";
    const prevChip = chip.style.transform;
    if (stage) stage.style.transform = "none";
    chip.style.transform = "none";
    const el = source?.el;
    let r: DOMRect | null = el?.isConnected ? el.getBoundingClientRect() : null;
    const stageRect = stage?.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    if (stage) stage.style.transform = prevStage;
    chip.style.transform = prevChip;

    // Source scrolled away / unmounted → fall back to a centered aperture.
    if (r && (r.bottom < 0 || r.top > h || r.width === 0)) r = null;
    const hasSource = !!r && !reduced.current;

    const from: Rect = reduced.current
      ? { top: 0, left: 0, width: w, height: h }
      : r
        ? { top: r.top, left: r.left, width: r.width, height: r.height }
        : { top: h * 0.3, left: w * 0.15, width: w * 0.7, height: h * 0.4 };

    const radius =
      hasSource && el
        ? Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, from.height / 2)
        : reduced.current
          ? 0
          : 24;

    // Chip: scale so its height matches the source, pin its top-left to it.
    const scale = hasSource ? from.height / chipRect.height : 1;
    const chipDx = hasSource
      ? from.left - chipRect.left
      : from.left + (from.width - chipRect.width) / 2 - chipRect.left;
    const chipDy = hasSource
      ? from.top - chipRect.top
      : from.top + (from.height - chipRect.height) / 2 - chipRect.top;

    // Stage: dolly around the source's center, drifting it toward screen center.
    const cx = from.left + from.width / 2;
    const cy = from.top + from.height / 2;
    if (stage && stageRect) {
      stage.style.transformOrigin = `${cx - stageRect.left}px ${cy - stageRect.top}px`;
    }

    return {
      w,
      h,
      from,
      radius,
      chip: reduced.current ? { dx: 0, dy: 0, scale: 1 } : { dx: chipDx, dy: chipDy, scale },
      stage: { tx: (w / 2 - cx) * 0.16, ty: (h / 2 - cy) * 0.16 },
      hasSource,
    };
  });

  /** Paint one frame of the journey. */
  const apply = useEffectEvent((v: number) => {
    const g = geo.current;
    const frame = frameRef.current;
    if (!g || !frame) return;
    const inv = 1 - v;
    const rm = reduced.current;

    const t = g.from.top * inv;
    const l = g.from.left * inv;
    const r = (g.w - g.from.left - g.from.width) * inv;
    const b = (g.h - g.from.top - g.from.height) * inv;
    const rad = g.radius * inv;

    if (rm) {
      frame.style.clipPath = "none";
      frame.style.opacity = String(v);
      frame.style.transform = `scale(${0.985 + 0.015 * v})`;
    } else {
      frame.style.clipPath = `inset(${t}px ${r}px ${b}px ${l}px round ${rad}px)`;
    }

    const edge = edgeRef.current;
    if (edge) {
      edge.style.transform = `translate3d(${l}px, ${t}px, 0)`;
      edge.style.width = `${g.w - l - r}px`;
      edge.style.height = `${g.h - t - b}px`;
      edge.style.borderRadius = `${rad}px`;
      edge.style.opacity = g.hasSource && tone === "ink" ? String(clamp01(1 - v / 0.75)) : "0";
    }

    const chip = chipRef.current;
    if (chip) {
      // k = how far the chip still sits from its in-interface slot (1 = on the
      // source). It reaches the source at v = 0.12, a beat before the frame
      // closes, so it rests exactly on the real element while the overlay
      // dissolves. Its progress (1 - k) never exceeds v, so it stays inside
      // the frame on every frame.
      const k = 1 - clamp01((v - 0.12) / 0.88);
      const s = 1 + (g.chip.scale - 1) * k;
      chip.style.transform = `translate3d(${g.chip.dx * k}px, ${g.chip.dy * k}px, 0) scale(${s})`;
    }
    if (chipFromRef.current && chipToRef.current && fromLabel !== toLabel) {
      chipFromRef.current.style.opacity = String(clamp01(1 - v / 0.5));
      chipToRef.current.style.opacity = String(clamp01((v - 0.35) / 0.4));
    }

    const reveal = clamp01((v - 0.55) / 0.45);
    for (const el of [chromeRef.current, closeWrapRef.current]) {
      if (el) el.style.opacity = String(reveal);
    }
    if (contentRef.current) {
      contentRef.current.style.opacity = String(reveal);
      contentRef.current.style.transform = rm ? "" : `translate3d(0, ${28 * inv}px, 0)`;
    }
    if (envRef.current) {
      envRef.current.style.opacity = String(clamp01(v * 1.4 - 0.25));
      envRef.current.style.transform = rm ? "" : `scale(${1.12 - 0.12 * v})`;
    }
    if (scrimRef.current) scrimRef.current.style.opacity = String(0.78 * v);
    // Last ~10% of the journey: the chip dissolves into the real element
    // underneath, so the hand-off back to the page never snaps.
    if (rootRef.current) {
      rootRef.current.style.opacity = g.hasSource ? String(clamp01(v / 0.1)) : "1";
    }

    const stage = stageEl();
    if (stage && !rm) {
      stage.style.transform = `translate3d(${g.stage.tx * v}px, ${g.stage.ty * v}px, 0) scale(${1 + 0.07 * v})`;
    }
    recedeEls().forEach((el) => (el.style.opacity = String(clamp01(1 - v * 2.5))));
  });

  // Mount: freeze the page context (scroll, focus, media), take the first
  // measurement, and paint frame 0 — synchronously, before first paint, so
  // there is never a flash of the full-size overlay.
  const focusReturnTarget = useEffectEvent(
    () => (source?.el ?? document.activeElement) as HTMLElement | null,
  );

  useLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    const stage = stageEl();
    const receders = Array.from(recedeEls());
    const returnFocus = focusReturnTarget();

    html.style.overflow = "hidden";
    if (stage) {
      stage.inert = true;
      stage.style.willChange = "transform";
      pausedVideos.current = Array.from(stage.querySelectorAll("video")).filter((v) => !v.paused);
      pausedVideos.current.forEach((v) => v.pause());
    }
    receders.forEach((el) => {
      el.inert = true;
      el.style.transition = "none"; // the camera drives opacity, not CSS transitions
    });

    geo.current = measure();
    apply(0);
    const unsubscribe = p.on("change", apply);

    return () => {
      unsubscribe();
      html.style.overflow = "";
      if (stage) {
        stage.inert = false;
        stage.style.transform = "";
        stage.style.transformOrigin = "";
        stage.style.willChange = "";
        stage.style.visibility = "";
      }
      receders.forEach((el) => {
        el.inert = false;
        el.style.opacity = "";
        el.style.transition = "";
      });
      pausedVideos.current.forEach((v) => v.play().catch(() => {}));
      pausedVideos.current = [];
      returnFocus?.focus({ preventScroll: true });
    };
  }, [p]);

  // Open ⇄ close. Each run gets an id so a superseded run never finalizes.
  const run = useEffectEvent((toOpen: boolean) => {
    const id = ++runId.current;
    let controls: AnimationPlaybackControls;
    const started = performance.now();

    if (toOpen) {
      opening.current = true;
      controls = animate(p, 1, reduced.current ? REDUCED : OPEN);
      controls.finished.then(() => {
        if (id !== runId.current) return;
        opening.current = false;
        // The covered page is left painted (its videos are paused, so it never
        // re-rasterizes): hiding it would force a full repaint the instant the
        // reverse journey starts — a visible hitch on the first frame back.
        headingRef.current?.focus({ preventScroll: true });
        track("cinematic_transition_completed", {
          doorway: "build-my-detail",
          ms: Math.round(performance.now() - started),
        });
        track("build_my_detail_opened", { service: service ?? null, source: "cinematic" });
      });
    } else {
      if (opening.current) track("cinematic_transition_abandoned", { doorway: "build-my-detail", at: Number(p.get().toFixed(2)) });
      opening.current = false;
      geo.current = measure(); // re-lock onto the source (resize/rotation safe)
      controls = animate(p, 0, reduced.current ? REDUCED : CLOSE);
      controls.finished.then(() => {
        if (id !== runId.current) return;
        track("cinematic_closed", { doorway: "build-my-detail" });
        onExited();
      });
    }
    return controls;
  });

  useEffect(() => {
    const controls = run(open);
    return () => controls.stop();
  }, [open]);

  const requestClose = () => {
    if (!open) return;
    cinematicStore.close();
    // Pop our own history entry so Forward can reopen; if the route never
    // landed (closed before navigation resolved) there's nothing to pop.
    if (window.location.pathname === "/build-my-detail") router.back();
  };

  const onEscape = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === "Escape" && !e.defaultPrevented) requestClose();
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onEscape(e);
    // Browser Back: start the reverse journey on the popstate itself rather
    // than waiting ~100ms for the router to re-render and unmount the route.
    const onPop = () => {
      if (window.location.pathname !== "/build-my-detail") cinematicStore.close();
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bmd-heading"
      // 100vw (not inset-0) so the layer also covers the reserved scrollbar gutter
      className="fixed left-0 top-0 z-[70] h-full w-screen"
      data-cinematic-overlay=""
    >
      <div ref={scrimRef} aria-hidden className="absolute inset-0 bg-ink-950 opacity-0" />

      <div
        ref={frameRef}
        className="absolute inset-0 overflow-hidden bg-ink-950"
        style={{ clipPath: "inset(50% 50% 50% 50%)" }}
      >
        {/* Environment: real client media, deep in the scene */}
        <div ref={envRef} aria-hidden className="absolute inset-0 opacity-0">
          <Image
            src={envSrc}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/92 to-ink-950" />
          <div className="cinematic-grid absolute inset-0" />
          <div
            className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.12] blur-[120px]"
            style={{ background: "radial-gradient(circle, var(--color-lime-500), transparent 70%)" }}
          />
        </div>

        <div className="absolute inset-0 overflow-y-auto overscroll-contain">
          <div className="sticky top-0 z-10 bg-gradient-to-b from-ink-950 via-ink-950/85 to-transparent">
            <div className="mx-auto flex h-20 w-full max-w-[var(--container-page)] items-center gap-3 px-5 sm:px-8">
              <div ref={chromeRef} className="opacity-0">
                <button
                  type="button"
                  onClick={requestClose}
                  className="inline-flex h-11 items-center gap-2 rounded-full pl-2 pr-3 font-display text-sm font-semibold uppercase tracking-wide text-steel-200 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back</span>
                  <span className="sr-only sm:hidden">Back</span>
                </button>
              </div>

              {/* The travelling chip — frame 0 sits exactly on the touched element */}
              <div
                ref={chipRef}
                className={cn(
                  "origin-top-left will-change-transform",
                  tone === "lime"
                    ? "inline-flex h-10 items-center gap-1.5 rounded-full bg-lime-500 px-[1.43rem] font-display text-xs font-semibold uppercase tracking-wide text-ink-950"
                    : "inline-flex items-center gap-[0.648rem] rounded-[10.3px] border border-lime-500/40 bg-lime-500/[0.06] px-[0.857rem] py-[0.643rem]",
                )}
              >
                {tone === "ink" && (
                  <span className="flex h-[1.93rem] w-[1.93rem] shrink-0 items-center justify-center rounded-[6.9px] bg-lime-500 text-ink-950">
                    <DynamicIcon name={icon ?? "Sparkles"} className="h-[0.857rem] w-[0.857rem]" strokeWidth={1.75} />
                  </span>
                )}
                <span
                  className={cn(
                    "grid",
                    tone === "ink" &&
                      "font-display text-xs font-semibold uppercase tracking-tight text-white",
                  )}
                >
                  <span ref={chipFromRef} className="col-start-1 row-start-1 whitespace-nowrap">
                    {fromLabel}
                  </span>
                  {fromLabel !== toLabel && (
                    <span
                      ref={chipToRef}
                      aria-hidden
                      className="col-start-1 row-start-1 whitespace-nowrap opacity-0"
                    >
                      {toLabel}
                    </span>
                  )}
                </span>
                {tone === "lime" && <ArrowRight className="h-3 w-3" />}
              </div>

              <div ref={closeWrapRef} className="ml-auto opacity-0">
                <button
                  type="button"
                  onClick={requestClose}
                  aria-label="Close and return to the page"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/5"
                  data-cinematic-close=""
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div ref={contentRef} className="mx-auto w-full max-w-3xl px-5 pb-28 pt-6 opacity-0 sm:px-8">
            <BuildMyDetailExperience
              service={service}
              headingId="bmd-heading"
              headingRef={headingRef}
            />
          </div>
        </div>
      </div>

      {/* Hairline edge — the source's own border, dissolving as the frame opens */}
      <div
        ref={edgeRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 border border-lime-500/45 opacity-0"
      />
    </div>
  );
}
