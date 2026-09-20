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

// ----------------------------------------------------------------------------
// HERO — the only native-resolution portfolio photo in the current batch
// (1536x2048 source). Desktop and mobile use genuinely different crops
// supplied by the client, not one image stretched/cropped to fit both.
// ----------------------------------------------------------------------------
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
// GALLERY — curated from the client's 05_GALLERY_CANDIDATES set.
// Source photos are 206x206 social exports upscaled 2x by the client's own
// asset pipeline (restrained +2% brightness/+7% contrast/+5% color per
// QUALITY_AND_AUTHENTICITY.md) — nothing was AI-repainted or invented.
// ----------------------------------------------------------------------------
export const galleryMedia: MediaAsset[] = [
  real("gallery-camaro", "/images/gallery/blue_camaro_hero.webp", "Blue Camaro — finished exterior detail", 1536, 2048),
  real("gallery-black-mercedes-front", "/images/gallery/black_mercedes_finished_front.webp", "Black Mercedes — finished front", 412, 412),
  real("gallery-black-mercedes-side", "/images/gallery/black_mercedes_finished_side.webp", "Black Mercedes — finished side", 412, 412),
  real("gallery-black-truck", "/images/gallery/black_truck_finished_front_quarter.webp", "Black truck — finished front quarter", 412, 412),
  real("gallery-green-suv", "/images/gallery/green_suv_finished_front.webp", "Green SUV — finished exterior", 412, 412),
  real("gallery-red-sedan", "/images/gallery/red_sedan_finished_exterior.webp", "Red sedan — finished exterior", 412, 412),
  real("gallery-white-pickup", "/images/gallery/white_pickup_exterior.webp", "White pickup truck — finished exterior", 412, 412),
  real("gallery-box-truck", "/images/gallery/box_truck_finished.webp", "Commercial box truck — finished exterior", 412, 412),
];

// ----------------------------------------------------------------------------
// BEFORE / AFTER — the 4 pairs the client's own pairing map rates
// high/medium-high confidence. Matching aspect ratios preserved per pair.
// ----------------------------------------------------------------------------
export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "transformation-headlight",
    title: "Headlight Restoration",
    vehicle: "Red sedan",
    service: "headlight-restoration",
    before: real("ba-headlight-before", "/images/before-after/red_headlight_before_02.webp", "Before — oxidized, hazy headlight", 412, 412),
    after: real("ba-headlight-after", "/images/before-after/red_headlight_after_02.webp", "After — restored, clear headlight", 412, 412),
    orientation: "square",
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
  "full-detail": real("service-full-detail", "/images/gallery/blue_camaro_hero.webp", "Full detail — finished exterior", 1536, 2048),
  "paint-correction": real("service-paint-correction", "/images/services/exterior/green_suv_finished_front.webp", "Paint correction — restored gloss and clarity", 412, 412),
  "ceramic-coating": real("service-ceramic-coating", "/images/services/exterior/black_truck_finished_front_quarter.webp", "Ceramic coating — deep, protected gloss finish", 412, 412),
  "headlight-restoration": real("service-headlight-restoration", "/images/services/headlight/red_headlight_after_02.webp", "Headlight restoration — clear, restored lens", 412, 412),
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
