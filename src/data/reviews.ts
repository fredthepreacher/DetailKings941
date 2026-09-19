// ============================================================================
// REVIEWS — intentionally empty. No verified review text was retrievable
// (Google/Facebook block automated fetching; see ASSET_AUDIT_REPORT.md).
// The spec is explicit: use VERIFIED reviews only, never synthetic ones.
// The <Reviews> component is built to render this list when populated, and
// to fall back to a "See our reviews on Google" CTA when it's empty — never
// to a fabricated testimonial.
// ============================================================================

import type { Review } from "@/types";

export const reviews: Review[] = [];

// Set this once Fred/the client provides a verified rating + count (e.g. from
// the Google Business dashboard). Do not estimate or invent these numbers.
export const reviewSummary: { rating: number; count: number } | null = null;
