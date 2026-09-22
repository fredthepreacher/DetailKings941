import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Star } from "lucide-react";
import { business } from "@/data/business";
import { reviews, reviewSummary } from "@/data/reviews";
import { galleryMedia } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { Reveal } from "@/components/ui/Reveal";

// Authentic finished-vehicle proof (all real client work; the branded van is
// in-frame on several). Captions are factual — no invented claims.
const PROOF = [
  { key: "gallery-jeep-brand", label: "Lifted Wrangler", note: "Exterior detail" },
  { key: "gallery-cla", label: "Mercedes-AMG CLA", note: "Finished exterior" },
  { key: "gallery-rav4", label: "Toyota RAV4", note: "Full exterior detail" },
  { key: "gallery-k5", label: "Kia K5 GT-Line", note: "Finished detail" },
];

/**
 * Proof section built around REAL work we already have — not a "reviews coming
 * soon" placeholder. Verified reviews are rendered here when present (and only
 * then); until they exist, authentic results carry the proof and a Google CTA
 * lets visitors verify us directly. Adding real reviews later enhances this
 * section rather than deciding whether it works.
 */
export function ProofOfWork() {
  const proofItems = PROOF.map((p) => ({
    ...p,
    asset: galleryMedia.find((g) => g.id === p.key),
  })).filter((p) => p.asset);

  const hasReviews = reviews.length > 0;

  return (
    <section className="bg-steel-50 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="edge-label !text-steel-500">The Proof</span>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-ink-950 sm:text-6xl">
              Real Work.
              <br />
              <span className="gold-text">Real Results.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-steel-600">
              Every photo here is an actual Detail Kings 941 vehicle — no stock
              imagery, no staged sets. The work is the proof.
            </p>
          </div>

          {/* Google trust card — verify us directly */}
          <div className="w-full max-w-sm rounded-2xl border border-ink-950/10 bg-white p-6 shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)] lg:w-auto">
            <div className="flex items-center gap-2 text-gold-600">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
              ))}
            </div>
            {reviewSummary ? (
              <p className="mt-3 font-display text-sm font-semibold uppercase tracking-wide text-ink-950">
                {reviewSummary.rating.toFixed(1)} ★ · {reviewSummary.count} Google reviews
              </p>
            ) : (
              <p className="mt-3 text-sm leading-relaxed text-steel-600">
                See what customers are saying, straight from our Google profile.
              </p>
            )}
            <Link
              href={business.reviewUrl}
              className="mt-4 inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-wide text-lime-600 transition-colors hover:text-lime-700"
            >
              View Us On Google
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Proof grid */}
        <Reveal className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {proofItems.map((p) => (
            <figure
              key={p.key}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-ink-950/10"
            >
              <PlaceholderMedia
                asset={p.asset!}
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
              <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-gold-500/40 bg-ink-950/60 px-2 py-0.5 font-display text-[9px] font-semibold uppercase tracking-widest text-gold-400 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <BadgeCheck className="h-2.5 w-2.5" /> Real work
              </span>
              <figcaption className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-sm font-semibold uppercase tracking-tight text-white">
                  {p.label}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-lime-400">
                  {p.note}
                </p>
              </figcaption>
            </figure>
          ))}
        </Reveal>

        {/* Verified reviews render here once they exist */}
        {hasReviews && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.id} className="rounded-2xl border border-ink-950/10 bg-white p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-steel-700">
                  &ldquo;{review.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 font-display text-xs font-semibold uppercase tracking-wide text-steel-500">
                  {review.author} · {review.source === "google" ? "Google" : "Facebook"}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-950/10 pt-8 sm:flex-row">
          <p className="text-sm text-steel-500">
            A sample of real Detail Kings work — see the full gallery.
          </p>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-ink-800"
          >
            See Our Work
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
