// ============================================================================
// CENTRAL BUSINESS DATA (NAP) — the single source of truth for all
// name/address/phone/hours/links used anywhere on the site (header, footer,
// contact page, JSON-LD schema, metadata). Never hardcode this info elsewhere.
//
// ⚠️ UNRESOLVED: location.status is "unverified". Two conflicting signals
// were found during Phase 0 research:
//   1) The client-supplied asset handoff + a Manta directory listing claim
//      Port Charlotte, FL (4732 S Tamiami Trail, 33980) as primary.
//   2) An independent web search surfaced a Facebook business page titled
//      "Detail Kings 941 | North Port FL" — a different city.
// Do NOT publish this site with a confirmed address until Fred/the client
// verifies which is correct (see ASSET_AUDIT_REPORT.md). Until resolved,
// components should render the phone number (confirmed) and a
// "service area" framing rather than a hard street address.
// ============================================================================

import type { ServiceArea } from "@/types";

export const business = {
  name: "Detail Kings 941",
  legalName: "Detail Kings 941",
  tagline: "Southwest Florida Auto Detailing", // draft — revisit once brand voice is set from real assets
  phone: {
    display: "(941) 979-6097",
    e164: "+19419796097",
  },
  email: null as string | null, // not supplied yet
  location: {
    status: "unverified" as "unverified" | "verified",
    candidates: [
      {
        label: "Port Charlotte, FL",
        street: "4732 S Tamiami Trail",
        city: "Port Charlotte",
        state: "FL",
        zip: "33980",
        source: "Client asset handoff + Manta directory listing (unclaimed/unverified)",
      },
      {
        label: "North Port, FL",
        street: null,
        city: "North Port",
        state: "FL",
        zip: null,
        source: 'Facebook page titled "Detail Kings 941 | North Port FL"',
      },
    ],
    // Set once confirmed. Everything in the UI should read from here, not
    // from the candidates above, once this is filled in.
    confirmed: null as null | {
      street: string;
      city: string;
      state: string;
      zip: string;
      coordinates?: { lat: number; lng: number };
    },
  },
  hours: null, // not supplied — do not invent; show "Call for hours" until confirmed
  social: {
    instagram: "https://www.instagram.com/detailkings941/",
    facebook: "https://www.facebook.com/Realdeal941",
  },
  googleProfileUrl: "https://share.google/uksKqC6zBxxjFSHUv",
  reviewUrl: "https://share.google/uksKqC6zBxxjFSHUv", // same link doubles as review CTA until a direct review-write link is confirmed
  bookingUrl: "/contact", // in-site quote flow is the primary booking path
  founded: null as string | null,
} as const;

// Only mark a location active once the client confirms it operates there.
// Kept separate from `business.location` so future multi-location expansion
// (spec section 17) doesn't require restructuring the core NAP object.
export const serviceAreas: ServiceArea[] = [
  { slug: "port-charlotte-fl", city: "Port Charlotte", state: "FL", active: false },
  { slug: "north-port-fl", city: "North Port", state: "FL", active: false },
  { slug: "punta-gorda-fl", city: "Punta Gorda", state: "FL", active: false },
  { slug: "englewood-fl", city: "Englewood", state: "FL", active: false },
  { slug: "venice-fl", city: "Venice", state: "FL", active: false },
];
