"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { DeviceTier, OriginRect } from "./CinematicOverlay";

type OpenOptions = { service?: string; href?: string };

type CinematicContextValue = {
  /** Open the Build My Detail experience anchored to `el`. */
  open: (el: HTMLElement, opts?: OpenOptions) => void;
  /** Warm the lazy overlay chunk (call on hover/focus). */
  preload: () => void;
};

const noop = () => {};
const CinematicContext = createContext<CinematicContextValue>({ open: noop, preload: noop });

export function useCinematic() {
  return useContext(CinematicContext);
}

type OverlayModule = typeof import("./CinematicOverlay");
let overlayPromise: Promise<OverlayModule> | null = null;
function loadOverlay(): Promise<OverlayModule> {
  if (!overlayPromise) overlayPromise = import("./CinematicOverlay");
  return overlayPromise;
}

function detectTier(): DeviceTier {
  try {
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if ((mem && mem <= 4) || coarse || window.innerWidth <= 430) return "lite";
  } catch {
    /* ignore */
  }
  return "full";
}

export function CinematicProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState<OriginRect | null>(null);
  const [service, setService] = useState<string | undefined>(undefined);
  const [tier, setTier] = useState<DeviceTier>("full");
  const [Overlay, setOverlay] = useState<OverlayModule["default"] | null>(null);

  const shellRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);
  const closingRef = useRef(false);
  const visibleRef = useRef(false);
  const reducedRef = useRef(reduced);

  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const receded = () =>
    shellRef.current?.querySelector<HTMLElement>("[data-cinematic-recede]") ?? null;

  const lockScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const b = document.body;
    b.style.position = "fixed";
    b.style.top = `-${scrollYRef.current}px`;
    b.style.left = "0";
    b.style.right = "0";
    b.style.width = "100%";
    if (sbw > 0) b.style.paddingRight = `${sbw}px`;
  }, []);

  const unlockScroll = useCallback(() => {
    const b = document.body;
    b.style.position = "";
    b.style.top = "";
    b.style.left = "";
    b.style.right = "";
    b.style.width = "";
    b.style.paddingRight = "";
    // Restore instantly — the page sets `scroll-behavior: smooth`, which would
    // otherwise animate this jump and re-introduce a visible scroll shift.
    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollYRef.current);
    html.style.scrollBehavior = prevBehavior;
  }, []);

  const applyRecede = useCallback(
    (cx: number, cy: number) => {
      const el = receded();
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ox = cx - rect.left;
      const oy = cy - rect.top;
      el.style.willChange = "transform, filter";
      el.style.transition =
        "transform 520ms cubic-bezier(0.16,1,0.3,1), filter 520ms cubic-bezier(0.16,1,0.3,1)";
      if (reducedRef.current) {
        el.style.filter = "brightness(0.6)";
      } else {
        el.style.transformOrigin = `${ox}px ${oy}px`;
        el.style.transform = "scale(0.94)";
        el.style.filter = tier === "lite" ? "brightness(0.5)" : "blur(6px) brightness(0.5)";
      }
    },
    [tier],
  );

  const resetRecede = useCallback(() => {
    const el = receded();
    if (!el) return;
    el.style.transform = "";
    el.style.filter = "";
    const clear = () => {
      el.style.transition = "";
      el.style.willChange = "";
      el.style.transformOrigin = "";
      el.removeEventListener("transitionend", clear);
    };
    el.addEventListener("transitionend", clear);
    window.setTimeout(clear, 700);
  }, []);

  const setBackgroundInert = useCallback((on: boolean) => {
    const shell = shellRef.current;
    if (!shell) return;
    if (on) {
      shell.setAttribute("inert", "");
      shell.setAttribute("aria-hidden", "true");
    } else {
      shell.removeAttribute("inert");
      shell.removeAttribute("aria-hidden");
    }
  }, []);

  const beginClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    resetRecede();
    setClosing(true); // overlay plays the reverse, then calls finalize()
  }, [resetRecede]);

  // Single close funnel for both the Back button and UI-initiated close
  // (UI close calls history.back(), which fires popstate). Stable identity so
  // add/removeEventListener pair up correctly.
  const handlePopState = useCallback(() => {
    if (!visibleRef.current || closingRef.current) return;
    pushedRef.current = false; // the entry we pushed was just popped
    beginClose();
  }, [beginClose]);

  // Final teardown after the reverse animation completes.
  const finalize = useCallback(() => {
    setVisible(false);
    setClosing(false);
    closingRef.current = false;
    visibleRef.current = false;
    setBackgroundInert(false);
    unlockScroll();
    window.removeEventListener("popstate", handlePopState);
    const toFocus = prevFocusRef.current;
    prevFocusRef.current = null;
    requestAnimationFrame(() => toFocus?.focus?.({ preventScroll: true }));
    setOrigin(null);
  }, [handlePopState, setBackgroundInert, unlockScroll]);

  // Requested from Escape / backdrop / close button / form completion.
  const dismiss = useCallback(() => {
    if (closingRef.current) return;
    if (pushedRef.current) {
      history.back(); // pops our entry -> popstate -> beginClose()
    } else {
      beginClose();
    }
  }, [beginClose]);

  const open = useCallback(
    (el: HTMLElement, opts?: OpenOptions) => {
      if (visibleRef.current || closingRef.current) return;

      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      const radius = parseFloat(cs.borderTopLeftRadius) || 0;
      const originRect: OriginRect = {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        radius,
      };
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      setTier(detectTier());
      prevFocusRef.current = el;

      lockScroll();
      applyRecede(cx, cy);
      setBackgroundInert(true);
      try {
        history.pushState({ dkCinematic: true }, "");
        pushedRef.current = true;
      } catch {
        pushedRef.current = false;
      }
      window.addEventListener("popstate", handlePopState);

      setOrigin(originRect);
      setService(opts?.service);

      loadOverlay()
        .then((mod) => {
          setOverlay(() => mod.default);
          setClosing(false);
          setVisible(true);
          visibleRef.current = true;
        })
        .catch(() => {
          setBackgroundInert(false);
          resetRecede();
          unlockScroll();
          if (pushedRef.current) {
            pushedRef.current = false;
            history.back();
          }
          window.removeEventListener("popstate", handlePopState);
          if (opts?.href) window.location.assign(opts.href);
        });
    },
    [applyRecede, handlePopState, lockScroll, resetRecede, setBackgroundInert, unlockScroll],
  );

  const preload = useCallback(() => {
    void loadOverlay();
  }, []);

  return (
    <CinematicContext.Provider value={{ open, preload }}>
      <div ref={shellRef} className="flex min-h-full flex-col">
        {children}
      </div>
      {visible && Overlay && typeof document !== "undefined"
        ? createPortal(
            <Overlay
              origin={origin}
              service={service}
              reduced={reduced}
              tier={tier}
              closing={closing}
              onClosed={finalize}
              onRequestClose={dismiss}
            />,
            document.body,
          )
        : null}
    </CinematicContext.Provider>
  );
}
