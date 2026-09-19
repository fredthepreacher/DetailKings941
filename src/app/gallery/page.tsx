import type { Metadata } from "next";
import { galleryMedia, beforeAfterPairs } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { BeforeAfterSlider } from "@/components/media/BeforeAfterSlider";

export const metadata: Metadata = {
  title: "Our Work — Gallery",
  description: "Real detailing work from Detail Kings 941 — interiors, exteriors, transformations, trucks and SUVs, and paint.",
};

export default function GalleryPage() {
  return (
    <div className="bg-ink-950 pt-32 pb-24">
      <Container>
        <SectionHeading
          eyebrow="Our Work"
          title="The Gallery"
          description="A growing collection of real Detail Kings 941 work. Filtering by category (interior, exterior, transformations, trucks/SUVs, paint) will activate once there's enough photography in each category."
          tone="light"
        />

        {beforeAfterPairs.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-500">
              Transformations
            </h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              {beforeAfterPairs.map((pair) => (
                <BeforeAfterSlider key={pair.id} pair={pair} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-500">
            Portfolio
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryMedia.map((asset) => (
              <div key={asset.id} className="relative aspect-square overflow-hidden rounded-xl">
                <PlaceholderMedia asset={asset} sizes="(min-width: 1024px) 25vw, 50vw" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
