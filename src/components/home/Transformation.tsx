"use client";

import { useState } from "react";
import { beforeAfterPairs } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { BeforeAfterSlider } from "@/components/media/BeforeAfterSlider";
import { cn } from "@/lib/utils";

export function Transformation() {
  const [activeId, setActiveId] = useState(beforeAfterPairs[0]?.id);
  const featured = beforeAfterPairs.find((p) => p.id === activeId) ?? beforeAfterPairs[0];
  if (!featured) return null;

  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="edge-label justify-center [&::before]:hidden">
            The Transformation
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
            See The Difference
          </h2>
          <p className="mt-5 text-balance text-base leading-relaxed text-steel-300 sm:text-lg">
            Drag the slider. This is the kind of turnaround every vehicle gets —
            real client work, not a quick wipe-down.
          </p>
        </div>

        {beforeAfterPairs.length > 1 && (
          <div className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-2.5">
            {beforeAfterPairs.map((pair) => (
              <button
                key={pair.id}
                type="button"
                onClick={() => setActiveId(pair.id)}
                aria-pressed={pair.id === featured.id}
                className={cn(
                  "rounded-full border px-4 py-2 font-display text-xs font-semibold uppercase tracking-wide transition-colors",
                  pair.id === featured.id
                    ? "border-lime-500 bg-lime-500/10 text-lime-400"
                    : "border-white/10 text-steel-400 hover:border-white/25 hover:text-steel-200",
                )}
              >
                {pair.title}
              </button>
            ))}
          </div>
        )}

        <div className="mx-auto mt-10 max-w-4xl">
          {/* Metadata bar — reads like a case-study caption */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              {featured.title}
            </span>
            <span className="text-xs uppercase tracking-widest text-steel-400">
              {featured.vehicle}
            </span>
          </div>
          <div className="mt-5 overflow-hidden rounded-2xl">
            <BeforeAfterSlider key={featured.id} pair={featured} />
          </div>
        </div>
      </Container>
    </section>
  );
}
