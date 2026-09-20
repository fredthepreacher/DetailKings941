// ============================================================================
// CENTRAL BUSINESS DATA (NAP) — the single source of truth for all
// name/address/phone/hours/links used anywhere on the site (header, footer,
// contact page, JSON-LD schema, metadata). Never hardcode this info elsewhere.
//
// ✅ RESOLVED (Phase 2.5): the address is now confirmed from the client's own
// wrapped van. Two independent high-resolution photos in the Phase 2.5 media
// handoff (IMG_5310, IMG_5373) show the printed address on the vehicle wrap:
//   14290 Tamiami Trail, North Port, FL 34287
// This is corroborated by (a) the official Facebook page titled "Detail Kings
// 941 | North Port FL" and (b) ZIP 34287 being a North Port ZIP. The earlier
// Port Charlotte candidate came only from an unclaimed/unverified Manta
// directory listing and has been superseded. The van's printed phone
// ((941) 979-6097) matches the confirmed business phone. Kept on claude-dev
// for preview review before any promotion to main — Fred to give a final
// visual confirm that this is the current storefront address.
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
    status: "verified" as "unverified" | "verified",
    // Source of truth for the address, now resolved from the client's own van
    // wrap (see header note). UI + schema read from `confirmed` only.
    confirmed: {
      street: "14290 Tamiami Trail",
      city: "North Port",
      state: "FL",
      zip: "34287",
      // Coordinates intentionally omitted — not measured. Schema/geo works
      // without them; add precise lat/lng only from an authoritative source.
    } as null | {
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
