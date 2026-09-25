import { Suspense } from "react";
import { CINEMATIC_ENABLED } from "@/lib/cinematic/flag";
import { CinematicRouteMarker } from "@/components/cinematic/CinematicRouteMarker";

/**
 * Soft navigation to /build-my-detail from inside the site lands here instead
 * of the full page: the current page stays mounted underneath and the
 * cinematic overlay (owned by CinematicHost) plays over it. Refresh, deep
 * links, and shares skip interception and render app/build-my-detail/page.tsx.
 */
export default function InterceptedBuildMyDetail() {
  if (!CINEMATIC_ENABLED) return null;
  return (
    <Suspense fallback={null}>
      <CinematicRouteMarker />
    </Suspense>
  );
}
