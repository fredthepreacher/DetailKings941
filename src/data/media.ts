// ============================================================================
// MEDIA REGISTRY — every image/video slot the site can render, in one place.
// Phase 2: populated with real client-supplied photography from
// "Detail_Kings_941_Final_Web_Asset_Package". Provenance and authenticity
// rules for every file here are documented in
// docs/reports/PHASE_2_COMPLETION_REPORT.md and the package's own
// 00_START_HERE/QUALITY_AND_AUTHENTICITY.md. A handful of slots (shop/team
// photos) remain unfilled — no such photos were supplied — and keep the
// designed placeholder treatment rather than a broken image or a stand-in.
// ============================================================================

import type { BeforeAfterPair, MediaAsset, VideoAsset } from "@/types";

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

const real = (
  id: string,
  src: string,
  alt: string,
  width: number,
  height: number,
  credit?: string,
): MediaAsset => ({
  id,
  src,
  alt,
  width,
  height,
  status: "real",
  credit,
});

const video = (
  id: string,
  src: string,
  srcMobile: string | undefined,
  poster: string,
  alt: string,
  width: number,
  height: number,
): VideoAsset => ({
  id,
  src,
  srcMobile,
  poster,
  alt,
  width,
  height,
  status: "real",
});

// ----------------------------------------------------------------------------
// HERO — Phase 2.5: the hero is now real cinematic process footage. Source is
// the client's own IMG_8059.mov (Mercedes foam wash at the lime-green wash
// bay — the single strongest active-detailing clip in the batch). Trimmed to
// a 7.5s loop and transcoded to H.264 (desktop + lighter mobile derivative)
// with a WebP poster that also serves as the prefers-reduced-motion still.
// The Phase 2 static Camaro hero is retained below as a fallback poster.
// ----------------------------------------------------------------------------
export const heroVideo: VideoAsset = video(
  "hero-foam-wash-mercedes",
  "/media/video/detail-kings-foam-wash-mercedes-hero.mp4",
  "/media/video/detail-kings-foam-wash-mercedes-hero-mobile.mp4",
  "/media/posters/detail-kings-foam-wash-mercedes-poster.webp",
  "Detail Kings 941 crew foam-washing a Mercedes during an exterior detail",
  720,
  1280,
);

// Retained static hero (Phase 2) — used as the reduced-motion / no-JS fallback
// surface and available if a still hero is ever preferred again.
export const heroMedia: MediaAsset = real(
  "hero-primary",
  "/images/hero/blue-camaro-1600x900.webp",
  "Detail Kings 941 — freshly detailed blue Camaro, finished exterior",
  1600,
  900,
);

export const heroMediaMobile: MediaAsset = real(
  "hero-primary-mobile",
  "/images/hero/blue-camaro-mobile-1080x1350.webp",
  "Detail Kings 941 — freshly detailed blue Camaro, finished exterior",
  1080,
  1350,
);

// ----------------------------------------------------------------------------
// MOTION TILES — short, viewport-aware video moments placed through the page.
// All trimmed/transcoded from the client's own Phase 2.5 footage. Portrait
// framing (phone-native) with posters for lazy first paint + reduced motion.
// ----------------------------------------------------------------------------
export const processVideo: VideoAsset = video(
  "process-foam-suv",
  "/media/video/detail-kings-foam-wash-suv-process.mp4",
  undefined,
  "/media/posters/detail-kings-foam-wash-suv-poster.webp",
  "Thick foam bath cascading down a dark SUV during the wash stage",
  640,
  1138,
);

export const resultVideos: VideoAsset[] = [
  video(
    "result-ford-tremor",
    "/media/video/detail-kings-ford-tremor-result.mp4",
    undefined,
    "/media/posters/detail-kings-ford-tremor-poster.webp",
    "Finished walkaround of a Ford F-150 Tremor, Detail Kings van in frame",
    640,
    1138,
  ),
  video(
    "result-bmw-x7",
    "/media/video/detail-kings-bmw-x7-result.mp4",
    undefined,
    "/media/posters/detail-kings-bmw-x7-poster.webp",
    "Finished walkaround of a white BMW X7 after a full detail",
    640,
    1138,
  ),
];

// ----------------------------------------------------------------------------
// GALLERY — curated from the client's 05_GALLERY_CANDIDATES set.
// Source photos are 206x206 social exports upscaled 2x by the client's own
// asset pipeline (restrained +2% brightness/+7% contrast/+5% color per
// QUALITY_AND_AUTHENTICITY.md) — nothing was AI-repainted or invented.
// ----------------------------------------------------------------------------
// Phase 2.5: curated to lead with the new native-resolution phone photography
// (1200–1600px) rather than the 412px social upscales. The company van appears
// in-frame on several — real brand-in-context proof, not a staged backdrop.
export const galleryMedia: MediaAsset[] = [
  real("gallery-jeep-brand", "/images/phase2-5/detail-kings-jeep-wrangler-yellow-brand.webp", "Lifted yellow Jeep Wrangler beside the Detail Kings 941 wrapped van", 1600, 1200),
  real("gallery-bentley", "/images/phase2-5/detail-kings-bentley-bentayga-white-result.webp", "White Bentley Bentayga after a full detail", 1200, 1600),
  real("gallery-cla", "/images/phase2-5/detail-kings-mercedes-cla-white-result.webp", "White Mercedes-AMG CLA, finished exterior with the van in frame", 1600, 1200),
  real("gallery-k5", "/images/phase2-5/detail-kings-kia-k5-silver-result.webp", "Silver Kia K5 GT-Line, finished exterior", 1600, 1200),
  real("gallery-rav4", "/images/phase2-5/detail-kings-toyota-rav4-white-result.webp", "White Toyota RAV4 Hybrid, finished exterior beside the branded van", 1600, 1200),
  real("gallery-corvette", "/images/phase2-5/detail-kings-corvette-red-foam-process.webp", "Red Corvette C8 mid-foam-bath during the wash stage", 1400, 1050),
  real("gallery-camaro", "/images/gallery/blue_camaro_hero.webp", "Blue Camaro — finished exterior detail", 1536, 2048),
  real("gallery-van-services", "/images/phase2-5/detail-kings-van-fleet-services-brand.webp", "Detail Kings 941 van showing the full service list", 1200, 1600),
];

// ----------------------------------------------------------------------------
// BEFORE / AFTER — the 4 pairs the client's own pairing map rates
// high/medium-high confidence. Matching aspect ratios preserved per pair.
// ----------------------------------------------------------------------------
export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "transformation-headlight",
    title: "Headlight Restoration",
    vehicle: "Mercedes-Benz",
    service: "headlight-restoration",
    // Phase 2.5: replaced the low-res red-sedan pair with a genuine same-lamp
    // before/after of a black Mercedes (IMG_0239 hazy → IMG_0241 clear),
    // native 1200px source — dramatically better quality.
    before: real("ba-headlight-before", "/images/phase2-5/detail-kings-mercedes-headlight-before.webp", "Before — oxidized, hazed-over headlight lens", 1200, 800),
    after: real("ba-headlight-after", "/images/phase2-5/detail-kings-mercedes-headlight-after.webp", "After — restored, crystal-clear LED headlight", 1200, 800),
    orientation: "landscape",
  },
  {
    id: "transformation-seats-wide",
    title: "Interior Extraction",
    vehicle: "Tan cloth/leather seating",
    service: "interior-detailing",
    before: real("ba-seats-wide-before", "/images/before-after/tan_seat_before_wide.webp", "Before — stained, dirty seating", 412, 412),
    after: real("ba-seats-wide-after", "/images/before-after/tan_seat_after_wide.webp", "After — extracted, cleaned seating", 412, 412),
    orientation: "square",
  },
  {
    id: "transformation-seats-close",
    title: "Interior Extraction — Detail",
    vehicle: "Tan cloth/leather seating",
    service: "interior-detailing",
    before: real("ba-seats-close-before", "/images/before-after/tan_seat_before_closeup.webp", "Before — close-up of soiled seat fabric", 412, 412),
    after: real("ba-seats-close-after", "/images/before-after/tan_seat_after_closeup.webp", "After — close-up of cleaned seat fabric", 412, 412),
    orientation: "square",
  },
  {
    id: "transformation-wheel",
    title: "Wheel & Tire Detail",
    vehicle: "Wheel/tire assembly",
    service: "exterior-detailing",
    before: real("ba-wheel-before", "/images/before-after/wheel_before.webp", "Before — dull, brake-dust-covered wheel", 412, 412),
    after: real("ba-wheel-after", "/images/before-after/wheel_after.webp", "After — cleaned, dressed wheel and tire", 412, 412),
    orientation: "square",
  },
];

// ----------------------------------------------------------------------------
// PROCESS — in-progress / working shots.
// ----------------------------------------------------------------------------
export const processMedia: MediaAsset[] = [
  real("process-wash", "/images/process/box_truck_wash_process.webp", "Foam wash in progress on a commercial box truck", 412, 412),
  real("process-hood", "/images/process/fdva_truck_hood_before.webp", "Work truck hood ahead of detailing", 412, 412),
];

// ----------------------------------------------------------------------------
// SHOP / TEAM — no such photos were included in the asset handoff. Keep the
// designed placeholder rather than substituting an unrelated photo.
// ----------------------------------------------------------------------------
export const shopTeamMedia: MediaAsset[] = [
  placeholder("shop-01", "Shop / location photo", 1200, 900),
  placeholder("owner-01", "Owner / team photo", 1200, 900),
];

// ----------------------------------------------------------------------------
// SERVICE IMAGERY — one representative real photo per service, from
// 06_SERVICE_CANDIDATES. These are customer vehicles Detail Kings 941
// detailed (including fleet/commercial clients) — not the shop's own fleet.
// ----------------------------------------------------------------------------
export const serviceImages: Record<string, MediaAsset> = {
  "interior-detailing": real("service-interior", "/images/services/interior/tan_seat_after_wide.webp", "Interior detailing — finished cabin", 412, 412),
  "exterior-detailing": real("service-exterior", "/images/services/exterior/black_mercedes_finished_front.webp", "Exterior detailing — finished vehicle", 412, 412),
  "full-detail": real("service-full-detail", "/images/phase2-5/detail-kings-bentley-bentayga-white-result.webp", "Full detail — finished luxury SUV exterior", 1200, 1600),
  "paint-correction": real("service-paint-correction", "/images/services/exterior/green_suv_finished_front.webp", "Paint correction — restored gloss and clarity", 412, 412),
  "ceramic-coating": real("service-ceramic-coating", "/images/services/exterior/black_truck_finished_front_quarter.webp", "Ceramic coating — deep, protected gloss finish", 412, 412),
  "headlight-restoration": real("service-headlight-restoration", "/images/phase2-5/detail-kings-headlight-detail-led.webp", "Headlight restoration — clear, restored LED lens", 900, 1200),
  "truck-suv-detailing": real("service-truck-suv", "/images/services/fleet/white_work_truck_exterior.webp", "Truck & SUV detailing — finished commercial vehicle", 412, 412),
};

// ----------------------------------------------------------------------------
// BRAND — official logo, confirmed real (not invented). Five variants
// delivered; the transparent PNG is the primary mark for use over photos
// and both light/dark surfaces; the on-dark/whitebg variants are available
// for contexts needing a flat background.
// ----------------------------------------------------------------------------
export const brandLogo = {
  mark: "/images/brand/detail-kings-941-logo.png" as string | null,
  markOnDark: "/images/brand/detail-kings-941-logo-on-dark.jpg" as string | null,
  markWhiteBg: "/images/brand/detail-kings-941-logo-whitebg.png" as string | null,
  wordmarkFallback: "DETAIL KINGS 941", // kept as an accessible text fallback (alt text, no-js, etc.)
};
