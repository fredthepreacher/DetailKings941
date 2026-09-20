# Detail Kings 941 — Phase 2.5 Completion Report
Cinematic Creative-Direction + Video Integration Pass · Wavy Sites / Claude · 2026-09-20

An art-direction, video, motion, and graphic-design pass on the existing working site
— not a rebuild. Architecture, routing, quote flow, centralized data, SEO/schema,
accessibility, CI, and Git discipline were all preserved. All work is on `claude-dev`;
nothing was promoted to `main`.

## 1. WIP REVIEW — what was present on resume

The interrupted state already had: audited/encoded video derivatives (H.264 desktop +
mobile + WebP posters) from the client's own clips; new native-resolution photography
converted from HEIC; a working `VideoMedia` component (autoplay/muted/loop, lazy,
viewport-gated, reduced-motion → poster); a cinematic video hero; a new ResultsReel
section; a foam-wash motion tile in Process; an editorial masonry gallery; and the
Phase 2.5 graphic vocabulary in `globals.css`. Build/lint/typecheck were green.

## 2. IMPROVEMENTS made this pass (beyond the interrupted version)

- **Services section rebuilt.** It was still the "six equal cards" pattern the brief
  warns against. Replaced with an editorial split: a large **image-led featured service**
  (Full Detail, real Bentley photo) beside a **numbered index** (01–06) of the rest with
  hairline dividers and lime hover accents. Real hierarchy, tied to real work.
- **Final CTA motion.** The closing CTA was a static image; it now runs a subtle,
  heavily-darkened result-walkaround loop (reusing an already-shipped derivative — no
  new payload), viewport-gated and reduced-motion safe.
- **Mobile overflow fix.** The new bare `grid` bases allowed auto-width columns to exceed
  the viewport (a real 674px-on-390px regression the featured tile introduced). Added
  explicit `grid-cols-1` bases to Services, ResultsReel, and Process. Re-verified: no
  horizontal overflow at 375/390/430.
- **Address reverted to pending** (see §15) per your instruction.

## 3. HERO

Compared all clips; **IMG_8059** (Mercedes foam wash in front of the lime wash-bay)
remains the strongest — it's active *process* energy, not a static walkaround, and the
green structure behind the car ties the frame to the brand color with no overlay tricks.
Trimmed to a 7.5s loop; 720×1280 desktop MP4 (2.8 MB) + 480×854 mobile MP4 (948 KB) +
WebP poster (also the reduced-motion still). Autoplay, muted, loop, `playsInline`, dark
cinematic gradients + film grain for legibility, lime accents, high-contrast CTAs.

## 4. VIDEO — every clip and where it lives

| Placement | Clip | Behavior |
|---|---|---|
| Hero | IMG_8059 (Mercedes foam wash) | eager, autoplay |
| Process tile | IMG_9073 (dark SUV foam bath) | lazy, viewport-gated |
| Results reel | IMG_5418 (Ford Tremor, van in frame) | lazy, viewport-gated |
| Results reel | IMG_8323 (BMW X7 walkaround) | lazy, viewport-gated |
| Final CTA (bg) | IMG_8323 reused (darkened) | lazy, viewport-gated |

All non-hero clips fetch their source only within 200px of the viewport, **play on enter
/ pause on exit**, and fall back to a poster still under `prefers-reduced-motion` (QA
confirmed zero `<video>` elements in that mode). Never more than one or two playing at
once. IMG_9780 and IMG_7474 were used for brand verification, not published.

## 5. GRAPHIC DESIGN

Restrained editorial-automotive vocabulary, centralized in `globals.css` and reused:
edge labels (uppercase micro-labels with a lime tick), chrome hairlines, oversized
outlined "ghost" type (the "FINISHED" wordmark behind the reel; 01–04 process numerals),
film grain over footage, controlled lime glow, asymmetric composition (offset reel tile),
and oversized display headlines. No racing flags, flames, gold, neon, or endless rounded
cards. The homepage rhythm now varies deliberately: cinematic hero → editorial services
split → transformation feature → results reel → masonry gallery → process split → CTA.

## 6. BRAND

The mandatory revalidation against the **real wrapped van** was possible for the first
time (Phase 2 had no van photo). I pixel-sampled the saturated-green wrap regions in
IMG_9780/IMG_7474 and compared them to the logo vinyl and the current `--color-lime-500`
token. **Finding: the token holds — no change.** The wrap's intrinsic green is the same
spring-green family as the logo; its apparent hue drifts warmer/desaturated in the clips
only because of outdoor lighting on a curved panel. Black/white/chrome relationships
match. Green is used as energy and recognition (CTAs, accents, labels, hovers), not
smeared across every surface.

## 7. GALLERY

Moved from an equal-weight grid to an **editorial masonry** that runs photos at their
natural aspect ratio (no aggressive cropping, per the authenticity rules) and leads with
the new native-resolution photography (1200–1600px) — several with the branded van in
frame as real brand-in-context proof. Weaker 412px social upscales were demoted; B/C
assets were held rather than shown.

## 8. SERVICES

Homepage Services is now an image-led featured tile + numbered index (see §2). Per-service
detail pages continue to lead with real representative photos; Full Detail and Headlight
Restoration were upgraded to the new native-resolution photography. No invented pricing or
unverified inclusions — service copy remains the labeled draft pending client confirmation.

## 9. MOBILE

Designed, not shrunk: hero uses a dedicated portrait crop + the lighter mobile MP4;
results reel and process tiles collapse to single-column portrait (phone-native framing);
gallery masonry drops to one column; the services split stacks (featured tile then index);
type scales per breakpoint. Verified at **375 / 390 / 430 / 768 / 1440** — no horizontal
overflow, sticky action bar and tap targets intact.

## 10. PERFORMANCE

Source → optimized: the four used source clips total ~17 MB of raw MOV; shipped
derivatives total ~8 MB, and only the hero loads up front (948 KB mobile / 2.8 MB
desktop, chosen responsively). The below-the-fold clips (1.1–2.0 MB) don't fetch until
near-viewport and pause offscreen; the CTA reuses an already-shipped file (no new bytes).
Posters are 32–116 KB WebP. New photography: 11 WebP at 3.2 MB total. No new
render-blocking requests; hero uses `priority`, everything else stays lazy.

## 11. QA

- `npx tsc --noEmit` — clean
- `npm run lint` — clean
- `npm run build` — clean, 18 routes generated
- Visual (Playwright): hero, services, transformation, results reel, gallery, process,
  final CTA across 375/390/430/768/1440; reduced-motion pass confirmed poster-only;
  address-leak check on rendered HTML + JSON-LD confirmed **no address emitted**.
- No unit-test suite exists in the project yet.

## 12. GIT

Branch `claude-dev`. Phase 2.5 checkpoints: `8982bdd` (cinematic pass) → `7e73153`
(report) → `cab664d` (senior-review improvements — the Phase 2.5 code checkpoint), with
this report as the commit on top (its exact SHA is in the chat handoff / bundle). On top
of `6669180` (Phase 2 + CI) and `f52dde7` (Phase 2). `main` untouched at `30a9bc1`.

## 13. CI

The workflow runs on pushes to `claude-dev` (added in `6669180`). It will run against this
checkpoint **once the branch is pushed** — which must go through the `claude.ai/code`
bundle handoff, because this Cowork session cannot push (session-level git-proxy
restriction). CI status will be confirmable there.

## 14. VERCEL

I **cannot push from this session**, so the Vercel Preview cannot be created or verified
from here — it updates once `claude-dev` is pushed via the handoff. The "review the
deployed preview" step therefore has to happen after that push lands; I've flagged this
honestly rather than claiming a preview I can't produce. Local production build + Playwright
QA stand in for as much of that verification as is possible without the deploy.

## 15. STILL UNRESOLVED (genuine client blockers)

1. **Business address** — the van-wrap candidate (14290 Tamiami Trail, North Port, FL
   34287) is documented and centralized but **held as a candidate, not wired in**, per
   your instruction. Footer shows service-area framing; schema emits no address. Needs
   your explicit confirmation before it goes live (then it's a one-line change in
   `business.ts`).
2. **Real service pricing** — still a labeled draft; none supplied.
3. **Verified reviews** — none retrievable; Reviews still links out to Google.
4. **Shop / team photos** — none in any handoff; those slots keep the designed placeholder.
5. **Team/owner headshots & storefront exterior** — would strengthen the LocalStory and
   About sections when available.
