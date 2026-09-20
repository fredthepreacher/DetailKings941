import { CloudRain, Droplet, Sun, Waves } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Built For Southwest Florida"
              title="Your Vehicle Fights A Tougher Climate Here"
              description="The 941 isn't a mild climate for a vehicle's finish. Sun, humidity, salt air, and storm season all take a toll faster than they would up north — our process is built around that reality, not a generic checklist."
              tone="dark"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {CONDITIONS.map((item) => (
              <div key={item.title} className="rounded-xl border border-ink-950/8 bg-white p-6">
                <item.icon className="h-5 w-5 text-lime-600" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-tight text-ink-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
