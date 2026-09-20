// ============================================================================
// CENTRAL BUSINESS DATA (NAP) — the single source of truth for all
// name/address/phone/hours/links used anywhere on the site (header, footer,
// contact page, JSON-LD schema, metadata). Never hardcode this info elsewhere.
//
// ⚠️ UNRESOLVED: location.status is "unverified" — do NOT publish a definitive
// address, coordinates, directions link, or address-bearing LocalBusiness
// schema until the client confirms.
//
// Strongest candidate (Phase 2.5): two high-res photos of the client's own
// wrapped van (IMG_5310, IMG_5373) show a printed address —
//   14290 Tamiami Trail, North Port, FL 34287
// corroborated by the official Facebook page ("Detail Kings 941 | North Port
// FL") and by 34287 being a North Port ZIP. This is promising but is being
// held as a CANDIDATE pending an explicit client confirmation, per Fred's
// instruction. The earlier Port Charlotte entry came only from an unclaimed
// Manta listing. Until `confirmed` is set, the UI shows service-area framing
// (phone is confirmed) and schema omits the address entirely.
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
        label: "North Port, FL (van-wrap candidate — pending confirmation)",
        street: "14290 Tamiami Trail",
        city: "North Port",
        state: "FL",
        zip: "34287",
        source:
          "Printed on the client's own wrapped van (IMG_5310, IMG_5373); corroborated by the official Facebook page and the 34287 ZIP. Held pending explicit client confirmation.",
      },
      {
        label: "Port Charlotte, FL (superseded)",
        street: "4732 S Tamiami Trail",
        city: "Port Charlotte",
        state: "FL",
        zip: "33980",
        source: "Unclaimed/unverified Manta directory listing.",
      },
    ],
    // Set ONLY once the client confirms. UI + schema read from `confirmed`;
    // while it is null the site shows service-area framing and omits address
    // schema, coordinates, and directions.
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
