"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { business } from "@/data/business";
import { reviewSummary } from "@/data/reviews";
import { heroVideo } from "@/data/media";
import { VideoMedia } from "@/components/media/VideoMedia";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const city = business.location.confirmed?.city;

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink-950">
      {/* Cinematic process footage — the client's own foam-wash clip. */}
      <div className="absolute inset-0">
        <VideoMedia
          asset={heroVideo}
          priority
          objectClassName="scale-105 object-[62%_center]"
        />
        {/* Legibility + grade overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/25 to-transparent" />
        <div className="grain-overlay" />
      </div>

      {/* Corner metadata — editorial automotive framing */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden items-start justify-between px-6 pt-28 sm:flex lg:px-10">
        <span className="edge-label">Auto Detailing</span>
        <span className="edge-label [&::before]:hidden">
          {city ? `${city} · FL` : "Southwest FL"} — 941
        </span>
      </div>

      {/* Thin lime accent rail */}
      <div className="absolute bottom-0 left-6 top-1/2 z-10 hidden w-px bg-gradient-to-b from-transparent via-lime-500/60 to-lime-500 lg:block" />

      <Container className="relative z-10 pb-16 pt-40 sm:pb-24 sm:pt-48">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-500" />
            <span className="font-display text-xs font-medium uppercase tracking-[0.2em] text-steel-200">
              Ceramic · Paint Correction · Interior
            </span>
          </div>

          <h1 className="max-w-4xl text-balance font-display text-6xl font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-[8.5rem]">
            Your Car.
            <br />
            <span className="chrome-text">Crowned.</span>
          </h1>

          <p className="mt-7 max-w-xl text-balance text-lg leading-relaxed text-steel-200 sm:text-xl">
            Hand-detailed interior and exterior work for daily drivers, trucks,
            and SUVs across the 941 — built to fight Florida sun, salt air, and
            the daily grind.
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
                        ? "h-4 w-4 fill-lime-500 text-lime-500"
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
                <Star className="h-4 w-4 fill-lime-500 text-lime-500" />
                <span>Locally owned &amp; operated in {city ?? "Southwest FL"}</span>
              </div>
            )}
          </div>
        </motion.div>
      </Container>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-10 hidden items-center gap-3 lg:flex">
        <span className="edge-label [&::before]:hidden">Scroll</span>
        <span className="relative flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-lime-500"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </div>
    </section>
  );
}
