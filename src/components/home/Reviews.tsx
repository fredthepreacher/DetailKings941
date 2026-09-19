import { Star } from "lucide-react";
import { business } from "@/data/business";
import { reviews, reviewSummary } from "@/data/reviews";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

/**
 * Renders real, verified reviews when available. With none yet supplied
 * (see /src/data/reviews.ts), falls back to an honest CTA to Google rather
 * than a synthetic testimonial — spec 9 requires verified reviews only.
 */
export function Reviews() {
  if (reviews.length === 0) {
    return (
      <section className="bg-steel-50 py-24 sm:py-32">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-ink-950/8 bg-white px-8 py-16 text-center">
            <Star className="h-8 w-8 text-ember-500" />
            <h2 className="mt-5 font-display text-2xl font-semibold uppercase tracking-tight text-ink-950 sm:text-3xl">
              Reviews Coming Soon
            </h2>
            <p className="mt-3 max-w-md text-steel-600">
              We&apos;re adding verified customer reviews here as they come in.
              In the meantime, see what customers are saying directly on
              Google.
            </p>
            <Button href={business.reviewUrl} className="mt-7">
              Read Our Google Reviews
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-steel-50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="What Customers Say"
          title="Verified Reviews"
          tone="dark"
          align="center"
          className="mx-auto"
        />
        {reviewSummary && (
          <p className="mt-3 text-center font-display text-sm font-semibold uppercase tracking-wide text-ember-600">
            {reviewSummary.rating.toFixed(1)} ★ · {reviewSummary.count} Google reviews
          </p>
        )}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.id} className="rounded-2xl border border-ink-950/8 bg-white p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-ember-500 text-ember-500" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-steel-700">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-4 font-display text-xs font-semibold uppercase tracking-wide text-steel-500">
                {review.author} · {review.source === "google" ? "Google" : "Facebook"}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
