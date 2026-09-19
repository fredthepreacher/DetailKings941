import { differentiators } from "@/data/differentiators";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicIcon } from "@/lib/icons";

export function Differentiators() {
  return (
    <section className="bg-steel-50 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="The Detail Kings Difference"
          title="Why Locals Choose Us"
          tone="dark"
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-ink-950/8 sm:grid-cols-2">
          {differentiators.map((item) => (
            <div key={item.id} className="bg-steel-50 p-8">
              <DynamicIcon name={item.icon} className="h-6 w-6 text-ember-600" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-tight text-ink-950">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
