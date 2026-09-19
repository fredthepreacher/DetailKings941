"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Star } from "lucide-react";
import { business } from "@/data/business";
import { reviewSummary } from "@/data/reviews";
import { heroMedia } from "@/data/media";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950">
      <div className="absolute inset-0">
        <PlaceholderMedia asset={heroMedia} priority sizes="100vw" className="scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/30" />
      </div>

      <Container className="relative z-10 pb-16 pt-40 sm:pb-24 sm:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
            <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-steel-200">
              Southwest Florida · 941
            </span>
          </div>

          <h1 className="max-w-4xl text-balance font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-8xl">
            Your Car.
            <br />
            <span className="chrome-text">Crowned.</span>
          </h1>

          <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-steel-200 sm:text-xl">
            Hand-detailed interior and exterior work for daily drivers,
            trucks, and SUVs across the 941 — built to fight Florida sun,
            salt air, and the daily grind.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/contact" size="lg" className="group">
              Get a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button href="/gallery" variant="outline" size="lg">
              View Our Work
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href={`tel:${business.phone.e164}`}
              className="font-display text-base font-semibold text-white underline-offset-4 hover:underline"
            >
              {business.phone.display}
            </a>
            {reviewSummary ? (
              <div className="flex items-center gap-1.5 text-sm text-steel-300">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(reviewSummary!.rating)
                        ? "h-4 w-4 fill-ember-500 text-ember-500"
                        : "h-4 w-4 text-steel-600"
                    }
                  />
                ))}
                <span className="ml-1">
                  {reviewSummary.rating.toFixed(1)} on Google ({reviewSummary.count} reviews)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-steel-300">
                <ShieldCheck className="h-4 w-4 text-ember-500" />
                <span>Locally owned &amp; operated</span>
              </div>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
