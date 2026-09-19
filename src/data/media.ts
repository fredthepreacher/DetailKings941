// ============================================================================
// MEDIA REGISTRY — every image/video slot the site can render, in one place.
// status: "placeholder" until a real client asset is dropped into
// /public/images/... and this entry is updated to status: "real" with the
// real `src`, `width`, and `height`. Nothing here was fabricated — see
// ASSET_AUDIT_REPORT.md. Components must render a clearly-designed
// placeholder treatment (not a broken image) whenever status is
// "placeholder", so the site looks intentional, not broken, pre-launch.
// ============================================================================

import type { BeforeAfterPair, MediaAsset } from "@/types";

const placeholder = (
  id: string,
  alt: string,
  width: number,
  height: number,
): MediaAsset => ({
  id,
  src: null,
  alt,
  width,
  height,
  status: "placeholder",
});

export const heroMedia: MediaAsset = placeholder(
  "hero-primary",
  "Detail Kings 941 — cinematic hero vehicle shot (awaiting client asset)",
  1920,
  1080,
);

export const galleryMedia: MediaAsset[] = [
  placeholder("gallery-exterior-01", "Exterior detail — finished vehicle", 1200, 900),
  placeholder("gallery-interior-01", "Interior detail — finished cabin", 1200, 900),
  placeholder("gallery-paint-01", "Paint correction close-up", 1200, 900),
  placeholder("gallery-truck-01", "Truck/SUV detail", 1200, 900),
  placeholder("gallery-wheels-01", "Wheel & tire detail", 1200, 900),
  placeholder("gallery-exterior-02", "Exterior detail — reflection shot", 1200, 900),
];

export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "transformation-01",
    title: "Signature Transformation",
    vehicle: "Awaiting confirmed vehicle + service",
    before: placeholder("ba-01-before", "Before — awaiting client photo", 1200, 900),
    after: placeholder("ba-01-after", "After — awaiting client photo", 1200, 900),
    orientation: "landscape",
  },
];

export const processMedia: MediaAsset[] = [
  placeholder("process-wash", "Foam wash / process shot", 900, 1200),
  placeholder("process-extraction", "Interior extraction / steam", 900, 1200),
  placeholder("process-polish", "Machine polishing", 900, 1200),
];

export const shopTeamMedia: MediaAsset[] = [
  placeholder("shop-01", "Shop / location photo", 1200, 900),
  placeholder("owner-01", "Owner / team photo", 1200, 900),
];

export const brandLogo = {
  mark: null as string | null, // path once a real logo file is provided
  wordmarkFallback: "DETAIL KINGS 941", // typographic fallback used until real logo lands
};
