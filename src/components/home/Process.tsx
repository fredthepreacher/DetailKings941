import { Container } from "@/components/ui/Container";
import { VideoMedia } from "@/components/media/VideoMedia";
import { processVideo } from "@/data/media";

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
    <section className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
          {/* Portrait process footage — real foam-wash motion */}
          <div className="relative mx-auto w-full max-w-sm lg:mx-0">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10">
              <VideoMedia asset={processVideo} objectClassName="object-[50%_center]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
              <div className="grain-overlay" />
              <div className="absolute left-4 top-4 z-10">
                <span className="edge-label text-white/90">The Process</span>
              </div>
              <div className="absolute bottom-4 left-4 z-10">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
                  Foam Bath · Wash Stage
                </p>
                <p className="text-xs text-steel-300">Real client detail, in progress</p>
              </div>
            </div>
            {/* Layered chrome frame accent */}
            <div className="pointer-events-none absolute -bottom-3 -right-3 -z-0 h-full w-full rounded-2xl border border-lime-500/25" />
          </div>

          {/* Steps */}
          <div>
            <span className="edge-label">How It Works</span>
            <h2 className="mt-4 max-w-lg font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
              Simple, Start To Finish
            </h2>
            <hr className="rule-chrome mt-8" />
            <div className="mt-8 grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {STEPS.map((step) => (
                <div key={step.number} className="relative">
                  <span className="ghost-type text-6xl">{step.number}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
