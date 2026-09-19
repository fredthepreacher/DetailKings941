import { galleryMedia } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";

// Editorial, asymmetric grid rather than a uniform bootstrap-style grid —
// spans vary so the strongest assets can be given more visual weight once
// real photography is ranked (Tier A/B per ASSET_AUDIT_REPORT.md).
const SPANS = [
  "sm:col-span-3 sm:row-span-2",
  "sm:col-span-3 sm:row-span-1",
  "sm:col-span-3 sm:row-span-1",
  "sm:col-span-2 sm:row-span-1",
  "sm:col-span-2 sm:row-span-1",
  "sm:col-span-2 sm:row-span-1",
];

export function Gallery() {
  return (
    <section className="bg-ink-950 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Our Work"
            title="Real Finishes, Real Vehicles"
            tone="light"
          />
          <Button href="/gallery" variant="outline" className="shrink-0">
            Full Gallery
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:auto-rows-[160px] sm:grid-cols-6">
          {galleryMedia.map((asset, i) => (
            <div
              key={asset.id}
              className={`relative overflow-hidden rounded-xl ${SPANS[i % SPANS.length]}`}
            >
              <PlaceholderMedia asset={asset} sizes="(min-width: 640px) 33vw, 50vw" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
