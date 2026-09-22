"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Crown } from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { DynamicIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const FEATURED_SLUG = "full-detail"; // the "King's" package — gold emphasis

/**
 * Visual service selector — productized, easy to compare and act on.
 * Pick a service on the left; the right panel previews it with real work
 * imagery, what's typically included, and an obvious next action. Draft
 * inclusions are framed as "typical" and confirmed at quote — never as a
 * fixed menu or with invented pricing (every service is verified: false).
 */
export function ServiceSelector() {
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug);
  const active = services.find((s) => s.slug === activeSlug) ?? services[0];
  if (!active) return null;

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="edge-label">What We Do</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              Built To Order
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-steel-400">
            Every vehicle is different. Pick where yours is at — we scale the
            detail to what it actually needs.
          </p>
        </div>

        <hr className="rule-chrome mt-10" />

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          {/* Selector */}
          <div
            className="flex gap-2.5 overflow-x-auto pb-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:pb-0"
            style={{ scrollbarWidth: "none" }}
          >
            {services.map((s) => {
              const isActive = s.slug === active.slug;
              const isKing = s.slug === FEATURED_SLUG;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setActiveSlug(s.slug)}
                  aria-pressed={isActive}
                  className={cn(
                    "group flex shrink-0 items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-left transition-all lg:shrink lg:px-5 lg:py-4",
                    isActive
                      ? "border-lime-500/50 bg-lime-500/10"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                      isActive ? "bg-lime-500 text-ink-950" : "bg-white/5 text-steel-300 group-hover:text-white",
                    )}
                  >
                    <DynamicIcon name={s.icon} className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "whitespace-nowrap font-display text-sm font-semibold uppercase tracking-tight lg:text-base",
                          isActive ? "text-white" : "text-steel-200",
                        )}
                      >
                        {s.name}
                      </span>
                      {isKing && (
                        <span className="hidden items-center gap-1 rounded-full border border-gold-500/40 px-2 py-0.5 font-display text-[9px] font-semibold uppercase tracking-widest text-gold-400 sm:inline-flex">
                          <Crown className="h-2.5 w-2.5" /> King
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 hidden truncate text-xs text-steel-500 lg:block">
                      {s.shortDescription}
                    </span>
                  </span>
                  {isActive ? (
                    <span className="ml-auto hidden shrink-0 items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 font-display text-[9px] font-semibold uppercase tracking-widest text-gold-400 lg:inline-flex">
                      <Check className="h-3 w-3" strokeWidth={3} />
                      Selected
                    </span>
                  ) : (
                    <ArrowRight className="ml-auto hidden h-4 w-4 shrink-0 text-steel-600 transition-all group-hover:text-steel-300 lg:block" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Preview panel — re-mounts on change to replay the reveal */}
          <div
            key={active.slug}
            className="animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-ink-900"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[16/9]">
              {active.image ? (
                <PlaceholderMedia asset={active.image} sizes="(min-width: 1024px) 55vw, 100vw" />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-ink-800 to-ink-950" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
              {active.slug === FEATURED_SLUG && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-ink-950/70 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-widest text-gold-400 backdrop-blur-sm">
                  <Crown className="h-3 w-3" /> The King&apos;s Package
                </span>
              )}
              <div className="absolute bottom-5 left-6 right-6">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
                  {active.name}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-sm leading-relaxed text-steel-300 sm:text-base">
                {active.longDescription}
              </p>

              <p className="mt-6 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-steel-500">
                Typically includes
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {active.included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-steel-200">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-500" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-steel-500">
                <span className="font-semibold text-steel-300">Ideal for:</span>{" "}
                {active.idealFor} Your exact scope and price are confirmed on your
                quote — no fixed-menu surprises.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/contact?service=${active.slug}`}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-lime-500 px-6 font-display text-sm font-semibold uppercase tracking-wide text-ink-950 shadow-[0_8px_24px_-8px_rgba(124,255,0,0.55)] transition-all hover:bg-lime-400"
                >
                  Build My Detail
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/services/${active.slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:border-white/50 hover:bg-white/5"
                >
                  Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
