# Detail Kings 941 — Website

Next.js (App Router) + TypeScript + Tailwind v4 project for the Detail Kings
941 website. Built by Claude for Wavy Sites — Phase 1 (homepage vertical
slice + IA + SEO/AEO foundation + quote flow UI) and Phase 2 (real client
photography, logo, and brand-verified design tokens).

## Running locally

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
npm run lint       # eslint
```

## ⚠️ Before this goes live, read `docs/reports/PHASE_2_COMPLETION_REPORT.md`

As of Phase 2, real client photography, the official logo, and a brand-
verified color palette are live (see `src/data/media.ts` and
`src/app/globals.css`). What's still open:

1. **The business address is unresolved.** `src/data/business.ts` documents
   a conflict between a Port Charlotte address (from the client handoff) and
   a Facebook page titled "North Port FL". Do not publish a street address
   until this is confirmed — fill in `business.location.confirmed` once it
   is.
2. **Service pricing and the service catalog are still drafts** (`verified:
   false` in `src/data/services.ts`) — no real pricing was supplied.
3. **No verified reviews yet** — the Reviews section links out to Google
   instead of showing testimonials.
4. **Shop/team photos** — none were included in either asset handoff; those
   slots keep the designed placeholder treatment (see
   `src/components/media/PlaceholderMedia.tsx`).

## Where things live

- `src/data/` — all content: business NAP, services (draft, `verified:
  false` until confirmed), FAQ, differentiators, reviews (empty — none
  verified yet), media registry.
- `src/components/home/` — homepage sections, in the order they render.
- `src/components/layout/` — header, footer, mobile sticky action bar.
- `src/components/forms/QuoteFlow.tsx` — the 5-step quote UI. `handleSubmit`
  is a stub (no backend wired up yet, per instruction not to connect
  third-party services without sign-off) — wire it to a real endpoint/CRM
  when ready.
- `src/lib/schema.ts` — JSON-LD (LocalBusiness/AutomotiveBusiness, WebSite,
  FAQPage, BreadcrumbList). Address/aggregateRating are omitted until the
  location and review data above are confirmed real.
- `src/app/` — routes: `/`, `/services`, `/services/[slug]`, `/gallery`,
  `/about`, `/reviews`, `/faq`, `/contact`, plus `robots.ts`/`sitemap.ts`.

## Design system

Tokens live in `src/app/globals.css` (`@theme`) — ink (near-black) / steel
(neutral gray) / lime (brand green) / chrome color scale, Oswald (display) +
Manrope (body) via self-hosted `@fontsource` packages (no external font
requests). The palette is brand-verified, not invented: extracted directly
from the client's real logo files and cross-checked against their
`site.webmanifest` theme color — see
`docs/reports/PHASE_2_COMPLETION_REPORT.md` for the full verification pass.

## Not yet built (next phase, per the production brief)

- Real video integration (photos are in; no video was supplied)
- `/service-areas/*` location pages (intentionally not built yet — spec
  says don't generate location pages before the location is confirmed)
- Backend wiring for the quote form (CRM/email/API)
- Full content authority pages (Florida car-care guides, section 22)
