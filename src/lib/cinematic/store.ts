// Cinematic transition controller — a tiny external store shared by the
// doorway links, the intercepted route marker, and the overlay host.
//
// Why a store and not route state alone: the overlay's *visual* lifetime must
// outlive its route. Browser Back unmounts the intercepted route instantly;
// the host keeps the overlay mounted until the reverse journey has played.

export type CinematicSource = {
  /** The exact element the visitor touched — the camera locks onto it. */
  el: HTMLElement;
  /** Visual tone of the source, so frame 0 of the overlay matches it. */
  tone: "lime" | "ink";
  /** Label + icon shown on the chip that travels from the source. */
  label: string;
  icon?: string;
};

export type CinematicState = {
  open: boolean;
  source: CinematicSource | null;
  service: string | null;
};

let state: CinematicState = { open: false, source: null, service: null };
const listeners = new Set<() => void>();

function set(next: CinematicState) {
  state = next;
  listeners.forEach((l) => l());
}

export const cinematicStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,
  getServerSnapshot: () => state,

  /** A doorway was activated — start the journey immediately, before the route resolves. */
  begin(source: CinematicSource, service: string | null) {
    set({ open: true, source, service });
  },
  /** The intercepted route mounted (also covers browser Forward with no click). */
  routeEnter(service: string | null) {
    if (state.open) return;
    set({ ...state, open: true, service: state.service ?? service });
  },
  /** The route left (browser Back, router.back) or the visitor asked to close. */
  close() {
    if (!state.open) return;
    set({ ...state, open: false });
  },
  /** The reverse journey finished — forget the source. */
  reset() {
    set({ open: false, source: null, service: null });
  },
};

// Intent-based preloading of the overlay module: only fetched once a visitor
// approaches, hovers, focuses, or touches a doorway — never on initial load.
type OverlayModule = typeof import("@/components/cinematic/BuildMyDetailOverlay");
export type OverlayRenderer = OverlayModule["renderOverlay"];

let overlayModule: Promise<OverlayModule> | null = null;
let loadedOverlay: OverlayRenderer | null = null;
const loadListeners = new Set<() => void>();

export function preloadOverlay() {
  overlayModule ??= import("@/components/cinematic/BuildMyDetailOverlay").then((m) => {
    loadedOverlay = m.renderOverlay;
    loadListeners.forEach((l) => l());
    return m;
  });
  return overlayModule;
}

/**
 * The overlay component once its module has loaded, as an external store.
 * Rendered directly rather than through React.lazy/Suspense: lazy suspends
 * at least once even for an already-resolved module, and React throttles
 * Suspense reveals (~300ms) — a dead pause between the tap and first motion.
 */
export const overlayLoader = {
  subscribe(listener: () => void) {
    loadListeners.add(listener);
    return () => loadListeners.delete(listener);
  },
  getSnapshot: () => loadedOverlay,
  getServerSnapshot: () => null,
};
