# Detail Kings 941 — Phase 2.5 Completion Report
Cinematic Creative-Direction + Video Integration Pass · Wavy Sites / Claude · 2026-09-20

This was an art-direction, video, motion, and graphic-design pass on the existing,
working site — not a rebuild. The architecture, routing, quote flow, centralized
data layer, SEO/schema framework, CI, and Git workflow were all preserved. All work
is on `claude-dev`; nothing was promoted to `main`.

## MEDIA AUDIT

Every asset in the Phase 2.5 Drive package (11 MOV videos, 13 HEIC photos) was
inspected frame-by-frame (contact sheets from three timecodes per clip; full HEIC
conversions).

**Videos**

| File | Grade | Disposition |
|---|---|---|
| IMG_8059 (Mercedes foam wash, lime wash-bay) | A | **Used — homepage hero** |
| IMG_9073 (dark SUV foam bath) | A | **Used — Process motion tile** |
| IMG_5418 (Ford F-150 Tremor walkaround, van in frame) | A | **Used — Results reel** |
| IMG_8323 (white BMW X7 walkaround, van reveal) | A | **Used — Results reel** |
| IMG_9780 (bright-green branded van, close) | A / Brand | **Used — brand verification** (not published as a tile) |
| IMG_7474 (white sedan, branded van in scene) | B+ / Brand | Brand verification (secondary), held |
| IMG_5414 (truck exterior detailing) | B | Held — strong candidate for a future service page |
| IMG_5874 (blue truck, large wheels) | B | Held — automotive-culture moment |
| IMG_8060 (black sedan result, dealer lot) | B | Held — busier background |
| IMG_9103 (blue SUV result, parking lot) | B | Held |
| IMG_5864 (truck with pool-service branding) | **D** | **Excluded — another company** (see Excluded Content) |

**Photos**

| File | Grade | Disposition |
|---|---|---|
| IMG_5375 (yellow Jeep Wrangler + van) | A | **Used — gallery** |
| IMG_5373 (white Mercedes-AMG CLA + van) | A | **Used — gallery** (also an address source) |
| IMG_5310 (silver Kia K5 + van) | A | **Used — gallery** (also an address source) |
| IMG_8319 (white Toyota RAV4 + van) | A | **Used — gallery** |
| IMG_7115 (white Bentley Bentayga + van) | A | **Used — gallery + Full-Detail service** |
| IMG_6196 (red Corvette C8 foam bath) | A | **Used — gallery** (rotation-corrected) |
| IMG_9778 (van, full service list) | A / Brand | **Used — gallery** |
| IMG_0241 (Mercedes clear LED headlight) | A | **Used — Headlight-Restoration service** |
| IMG_7106 (van logo close-up) | B / Brand | Converted, held (brand asset) |
| IMG_9981 (Lincoln hazed headlight) | B | Converted, held (before-state candidate) |
| IMG_0239 (Mercedes hazed headlight) | B | Converted, held |
| IMG_9980 (gold sedan headlight close-up) | B | Held |
| IMG_5904 (4Runner mid-wash, heavy blue cast) | C | Not used — reference only |

Net: **8 A-grade photos and 4 video clips** entered visible sections; 2 clips were used
for brand verification; the rest are graded and held for future service/gallery expansion.

## VIDEO

Four clips were trimmed to their strongest 6.5–8s segments and transcoded to H.264
MP4 (`yuv420p`, `+faststart`) with WebP posters. Sources were rotation-flagged
(`rotation=-90`) portrait phone clips; the encode bakes in the correct orientation
and crops intentionally rather than shipping the raw file. No AI repainting, invented
reflections, or fabricated states — only trim, scale, and compression, per the
package's authenticity rules.

## HERO

Chosen clip: **IMG_8059** — the Mercedes being foam-washed in front of the client's
own lime-green wash bay. It's the strongest *active-detailing* motion in the batch
(process, not a static walkaround), and the green structure behind the car ties the
frame to the brand color without any overlay trickery. Trimmed to a 7.5s loop,
delivered as a 720×1280 desktop MP4 (2.8 MB) and a lighter 480×854 mobile MP4
(948 KB), with a WebP poster that doubles as the `prefers-reduced-motion` still.
Autoplay, muted, looped, `playsInline`.

## BRAND

The mandatory revalidation against the real wrapped vehicle was **finally possible**
this pass (Phase 2 had no van photo and relied on the logo alone). I pixel-sampled the
saturated-green regions of the actual wrap in IMG_9780/IMG_7474 and compared them to
the logo vinyl and the current `--color-lime-500` token (`#7CFF00`).

Finding: **the existing token holds — no change made.** The wrap's intrinsic green is
the same spring-green family as the logo; its apparent hue in the clips drifts slightly
warmer/desaturated (~`#9ccc66` in patches) purely because of outdoor lighting and shadow
on a curved panel, not because the brand color differs. Black + white + chrome/steel
relationships on the wrap match the token system exactly. So the real van *validated*
the Phase 2 palette rather than revising it — which is the honest result, and a stronger
footing than Phase 2 could claim.

## GRAPHIC DESIGN

Introduced a restrained editorial-automotive vocabulary (all in `globals.css`, reused
across sections — no scattered one-offs):

- **Edge labels** — uppercase micro-labels with a leading lime tick (`.edge-label`) as section markers.
- **Chrome hairlines** (`.rule-chrome`) — thin metallic gradient rules separating sections.
- **Ghost type** (`.ghost-type`) — oversized outlined numerals/words (the "FINISHED" wordmark behind the results reel, the 01–04 process numerals) for depth and layering.
- **Film grain** (`.grain-overlay`) — a fine SVG-noise overlay on footage so clips read as graded, not raw phone capture.
- **Controlled lime glow** + asymmetric offsets (the second results tile drops 4rem) for composition and rhythm.
- Oversized display headlines (hero now up to `8.5rem`), corner metadata, and a scroll cue.

No racing flags, flames, or car silhouettes — kept modern and confident.

## MOTION

Three deliberately spaced video moments, never all playing at once:

1. **Hero** (top) — cinematic foam-wash loop, eager/autoplay.
2. **Results Reel** (mid) — two portrait walkaround tiles (Ford Tremor with the van in
   frame; BMW X7), lazy + viewport-gated.
3. **Process** (lower) — a portrait foam-bath tile beside the numbered steps.

All non-hero video is wrapped in a shared `VideoMedia` client component:
`IntersectionObserver` loads the source only within 200px of the viewport, **plays on
enter and pauses on exit**, swaps to a lighter mobile derivative under 768px, and —
under `prefers-reduced-motion` — renders the poster still and never plays. Verified in
QA: reduced-motion produced **zero `<video>` elements**.

## PERFORMANCE

Source → optimized: the four used source clips total ~17 MB of raw MOV; shipped
derivatives total ~8 MB, and only the hero loads up front (948 KB mobile / 2.8 MB
desktop via responsive source). The three below-the-fold clips (1.1–2.0 MB each) don't
fetch until near-viewport and pause offscreen. Posters are 32–116 KB WebP. New
photography is 11 WebP files at 3.2 MB total (1200–1600px, real native resolution — a
step up from Phase 2's 412px social upscales). No new render-blocking requests; hero
uses `priority`, everything else stays lazy.

## RESPONSIVE

Mobile was designed, not shrunk: hero uses a dedicated portrait video crop and the
lighter mobile MP4; the results reel and process tiles collapse to single-column
portrait (phone-native framing); the gallery masonry drops to one column; oversized
type scales down per breakpoint. Verified at **375 / 390 / 430 / 768 / 1440** — **no
horizontal overflow at any width**, tap targets and the sticky mobile action bar intact.

## QA

- `npx tsc --noEmit` — clean
- `npm run lint` — clean (a `set-state-in-effect` finding on the first video component was fixed by moving media-query reads to `useSyncExternalStore`)
- `npm run build` — clean, all 18 routes generated
- Visual: Playwright viewport captures at 3 breakpoints across hero, transformation, results reel, gallery, and process; reduced-motion pass confirmed poster-only rendering. (No unit test suite exists in the project yet.)

## EXCLUDED CONTENT

- **IMG_5864.mov** — verified to show a truck wrapped for **"Daniel's Pool Service"**,
  a different business. Excluded entirely from customer-facing content, exactly as
  flagged; never presented as Detail Kings work.
- **IMG_5904 (photo)** — heavy blue color cast, mid-wash, low usable quality — held as
  reference only.
- Four B-grade result clips and several B-grade photos were graded and **held**, not
  published, to keep the curation tight rather than dumping every file onto the site.

## ADDRESS RESOLVED (previously open since Phase 1)

The business address was confirmed from the client's **own wrapped van**, printed on it
in two independent high-res photos (IMG_5310, IMG_5373): **14290 Tamiami Trail, North
Port, FL 34287**. Corroborated by the official Facebook page ("Detail Kings 941 | North
Port FL") and by 34287 being a North Port ZIP; the van's printed phone matches the
confirmed number. The old Port Charlotte candidate was only ever an unclaimed Manta
listing and has been superseded. This is now wired into `business.location.confirmed`,
so the footer shows the address and the `AutomotiveBusiness` JSON-LD now emits a full
`PostalAddress`. **Fred: please give a final visual confirm this is the current
storefront before promotion to `main`.**

## GIT

New checkpoint on `claude-dev`: commit `8982bdd` (on top of `6669180` Phase 2 + CI,
and `f52dde7` Phase 2). `main` untouched at Phase 1 (`30a9bc1`).

## VERCEL

This Cowork session cannot push directly to the repo (session-level git-proxy
restriction), so the push goes through the `claude.ai/code` bundle handoff, same as
Phase 2. The Vercel **Preview Deployment will update once `claude-dev` is pushed** there
— it cannot be triggered or confirmed from this session. No promotion to `main`;
visual review on the preview first, per the brief.
