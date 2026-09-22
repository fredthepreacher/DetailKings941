import { differentiators } from "@/data/differentiators";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DynamicIcon } from "@/lib/icons";

export function Differentiators() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="edge-label is-gold">The Detail Kings Difference</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              Why Locals
              <br />
              Choose Us
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-steel-400">
            No franchise call center, no tunnel brushes — just careful,
            hand-finished work from people who live and drive in the 941.
          </p>
        </div>

        <hr className="rule-gold mt-10" />

        <Reveal className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-2">
          {differentiators.map((item, i) => (
            <div
              key={item.id}
              className="group relative bg-ink-950 p-8 transition-colors hover:bg-ink-900 sm:p-10"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-500/10 text-lime-400 transition-colors group-hover:bg-lime-500 group-hover:text-ink-950">
                  <DynamicIcon name={item.icon} className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="ghost-type text-4xl">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold uppercase tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-steel-400">
                {item.description}
              </p>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
