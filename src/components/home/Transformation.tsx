import { beforeAfterPairs } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BeforeAfterSlider } from "@/components/media/BeforeAfterSlider";

export function Transformation() {
  const featured = beforeAfterPairs[0];
  if (!featured) return null;

  return (
    <section className="bg-ink-950 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="The Transformation"
          title="See The Difference"
          description="Drag the slider. This is the kind of turnaround every vehicle gets — real work, not a quick wipe-down."
          tone="light"
          align="center"
          className="mx-auto"
        />
        <div className="mx-auto mt-14 max-w-4xl">
          <BeforeAfterSlider pair={featured} />
        </div>
      </Container>
    </section>
  );
}
