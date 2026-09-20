"use client";

import { useState } from "react";
import { beforeAfterPairs } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BeforeAfterSlider } from "@/components/media/BeforeAfterSlider";
import { cn } from "@/lib/utils";

export function Transformation() {
  const [activeId, setActiveId] = useState(beforeAfterPairs[0]?.id);
  const featured = beforeAfterPairs.find((p) => p.id === activeId) ?? beforeAfterPairs[0];
  if (!featured) return null;

  return (
    <section className="bg-ink-950 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="The Transformation"
          title="See The Difference"
          description="Drag the slider. This is the kind of turnaround every vehicle gets — real client work, not a quick wipe-down."
          tone="light"
          align="center"
          className="mx-auto"
        />

        {beforeAfterPairs.length > 1 && (
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2.5">
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
          <BeforeAfterSlider key={featured.id} pair={featured} />
        </div>
      </Container>
    </section>
  );
}
