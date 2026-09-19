# Detail Kings 941 — Website

Next.js (App Router) + TypeScript + Tailwind v4 project for the Detail Kings
941 website. Built by Claude for Wavy Sites as Phase 1 (homepage vertical
slice + IA + SEO/AEO foundation + quote flow UI).

## Running locally

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
npm run start     # serve the production build
npm run lint       # eslint
```

## ⚠️ Before this goes live, read `ASSET_AUDIT_REPORT.md` (project root, one level up)

Two things are still open and are flagged throughout the code:

1. **No real photos, video, or logo exist yet.** Every image on the site is
   a designed placeholder (see `src/components/media/PlaceholderMedia.tsx`).
   Drop real files into `/public/images/...` and update the matching entry
   in `src/data/media.ts` (`status: "real"`, real `src`/`width`/`height`) —
   no component code needs to change.
2. **The business address is unresolved.** `src/data/business.ts` documents
   a conflict between a Port Charlotte address (from the client handoff) and
   a Facebook page titled "North Port FL". Do not publish a street address
   until this is confirmed — fill in `business.location.confirmed` once it
   is.

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

Tokens live in `src/app/globals.css` (`@theme`) — ink/steel/ember/tide color
scale, Oswald (display) + Manrope (body) via self-hosted `@fontsource`
packages (no external font requests). Everything under a `DRAFT` comment in
that file is provisional and should be revisited once a real logo exists.

## Not yet built (next phase, per the production brief)

- Real photography/video integration
- `/service-areas/*` location pages (intentionally not built yet — spec
  says don't generate location pages before the location is confirmed)
- Backend wiring for the quote form (CRM/email/API)
- Full content authority pages (Florida car-care guides, section 22)
