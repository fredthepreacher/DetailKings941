// ============================================================================
// DRAFT SERVICE CATALOG — verified: false on every entry.
// Public research only confirmed a Google category of "Car wash"; no
// itemized service menu or pricing was found. This list is a realistic
// starting catalog for a Southwest Florida mobile/in-shop detailer, written
// for Fred/the client to confirm, edit, remove, or reprice before launch.
// Nothing marked verified: false should ship to production copy as fact —
// see /src/lib/content-guard.ts usage in service cards.
// ============================================================================

import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "interior-detailing",
    name: "Interior Detailing",
    shortDescription: "Deep clean, extraction, and conditioning for every surface inside the cabin.",
    longDescription:
      "A full interior reset — vacuum and extraction of seats and carpets, steam cleaning, dash and console detailing, glass, door jambs, and a UV-safe conditioning pass on plastics and leather.",
    included: [
      "Full vacuum + steam extraction",
      "Seat & carpet shampoo",
      "Dash, console & door panel detail",
      "Interior glass",
      "Leather/vinyl conditioning",
      "Odor treatment",
    ],
    idealFor: "Daily drivers, pet owners, families, and pre-sale resets.",
    category: "interior",
    verified: false,
    icon: "Sparkles",
  },
  {
    slug: "exterior-detailing",
    name: "Exterior Detailing",
    shortDescription: "Hand wash, decontamination, and finish protection for the outside of the vehicle.",
    longDescription:
      "A thorough hand wash and decontamination process — foam pre-soak, contact wash, clay/chemical decontamination, wheels and tires, and a protective sealant or wax finish.",
    included: [
      "Foam pre-soak + hand wash",
      "Chemical decontamination",
      "Wheel & tire detail",
      "Door jambs & exterior trim",
      "Protective wax or sealant",
    ],
    idealFor: "Regular maintenance and keeping paint protected from Florida sun and salt air.",
    category: "exterior",
    verified: false,
    icon: "Droplets",
  },
  {
    slug: "full-detail",
    name: "Full Detail",
    shortDescription: "The complete interior + exterior package in one visit.",
    longDescription:
      "Interior Detailing and Exterior Detailing combined into a single, complete service — the most popular option for a full top-to-bottom refresh.",
    included: ["Everything in Interior Detailing", "Everything in Exterior Detailing", "Final quality walkthrough"],
    idealFor: "Vehicles overdue for attention, or anyone who wants a complete transformation in one appointment.",
    category: "full-detail",
    verified: false,
    icon: "Crown",
  },
  {
    slug: "paint-correction",
    name: "Paint Correction",
    shortDescription: "Machine polishing to remove swirls, scratches, and oxidation and restore clarity.",
    longDescription:
      "Multi-stage machine polishing that removes light-to-moderate swirl marks, scratches, and UV oxidation, restoring depth and gloss before protection is applied.",
    included: ["Paint inspection & test spot", "Machine compounding/polishing", "Swirl & light scratch removal", "Gloss-restoring finish"],
    idealFor: "Vehicles with visible swirls, dullness, or sun-faded paint — a common issue in Southwest Florida.",
    category: "paint",
    verified: false,
    icon: "Wand2",
  },
  {
    slug: "ceramic-coating",
    name: "Ceramic Coating",
    shortDescription: "Long-term paint protection with a durable hydrophobic finish.",
    longDescription:
      "A professional-grade ceramic coating applied after paint correction, giving long-term protection against UV, water spots, and contamination with a deep, glossy finish.",
    included: ["Paint decontamination", "Surface prep", "Ceramic coating application", "Cure guidance & aftercare"],
    idealFor: "Owners who want the strongest, longest-lasting protection against Florida sun and hard water.",
    category: "protection",
    verified: false,
    icon: "ShieldCheck",
  },
  {
    slug: "headlight-restoration",
    name: "Headlight Restoration",
    shortDescription: "Restore clouded, oxidized headlights to a clear, like-new finish.",
    longDescription:
      "Wet-sanding and polishing to remove UV oxidation and haze from headlight lenses, improving both appearance and nighttime visibility, finished with a UV-protective sealant.",
    included: ["Oxidation removal", "Multi-stage polish", "UV-protective sealant"],
    idealFor: "Vehicles with hazy, yellowed, or cloudy headlights from sun exposure.",
    category: "add-on",
    verified: false,
    icon: "Lightbulb",
  },
  {
    slug: "truck-suv-detailing",
    name: "Truck & SUV Detailing",
    shortDescription: "Detailing scaled and priced for larger interiors and exteriors.",
    longDescription:
      "The same Interior, Exterior, or Full Detail process, sized for trucks and SUVs — larger cabins, third rows, running boards, and taller exteriors.",
    included: ["Full interior or exterior detail, sized for larger vehicles", "Running boards & lift-gate detail", "Cargo area detail"],
    idealFor: "Trucks, SUVs, and larger family vehicles.",
    category: "add-on",
    verified: false,
    icon: "Truck",
  },
];

export const serviceCategoryLabels: Record<Service["category"], string> = {
  interior: "Interior",
  exterior: "Exterior",
  "full-detail": "Full Detail",
  paint: "Paint",
  protection: "Protection",
  "add-on": "Add-On",
};
