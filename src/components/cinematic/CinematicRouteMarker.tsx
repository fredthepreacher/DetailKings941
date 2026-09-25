"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { cinematicStore } from "@/lib/cinematic/store";

/**
 * Rendered by the intercepted `(.)build-my-detail` route. It carries no UI —
 * it ties the overlay to history: mounting opens it (covers browser Forward),
 * unmounting (browser Back) plays the reverse journey.
 */
export function CinematicRouteMarker() {
  const service = useSearchParams().get("service");

  useEffect(() => {
    cinematicStore.routeEnter(service);
    return () => cinematicStore.close();
  }, [service]);

  return null;
}
