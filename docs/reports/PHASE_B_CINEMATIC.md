# Phase B + C — Cinematic Spatial Navigation (Build My Detail)

Status: web-native prototype, behind a feature flag, on `claude-dev`.
Scope: the single **Build My Detail** interaction only (the homepage section's
primary CTA + its "where do you want to start?" service grid). Not applied to
the ServiceSelector cards or anywhere else yet, by instruction.

## Goal

Clicking Build My Detail should feel like the interface physically reorganizes
around the click — not a modal pop, not a route swap. The origin CTA expands
into the quote experience; backing out collapses it back into that same CTA.

## Architecture (why an in-place overlay, not a route)

The hard constraints pull against a real navigation:

- no page flash, no abrupt route swap
- preserve scroll position and page context
- preserve browser Back behaviour
- a reverse that collapses back toward the *exact* origin element

The only approach that satisfies all of them at once is an **in-place,
portal-rendered overlay driven by a shared-element FLIP**, with history state —
not a Next route change. The homepage never unmounts, so scroll/context are
preserved for free; Back is wired through `history.pushState` + `popstate`.

### Pieces

- `src/lib/flags.ts` — `cinematicEnabled()`. Build default via
  `NEXT_PUBLIC_CINEMATIC` (`"off"` disables); instant per-session kill switch
  via `?cinematic=off` / `?cinematic=on` (persisted to `localStorage`). Read at
  click-time so triggers always render as plain links (no hydration mismatch).
- `src/components/cinematic/BuildMyDetailTrigger.tsx` — renders a real
  `next/link` to `/contact` (progressive enhancement: works with no JS, before
  the chunk loads, and when the flag is off). On a plain left-click with the
  flag on, it intercepts and opens the overlay anchored to *this* element;
  hover/focus warms the lazy chunk.
- `src/components/cinematic/CinematicContext.tsx` — provider that owns:
  scroll lock, the "recede" transform, background `inert`, history/Back,
  focus save/restore, device-tier + reduced-motion detection, and the lazy
  (`import()`) mount of the overlay via a portal to `document.body`.
- `src/components/cinematic/CinematicOverlay.tsx` — the animated surface
  (lazy-loaded). Imperative Framer Motion so the reverse is an exact mirror of
  the forward transition. Contains the Phase-C quote form.

### The transition itself (forward)

1. Measure the clicked element's rect (the origin) + its border-radius.
2. Lock scroll (`position:fixed` on `<body>`, scrollbar-width compensated) and
   push a history entry. Save the trigger element for focus restore.
3. **Recede** the page: the normal-flow content wrapper
   (`[data-cinematic-recede]`, i.e. `main` + footer) gets
   `transform: scale(0.94)` + `blur` + `brightness(0.5)`, with
   `transform-origin` set to the click point so it recedes *away from* where the
   user clicked (focal movement / depth). The fixed chrome (Header,
   MobileActionBar) is deliberately **outside** this wrapper to avoid the
   `position:fixed` + transformed-ancestor jump.
4. **Expand** the overlay: a single "surface" layer (no text) scales out of the
   origin rect to the full panel frame via a FLIP (`scaleX/scaleY` + `x/y` from
   measured origin→target). Because only the text-free surface scales, the form
   content never distorts — it cross-fades in ~140ms later.

### Reverse navigation

There is one close funnel: **`popstate`**.

- UI close (Escape, backdrop, the × button, or finishing the form) calls
  `history.back()`, which pops the pushed entry and fires `popstate`.
- The browser **Back button** fires the same `popstate`.

`popstate` → `beginClose()` → the overlay plays the reverse (content fades out,
the surface collapses back into the recomputed origin rect, backdrop fades) →
on completion, `finalize()` unlocks scroll, **restores the exact scroll
position instantly** (temporarily disabling `scroll-behavior: smooth` so the
restore doesn't animate), clears `inert`, and **returns focus to the
originating CTA**. So Back and "close" are physically identical: you back out of
the experience, you don't dismiss a modal.

## Accessibility

- `role="dialog"`, `aria-modal="true"`, labelled by the title.
- Background marked `inert` + `aria-hidden` while open.
- Focus moves into the dialog on open (with `preventScroll`, so the mobile
  keyboard isn't yanked up), is trapped on Tab, and is restored to the trigger
  on close.
- Escape closes; the Back button closes.
- `prefers-reduced-motion`: no camera travel — the surface and content simply
  cross-fade, and the page only dims (no scale/blur/origin travel). Escape,
  Back, focus and scroll behaviour are identical.

## Performance

- **No new dependency.** Framer Motion is already in the homepage bundle
  (Header + Hero use it); the overlay reuses it.
- **Code-split.** The overlay + quote form are a dynamic `import()`; the
  homepage's client-reference manifest contains neither. Deferred chunk is
  ~12KB gzip, fetched on hover/focus (warm) or first click.
- **No perpetual RAF.** The recede is a one-shot CSS transition; the overlay
  uses finite Framer Motion animations that settle and stop. Nothing polls.
- **Mobile GPUs.** A "lite" tier (coarse pointer / ≤4GB deviceMemory / ≤430px)
  drops the backdrop-adjacent blur (scale + dim only) and shortens durations.
- Normal site interaction stays available before the chunk loads; if the chunk
  fails to load, the trigger falls back to real navigation to `/contact`.

## Phase C — cinematic lead capture

Integrated into the shared `QuoteFlow` (`variant="cinematic"`):

- Name required, Phone required, Email optional, with inline validation.
- Mobile input types / `inputMode` (`tel`, `email`, `numeric`) + `autocomplete`
  (`name`, `tel`, `email`) + `autoCapitalize`.
- A visible **"Skip — I'll add it at the end"** on the contact step; Review then
  gates submission until name + phone are present ("Add contact info").
- **Partial input is preserved** across exit/re-enter via `sessionStorage`
  (`dk:quote:build-my-detail`), cleared on successful submit.

### Submission — honest, non-blocking

- Client POSTs to `src/app/api/lead/route.ts` (server-side validation is
  authoritative).
- `src/lib/leads.ts` `deliverLead()` is the single transport seam. If
  `LEAD_WEBHOOK_URL` is set it forwards and reports `delivered:true` only on a
  2xx; otherwise it runs a **development fallback** that captures the lead in
  the server log and returns `delivered:false, mode:"dev-fallback"`. It never
  reports a lead as delivered when it wasn't.
- **Before production:** set `LEAD_WEBHOOK_URL` (CRM/Zapier/email endpoint) so
  the "we'll follow up" promise is real. Until then, no lead is delivered
  anywhere.

## Feature flag

- Off by build: `NEXT_PUBLIC_CINEMATIC=off`.
- Off instantly (no redeploy): `?cinematic=off` on any URL (sticky per browser),
  or `localStorage["dk:cinematic"]="off"`.
- When off, every Build My Detail CTA is an ordinary link to `/contact`.

## Unreal Engine — where rendered media would materially help (next iteration)

The web-native prototype proves the *interaction*. It does not need an Unreal
runtime in the browser (that would violate the bundle/CWV budget). Unreal as a
**production tool** could raise the ceiling on the *content inside* the moment:

1. **Match-cut origin plate.** A short Unreal-rendered clip of a vehicle surface
   (paint / headlight) that visually matches the CTA's start frame, so the
   expand reads as pushing *into* a real surface rather than into a dark panel.
2. **Camera-move reference.** An Unreal camera dolly/push-in as the reference
   curve for the expand/collapse easing and parallax, to tune the "physical"
   feel precisely.
3. **Lighting/vehicle transition plate.** A pre-rendered loop (graded, with the
   existing grain overlay) behind the first form step, giving the surface depth
   without runtime 3D — delivered as an optimized, lazy-loaded video/poster.

All three are optional, additive assets delivered through the existing media
registry; none blocks Phase B/C. Recommended only after the interaction and
copy are locked, so rendered frames are cut to the final timing.

## Verified

- lint + typecheck + production build: clean.
- 38-scenario browser pass: open/close, no route swap, scroll lock + exact
  restore, background inert, focus restore to trigger, Back-button close,
  service preselect, close-button reverse, draft persistence, reduced motion,
  and no horizontal overflow / zero console errors at 375 / 390 / 430 and
  desktop. Full submit + Skip + Review-gating pass. `/api/lead` returns
  `delivered:false` (dev fallback) and 422 on missing fields.

## Remaining visual QA (human eyes)

- Confirm the expand/collapse *timing* feels physical on a real mid-range phone
  (emulation ≠ real GPU).
- Tune blur radius vs. readability on the recede for OLED/high-DPI.
- Confirm the origin-rect FLIP reads well from the small service-grid links (tiny
  origin → large panel is a big scale delta).
- Decide whether Header/MobileActionBar should also subtly dim during the
  transition (currently just covered).
