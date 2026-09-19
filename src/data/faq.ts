// ============================================================================
// FAQ — general detailing-education answers are marked verified: true (they
// are factual regardless of the client's specific business), business-policy
// answers (appointments, service area, quote process) are drafted generically
// and marked verified: false pending client confirmation.
// ============================================================================

import type { FaqItem } from "@/types";

export const faqItems: FaqItem[] = [
  {
    id: "what-is-full-detail",
    question: "What does a full detail include?",
    answer:
      "A full detail combines a complete interior deep clean (vacuum, steam extraction, seat and carpet shampoo, dash and console detailing) with a full exterior service (hand wash, decontamination, wheels and tires, and a protective wax or sealant). It's the most thorough single-visit service.",
    verified: false,
  },
  {
    id: "how-long-does-detailing-take",
    question: "How long does detailing take?",
    answer:
      "Timing depends on the vehicle's size and condition and the service selected. Interior-only or exterior-only services are typically quicker than a full detail; paint correction and ceramic coating take longer due to multi-stage prep and cure time.",
    verified: false,
  },
  {
    id: "need-appointment",
    question: "Do I need an appointment?",
    answer: "Getting a quote first and scheduling ahead is the fastest way to lock in a time slot.",
    verified: false,
  },
  {
    id: "trucks-suvs",
    question: "Do you detail SUVs and trucks?",
    answer: "Yes — services are available for cars, trucks, and SUVs, scaled to the vehicle's size.",
    verified: false,
  },
  {
    id: "remove-stains",
    question: "Can you remove stains?",
    answer:
      "Most common interior stains (drinks, food, mud, light pet stains) respond well to steam extraction and targeted spot treatment. Results depend on the stain's age, type, and how deeply it has set into the fabric or carpet fibers.",
    verified: true,
  },
  {
    id: "odor-removal",
    question: "Can detailing help with odors?",
    answer:
      "Yes. Odor sources are usually trapped in carpet, seat padding, or the HVAC system. A deep interior extraction combined with odor treatment addresses the source rather than masking it.",
    verified: true,
  },
  {
    id: "how-often",
    question: "How often should I detail my vehicle?",
    answer:
      "In Southwest Florida's sun, humidity, and pollen, a maintenance exterior detail every 2–3 months and a full interior/exterior detail 2–4 times a year keeps paint protected and the cabin fresh — more often for daily beach or work-site use.",
    verified: true,
  },
  {
    id: "paint-protection",
    question: "Do you offer paint protection?",
    answer: "Paint correction and ceramic coating are both available for longer-term protection and gloss.",
    verified: false,
  },
  {
    id: "where-located",
    question: "Where are you located?",
    answer:
      "We serve the Southwest Florida / 941 area. (Exact address to be confirmed — call for the most current location.)",
    verified: false,
  },
  {
    id: "service-areas",
    question: "What areas do you serve?",
    answer: "The greater Southwest Florida / 941 region. Call to confirm coverage for your specific area.",
    verified: false,
  },
  {
    id: "get-a-quote",
    question: "How do I get a quote?",
    answer:
      'Use the "Get a Quote" form to tell us about your vehicle and what you need, or call us directly for a faster answer.',
    verified: false,
  },
];
