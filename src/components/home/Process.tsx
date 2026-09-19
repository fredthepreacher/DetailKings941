import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    number: "01",
    title: "Tell Us About Your Vehicle",
    description: "Share your vehicle's year, make, and model and what's going on with it.",
  },
  {
    number: "02",
    title: "Choose What You Need",
    description: "Pick a service — or let us recommend one based on your vehicle's condition.",
  },
  {
    number: "03",
    title: "Get Your Detail",
    description: "We do the work — hand-finished, start to finish, no shortcuts.",
  },
  {
    number: "04",
    title: "Enjoy The Finish",
    description: "Drive away in a vehicle that looks (and feels) the way it did on day one.",
  },
];

export function Process() {
  return (
    <section className="bg-ink-950 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Simple, Start To Finish"
          tone="light"
          align="center"
          className="mx-auto"
        />
        <div className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute inset-x-0 top-6 hidden h-px bg-white/10 lg:block" />
          {STEPS.map((step) => (
            <div key={step.number} className="relative">
              <span className="font-display text-5xl font-bold text-white/10">
                {step.number}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold uppercase tracking-tight text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
