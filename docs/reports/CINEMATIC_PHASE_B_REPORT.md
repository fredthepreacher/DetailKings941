# Detail Kings 941 — Cinematic Spatial Navigation · Phase B Report

Wavy Sites / Claude · 2026-09-25 · Branch `feat/cinematic-navigation` · code
commit `f07dafd` · `main` and `claude-dev` untouched · Vercel **preview only**
(not promoted).

## What was built

**One doorway, both directions: Build My Detail.** The seven service tiles
and "Start My Quote" in the Build My Detail section each open the quote
experience by travelling into *the exact element touched*. The reverse
journey is the same path played backwards.

| Moment | What happens |
|---|---|
| Tap (frame 0–1) | Tile compresses (`active:scale`). The overlay mounts on the *same frame* with its frame clipped to the tile's exact rect and radius, and a chip that is pixel-aligned over the tile's icon + label. Measured tap → first overlay frame ≈ 1 frame; visibly moving by 15–29 ms. |
| Dolly-in (~720 ms spring, no bounce) | The live page scales ~7% around the tile and drifts it toward screen center. The page dims and header/mobile bar recede. The tile's frame opens to the viewport. The chip travels + scales into the new top bar. Real client media and a faint technical grid fade in behind. The quote flow rises in last. |
| Arrive | Focus moves to the "Build My Detail" heading. The URL is `/build-my-detail?service=…`. The page underneath is `inert` and its videos are paused. |
| Reverse (Back button, ×, Esc, browser Back) | The source is re-measured (resize/rotation safe) and the same spring runs to 0. The chip lands on the tile a beat before the frame closes, and the overlay dissolves into the real tile (no snap). Scroll position is unchanged (the page never scrolled), focus returns to the tile, and videos resume. Browser Back starts the reverse on the `popstate` itself. |
| Interruption | Back/Esc mid-flight retargets the spring from wherever it is. Tested at 180 ms into the open. |

## Architecture

- **Routing:** intercepting + parallel routes.
  - `app/@cinema/(.)build-my-detail` renders only a route marker; the page underneath never unmounts.
  - `app/build-my-detail` is the real full page for refresh, deep links and shares (`noindex, follow`, canonical → `/contact`). `/contact` is unchanged and remains the indexable quote page.
- **Lifetime:** `CinematicHost` (always mounted, flag-on only) owns the overlay's visual lifetime via a tiny external store (`lib/cinematic/store.ts`). This is what lets the reverse journey play *after* browser Back has already unmounted the route.
- **Motion:** Framer Motion (already a dependency) drives one progress value `p`. Every layer is a function of `p`, and each write is transform / opacity / clip-path on fixed layers. There is no layout work per frame except one childless hairline element.
- **Not View Transitions API:** it can't be interrupted/reversed mid-flight, it blocks input on named elements, and Safari support is uneven. See the Phase A audit.
- **Not React.lazy:** a lazy component suspends at least once even when already loaded, and React throttles Suspense reveals (~300 ms). That showed up as a dead pause after the tap in testing. The module is instead preloaded on intent and rendered directly.
- **No Unreal, no Three.js.** All depth is CSS transforms + real client media.

## Performance

| | Baseline (`0a1c1dd`) | Phase B | Budget |
|---|---|---|---|
| Homepage initial JS (gzip) | 254.0 KB | **257.4 KB (+3.4 KB)** | ≤ +6 KB |
| Loaded on intent (doorway within ~1 screen, hover, focus, touch) | — | **17.0 KB** gzip | ≤ 25 KB |
| New media bytes | — | 0 (reuses shipped photos/posters) | 0 |
| Route rendering | 18 routes | 20 routes; every existing route keeps its mode (static stays static) | — |

Frame pacing was measured in headless Chromium, which uses software rendering with no GPU:

- Steady 16–17 ms frames through the journey.
- One 33–67 ms frame at overlay mount (React commit of the quote flow + image decode).
- Reverse ≤ 18 ms on mobile.

Real devices with a GPU should be better; this still needs on-device confirmation (below).

## Other changes (audit low-risk items, as instructed)

- **QuoteFlow contact step:** explicit `label[for]`, `name`/`autocomplete`/`inputMode`/`enterKeyHint`. Name and mobile are required; email is optional but validated. US phone validation accepts 10 digits or `1`+10. Errors are linked via `aria-describedby` + `aria-invalid` and announced (`role="alert"`). Continue explains instead of silently disabling, and focuses the first invalid field. The year field is digits-only.
- **Reduced motion:** a root `MotionConfig reducedMotion="user"` means the existing Framer animations (hero entrance, infinite scroll cue) now honor it.
- **Scroll:** `data-scroll-behavior="smooth"` (Next 16 opt-in) suspends smooth scrolling during navigations. `scrollbar-gutter: stable` stops the page shifting when scroll is locked.
- **Dependencies:** removed `@fontsource-variable/oswald` + `manrope` (verified unreferenced). README font line corrected.

## Feature flag

`NEXT_PUBLIC_CINEMATIC_EXPERIENCE` is resolved in `next.config.ts`:

- An explicit value always wins.
- Otherwise it defaults **on** for local dev + Vercel previews and **off** for Vercel production.

A production build can't pick it up by accident. With the flag off, all doorways are plain links to `/contact`, the host isn't rendered, and `/build-my-detail` redirects to `/contact`.

## Analytics hooks

Events are pushed to `window.dataLayer` + a `dk:analytics` CustomEvent. They never contain form values.

`cinematic_transition_started` · `service_selected` · `cinematic_transition_completed` (with ms) · `build_my_detail_opened` · `cinematic_transition_abandoned` (with progress) · `cinematic_closed`.

## Test results (production build, headless Chromium)

The journey suite ran at 1440, 375, 390, 430, and 390 + desktop with `prefers-reduced-motion`. **All 6 pass.**

Each run checks:
- **Open:** URL, dialog labelling, focus on the heading, page `inert`, scroll locked.
- **Close paths:** browser Back, browser Forward (reopens), Esc, the × button, and interruption mid-open. Each ends with the overlay gone, focus back on the source, and the **scroll position identical**.
- **Both source types:** the lime CTA source and the tile source.
- **Direct loads:** deep link/refresh renders the full page (`noindex`, canonical `/contact`).
- **Console errors:** zero.

Contact-form validation was tested separately (empty, invalid and valid paths). `tsc`, `eslint` and `next build` are clean.

## Needs human visual QA

1. **Real devices.** iPhone Safari (address-bar resizing while open, iOS `overflow:hidden` scroll lock, rubber-banding inside the overlay) and a mid-range Android for frame pacing at mount.
2. **Taste.** Is the ~720 ms open / ~600 ms close spring the right weight? Is the 7% dolly enough "camera", or too much?
3. **Lime CTA → dark interface.** The "Start My Quote" chip keeps the lime, but the frame behind it is ink from the start. Decide whether that reads as intended.
4. **Safari.** Clip-path animation smoothness on older iOS.

## Known limitations

- Only the Build My Detail section's doorways are cinematic. Hero, header, mobile-bar and ServiceSelector CTAs still go to `/contact` (Phase D/E).
- Quote state isn't preserved across close → reopen yet (Phase C, with the lead card).
- Browser *Forward* into the overlay has no source element, so it opens from a centered aperture instead.
- Lead submission is still the pre-existing stub. No lead destination exists anywhere in the project (Phase C adds the provider-agnostic submission layer).

## Next: Phase C

Integrate the Name / Mobile / Email lead card into this same journey, with a visible "Skip — I'll add it at the end". Lift quote state into a provider (memory + `sessionStorage`) so values survive back-out/re-entry. Add a provider-agnostic `submitLead()` layer with an explicit dev/preview mode that never claims delivery.
