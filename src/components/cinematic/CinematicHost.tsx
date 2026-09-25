"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cinematicStore, overlayLoader, preloadOverlay } from "@/lib/cinematic/store";

/**
 * Always-mounted, near-zero-cost host for the cinematic overlay (flag-on
 * builds only). It owns the overlay's visual lifetime, decoupled from the
 * route: the overlay mounts the moment a doorway is activated and stays
 * mounted until its reverse journey has fully played — even when browser
 * Back has already unmounted the intercepted route.
 */
export function CinematicHost() {
  const state = useSyncExternalStore(
    cinematicStore.subscribe,
    cinematicStore.getSnapshot,
    cinematicStore.getServerSnapshot,
  );
  const renderOverlay = useSyncExternalStore(
    overlayLoader.subscribe,
    overlayLoader.getSnapshot,
    overlayLoader.getServerSnapshot,
  );
  const [present, setPresent] = useState(false);

  // Mount on open; unmount only when the overlay reports its exit finished.
  if (state.open && !present) setPresent(true);

  // Normally preloaded on intent already; if not (e.g. browser Forward with no
  // prior intent), load now — the store re-renders us as soon as it lands.
  useEffect(() => {
    if (present && !renderOverlay) preloadOverlay();
  }, [present, renderOverlay]);

  if (!present || !renderOverlay) return null;

  return renderOverlay({
    open: state.open,
    source: state.source,
    service: state.service,
    onExited: () => {
      setPresent(false);
      cinematicStore.reset();
    },
  });
}
