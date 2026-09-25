# Detail Kings 941 — Cinematic Spatial Navigation · Phase A Audit

Wavy Sites / Claude · 2026-09-25 · Branch `feat/cinematic-navigation` (cut from
`claude-dev` @ `0a1c1dd`). `main` untouched at `30a9bc1`. No code changed in
this phase.

## 1. Repository state

| Item | Finding |
|---|---|
| Local clone | Was empty (unborn `main`, no checkout). Checked out `claude-dev` tracking `origin/claude-dev`. |
| Production branch | `main` @ `30a9bc1` (Phase 1 foundation). |
| Dev branch | `claude-dev` @ `0a1c1dd` — "premium homepage visual baseline". In sync with origin. |
| Experiment branch | `feat/cinematic-navigation` — `claude-dev` stays the rollback point. |
| CI | `.github/workflows/ci.yml` — lint, `tsc`, build on `main` + `claude-dev` pushes and PRs to `main`. Feature branch is covered once a PR targets `main`/`claude-dev`, or by adding it to the push filter. |
| Verification | `npm run build` clean (18 routes, Turbopack). Local dev runs clean with no console errors. |

## 2. Stack as it exists

- **Next.js 16.3.5** (App Router, Turbopack), **React 19.2.8**, TypeScript, Tailwind v4.
- **framer-motion 13.4** already installed and used (Hero entrance, Header menu, QuoteFlow step slides).
- No Three.js / R3F / GSAP, and no analytics of any kind.
- Fonts are self-hosted via `@fontsource`. `oswald` + `manrope` packages are still in `package.json` but no longer imported (dead deps).
- Next 16 ships React's `<ViewTransition>` + `<Link transitionTypes>` (v16.2+) and intercepting/parallel routes — all verified against `node_modules/next/dist/docs`.

**Baseline payload (homepage `/`)**: 11 JS chunks, **807 KB raw / 254 KB gzip**. This is the number the cinematic layer must not materially move.

## 3. What exists (relevant surfaces)

| Surface | File | Notes |
|---|---|---|
| Hero | `components/home/Hero.tsx` | Real foam-wash video, "Get a Quote" → `/contact`. |
| Service selector | `components/home/ServiceSelector.tsx` | Client tab list + preview panel (real photo, inclusions). Panel links: "Build My Detail" → `/contact?service=`, "Full Details" → `/services/[slug]`. **Ceramic Coating lives here** — the natural mid-page doorway. |
| Build My Detail | `components/home/BuildMyDetail.tsx` | Server component near the page bottom. "Start My Quote" + a 7-tile "Where do you want to start?" service picker, all plain links to `/contact?service=`. |
| Quote flow | `components/forms/QuoteFlow.tsx` | 5 steps: Vehicle → Services → Condition → Contact (name/phone/email) → Review. **Already captures name, phone, email.** `handleSubmit` is a stub: no backend, no storage. |
| Quote route | `app/contact/page.tsx` | Dynamic (reads `searchParams.service`). In sitemap. |
| Service detail | `app/services/[slug]/page.tsx` | SSG, breadcrumb JSON-LD, hero photo. |
| Mobile bar | `components/layout/MobileActionBar.tsx` | "Get a Quote" is a raw `<a href="/contact">` (full reload, not a client nav). |
| Media | `components/media/VideoMedia.tsx`, `data/media.ts` | Lazy, viewport-gated video, reduced-motion → poster. 5 real clips, ~40 real photos. |
| SEO | `lib/schema.ts`, `sitemap.ts`, `robots.ts` | AutomotiveBusiness, WebSite, FAQPage, Breadcrumb JSON-LD. Address deliberately withheld. |

There are 9 separate `/contact` CTAs across the site.

## 4. Gaps found that matter for this work

1. **Framer Motion ignores reduced motion.** The global CSS kill-switch only stops CSS animations. The Hero's JS entrance and its infinite scroll-cue loop still run. Fix: a root `<MotionConfig reducedMotion="user">`.
2. **`html { scroll-behavior: smooth }`.** This would make scroll restoration on the reverse transition *animate* instead of being instant. Needs a scoped override while the cinematic layer restores position.
3. **Quote contact step is weak.** Email is optional and phone isn't validated. The phone input has no `inputMode`, and inputs have no `name` attrs (hurts autofill). There's no `id`/`htmlFor` pairing either, although the wrapping `<label>` works.
4. **No lead destination.** Submissions go nowhere. Any cinematic lead capture needs a real endpoint decision (see §10), or it's theatre.
5. **No analytics layer.** Nothing to hook the requested events into.
6. **Scroll lock** (Header menu) toggles `body.overflow` with no scrollbar compensation, which causes a desktop layout shift. The overlay must not copy this.

## 5. Reuse / upgrade / don't touch

**Reuse:** QuoteFlow (as the destination interface and the single lead store); service data + real photography (the shared elements); `VideoMedia` (environment layer); framer-motion; the design tokens (`edge-label`, `rule-chrome`, `lime-glow`, grain).

**Upgrade:** QuoteFlow state lifted into a small provider so a partial lead survives open → close → reopen; contact-field validation + autofill attrs; MobileActionBar → client `Link`; root `MotionConfig`.

**Don't touch:** visual direction, copy, typography, colors, gallery, Transformation / ResultsReel / Process sections, JSON-LD, `sitemap`/`robots` (one addition only, see §7), and the `/contact` page behavior itself (it stays the conventional fallback and the control arm).

## 6. Recommended architecture — "Cinematic Spatial Navigation"

### The core idea

Use **intercepting + parallel routes**, so the destination opens *over* a still-mounted homepage.

- The source page never unmounts. That makes the reverse journey exact: the source element, the scroll position and the focus target all still exist.
- It also keeps the site a real website:
  - A click is a soft navigation, rendered in an `@cinema` slot as the cinematic overlay; the URL updates.
  - Refresh, deep link or share goes to the real full page (hard navigation, no interception).
  - Browser Back is `router.back()`, which plays the reverse transition.

```
app/
  layout.tsx                       ← renders {children} + {cinema}
  @cinema/default.tsx              ← null
  @cinema/(.)build-my-detail/page.tsx   ← overlay (soft nav)
  @cinema/(.)services/[slug]/page.tsx   ← Phase D doorway (soft nav)
  build-my-detail/page.tsx         ← full page (hard nav / refresh / share)
```

### Motion engine: Framer Motion (already shipped), not the View Transitions API, as the primary camera

The View Transitions API (and React `<ViewTransition>`) animates frozen bitmap snapshots. That falls short of the brief in four ways:

- It can't be interrupted or reversed mid-flight.
- It blocks input on named elements while it runs.
- It behaves inconsistently in Safari, which is iOS traffic.
- It has no spring physics.

The brief makes the reverse path mandatory and wants physical easing. With the overlay approach, both states are live DOM, so a **FLIP camera** gives us everything:

1. **Acknowledge (0–80 ms):** on `pointerdown`, the source compresses slightly (scale 0.98, lime edge). Input is acknowledged in the same frame. A tap never waits on the network — the route is already prefetched on intent.
2. **Dolly-in (~550 ms, spring):** the homepage layer scales around the source element's center (`transform-origin` = source rect), about 1 → 1.06. It dims to around 35% and gets a one-shot 4 px blur on a *single* composited layer (no continuous blur). This is the "camera moving toward it" illusion.
3. **Shared element:** the source card measures its rect. The overlay frame starts clipped to exactly that rect (`clip-path: inset()` + transform) and springs open to full viewport. The card *becomes* the interface. Its content (icon, service name, photo) is shared via `layoutId`, so it travels continuously.
4. **Depth layers:** the foreground UI, the source card, the environment media (real photo/video, slower parallax factor) and a faint technical grid (CSS, 1 layer). All are transform/opacity only.
5. **Arrive:** the overlay content fades up 12 px, and focus moves to the dialog heading.
6. **Reverse:** close, Esc, the back control or browser Back. The same spring runs backwards to the source rect, which is re-measured, so it survives resize and orientation change. Background scale and dim return to 1, focus returns to the originating control, and the scroll position is untouched because the page never scrolled. If the source scrolled off-screen or unmounted, the overlay collapses toward the viewport center with a short fade. It never jumps.

Because Framer Motion drives the camera, the transition is interruptible. Hitting Back mid-dolly just retargets the spring.

**No new runtime dependencies for Phases B–F.** Three.js/R3F would add ~150 KB+ gzip for depth we can fake convincingly with CSS 3D + layered media. I only recommend it if Phase G earns it, and then only dynamic-imported on intent.

### Feature flag / A-B arms

`NEXT_PUBLIC_CINEMATIC_EXPERIENCE` (build-time):

- **On:** cinematic CTAs link to `/build-my-detail`, which is intercepted.
- **Off:** every CTA keeps pointing at `/contact`, exactly today's behavior.

The two routes double as A/B arms later (cookie-assigned in middleware, no code change). The overlay chunk is code-split, so flag-off users download none of it.

## 7. Routing & SEO decisions

- New `/build-my-detail` full page = hero + QuoteFlow. `alternates.canonical` → `/contact`, so no duplicate-content split; it is not added to the sitemap.
- The Phase D service doorway intercepts the *existing* `/services/[slug]` URLs. Crawlers and hard navs get the same SSG pages as today, so SEO/JSON-LD are unchanged.
- All business content stays semantic HTML. The overlay is a `role="dialog"` with `aria-modal` and a labelled heading, not a canvas.

## 8. Unreal Engine 5.8 (installed at `C:\Program Files\Epic Games\UE_5.8`)

**Recommendation: don't use it for Phases B–F. Revisit at Phase G.**

- **Authenticity conflict.** There are no 3D scans of Detail Kings' real vehicles, van or bay. An Unreal-rendered car would be a fabricated "Detail Kings job", which the project's own authenticity rules (Phase 2 report) forbid.
- **The real media already carries the illusion.** Real media (foam footage, van-in-frame photos, before/afters) is stronger for a local business than CG.
- **A legitimate Phase G use exists:** a non-vehicle environment plate, e.g. a 1–1.5 s dark studio light-sweep / lime wash-bay light tunnel. It would be rendered to a ~300–500 KB WebM/MP4, used as the match-cut bridge in the dolly, and only preloaded on intent. It's worth a test only after Phase B proves the web-native version.

## 9. Performance budgets

| Metric | Budget |
|---|---|
| Initial homepage JS added by cinematic mode | **≤ 6 KB gzip** (intent listener + flag + context shell) |
| Overlay chunk (lazy, fetched on hover/focus/touchstart/near-viewport) | ≤ 25 KB gzip |
| LCP / CLS | unchanged from baseline; CLS 0 from the overlay (it's fixed-position) |
| Tap → first visual response | same frame (< 16 ms), INP < 200 ms |
| Transition frame pacing | transform/opacity/clip only; blur applied once to one layer, removed at rest |
| Media | no new bytes on initial load; overlay reuses already-shipped posters/photos |
| Offscreen | homepage videos pause while the overlay covers them (existing IO + explicit pause) |

## 10. Decisions needed from you before/during build

1. **Where do leads go?** There's no backend today. The options are a Next route handler plus an email service (e.g. Resend) or a CRM webhook. Until you decide, lead capture will validate and complete the UX but post to a stub, same as QuoteFlow now. I won't wire a third-party service without sign-off.
2. **Lead card placement.** The brief puts Name/Phone/Email *before* the configurator. I recommend offering it as the first card, but with a visible "Skip — I'll add it at the end" option. The existing flow still collects contact at step 4 regardless, so asking up front never blocks a quote.
3. **Email required?** QuoteFlow currently makes it optional. The brief lists all three. My recommendation is phone required, email optional (lower friction for a local service business).
4. **Pushing / preview.** CLAUDE.md authorizes pushing `claude-dev`. This experiment is on its own branch, so I'll push `feat/cinematic-navigation` for a Vercel preview only once you say so.

## 11. Proposed build order

- **B.** Build My Detail picker tile / "Start My Quote" → cinematic overlay → QuoteFlow, with reverse. Includes the flag, the MotionConfig fix and scroll-behavior handling.
- **C.** Lift QuoteFlow state into a provider. Add the lead card (name/tel/email, `autocomplete`, `inputMode`, validation) and a draft kept in memory + `sessionStorage` (never analytics). Add the `track()` dispatcher (`window.dataLayer` + `CustomEvent`, no PII).
- **D.** ServiceSelector preview panel (Ceramic Coating etc.) → intercepted `/services/[slug]` doorway.
- **E.** Test at 375/390/430, `visualViewport`-safe framing (`dvh`/`svh`), touch, keyboard, reduced motion (opacity + ≤ 0.98 scale only).
- **F.** Intent prefetch, bundle measurement vs. the §2 baseline, and memory/RAF leak checks.
- **G.** Optional Unreal plate (§8).
- **H.** QA matrix from the brief, then a preview deploy.
