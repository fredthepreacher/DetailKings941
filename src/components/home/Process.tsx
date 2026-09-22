import { Container } from "@/components/ui/Container";
import { VideoMedia } from "@/components/media/VideoMedia";
import { Reveal } from "@/components/ui/Reveal";
import { processVideo } from "@/data/media";

const STEPS = [
  {
    number: "01",
    title: "Tell Us About Your Vehicle",
    description: "Share your year, make, model, and what's going on with it. Two minutes, no phone tag.",
  },
  {
    number: "02",
    title: "Get Your Straight Quote",
    description: "We scope the work to what your vehicle actually needs and give you a clear price — before anything starts.",
  },
  {
    number: "03",
    title: "The King's Treatment",
    description: "Hand-finished, stage by stage — wash, decontamination, correction, and protection. No tunnel brushes, no shortcuts.",
  },
  {
    number: "04",
    title: "Drive Away Crowned",
    description: "A final walkthrough together, then you leave in a vehicle that looks the way it did on day one.",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
          {/* Portrait process footage — real foam-wash motion */}
          <div className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10">
              <VideoMedia asset={processVideo} objectClassName="object-[50%_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
              <div className="grain-overlay" />
              <div className="absolute left-4 top-4 z-10">
                <span className="edge-label is-gold text-gold-400">The King&apos;s Treatment</span>
              </div>
              <div className="absolute bottom-4 left-4 z-10">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                  Foam Bath · Wash Stage
                </p>
                <p className="text-xs text-steel-300">Real client detail, in progress</p>
              </div>
            </div>
            {/* Layered gold frame accent — premium emphasis */}
            <div className="pointer-events-none absolute -bottom-3 -right-3 -z-0 h-full w-full rounded-2xl border border-gold-500/25" />
          </div>

          {/* Stages */}
          <div>
            <span className="edge-label is-gold">The Process</span>
            <h2 className="mt-4 max-w-lg font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
              The <span className="gold-text">King&apos;s</span> Treatment
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-steel-400">
              Four stages, every vehicle, every time — the process that turns a
              daily driver back into something you&apos;re proud to park.
            </p>
            <hr className="rule-gold mt-8" />
            <div className="mt-8 grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {STEPS.map((step, i) => (
                <Reveal key={step.number} delay={i * 90} className="relative">
                  <span className="ghost-type text-6xl">{step.number}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-400">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
