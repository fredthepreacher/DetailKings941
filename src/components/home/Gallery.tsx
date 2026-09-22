import { galleryMedia } from "@/data/media";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";

// Curated homepage teaser — a small, editorial taste with one dominant feature,
// NOT the full proof wall. Deliberately uses images the Proof section doesn't,
// so the two sections don't read as the same grid twice. The full set lives on
// /gallery. Chosen for variety: hero-quality result, craftsmanship-in-action,
// premium finish, and the branded vehicle.
const CURATED: { id: string; span: string }[] = [
  { id: "gallery-camaro", span: "col-span-2 row-span-2" }, // dominant feature — finished result
  { id: "gallery-corvette", span: "col-span-2 row-span-1" }, // craftsmanship — foam bath
  { id: "gallery-bentley", span: "col-span-1 row-span-1" }, // premium finished exterior
  { id: "gallery-van-services", span: "col-span-1 row-span-1" }, // branded vehicle
];

export function Gallery() {
  const items = CURATED.map((c) => ({
    span: c.span,
    asset: galleryMedia.find((g) => g.id === c.id),
  })).filter((c) => c.asset);

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="edge-label">The Gallery</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
              A Closer Look
            </h2>
          </div>
          <Button href="/gallery" variant="outline" className="shrink-0">
            See All Work
          </Button>
        </div>

        <div className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[210px] sm:gap-4 lg:grid-cols-4">
          {items.map(({ asset, span }) => (
            <figure
              key={asset!.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/5 ${span}`}
            >
              <PlaceholderMedia
                asset={asset!}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
