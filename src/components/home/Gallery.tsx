import { galleryMedia } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";

// Editorial masonry — photos run at their natural aspect ratio (no aggressive
// cropping, per the client's authenticity rules) and the column flow gives the
// mixed landscape/portrait set its rhythm. Leads with the new native-resolution
// Phase 2.5 photography.
export function Gallery() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <span className="edge-label">Our Work</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              Real Finishes,
              <br />
              Real Vehicles
            </h2>
          </div>
          <Button href="/gallery" variant="outline" className="shrink-0">
            Full Gallery
          </Button>
        </div>

        <hr className="rule-chrome mt-10" />

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {galleryMedia.map((asset) => (
            <figure
              key={asset.id}
              className="group relative block break-inside-avoid overflow-hidden rounded-xl border border-white/5"
            >
              <PlaceholderMedia
                asset={asset}
                fill={false}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
