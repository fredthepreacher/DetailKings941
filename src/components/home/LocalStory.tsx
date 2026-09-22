import { CloudRain, Droplet, Sun, Waves } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const CONDITIONS = [
  {
    icon: Sun,
    title: "UV & Heat",
    description:
      "Intense Gulf Coast sun fades and oxidizes paint faster than most of the country — regular protection keeps color and gloss from breaking down.",
  },
  {
    icon: Droplet,
    title: "Hard Water & Pollen",
    description:
      "Sprinkler overspray and heavy pollen seasons leave mineral spotting and etching on paint and glass if it isn't washed off promptly.",
  },
  {
    icon: CloudRain,
    title: "Rain, Bugs & Road Film",
    description:
      "Afternoon storms, love bug season, and road contamination build up fast — decontamination keeps that from bonding into the clear coat.",
  },
  {
    icon: Waves,
    title: "Coastal Air",
    description:
      "Salt air near the coast accelerates corrosion on wheels, trim, and undercarriage components without regular protection.",
  },
];

export function LocalStory() {
  return (
    <section className="bg-steel-50 py-24 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
          <div>
            <span className="edge-label !text-steel-500">Built For Southwest Florida</span>
            <h2 className="mt-4 max-w-lg font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-ink-950 sm:text-5xl">
              A Tougher Climate
              <br />
              For Your Finish
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-steel-600">
              The 941 isn&apos;t mild on a vehicle&apos;s finish. Sun, humidity,
              salt air, and storm season take a toll faster than they would up
              north — our process is built around that reality, not a generic
              checklist.
            </p>
            <hr className="rule-gold mt-8 max-w-xs" />
          </div>

          <Reveal className="grid gap-4 sm:grid-cols-2">
            {CONDITIONS.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-ink-950/10 bg-white p-6 transition-all hover:border-lime-500/40 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.25)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-lime-400 transition-colors group-hover:bg-lime-500 group-hover:text-ink-950">
                  <item.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-tight text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-600">
                  {item.description}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
