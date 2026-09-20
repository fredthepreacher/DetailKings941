import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { VideoMedia } from "@/components/media/VideoMedia";
import { resultVideos } from "@/data/media";

const CAPTIONS = [
  { title: "Ford F-150 Tremor", note: "Exterior detail · van in frame" },
  { title: "BMW X7 M-Sport", note: "Full detail · finished walkaround" },
];

export function ResultsReel() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      {/* Oversized ghost word behind the reel */}
      <span
        aria-hidden
        className="ghost-type pointer-events-none absolute -top-4 left-4 select-none text-[22vw] leading-none sm:-top-10 sm:text-[16vw]"
      >
        FINISHED
      </span>

      <Container className="relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="edge-label">The Results</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              Rolls Out Looking New
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-lime-400 transition-colors hover:text-lime-300"
          >
            See The Full Reel
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-8">
          {resultVideos.map((asset, i) => (
            <figure
              key={asset.id}
              className={
                i === 1
                  ? "relative sm:mt-16" /* asymmetric offset on the second tile */
                  : "relative"
              }
            >
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-white/10">
                <VideoMedia asset={asset} objectClassName="object-[50%_center]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                <div className="grain-overlay" />
                <figcaption className="absolute bottom-5 left-5 right-5 z-10">
                  <p className="font-display text-lg font-semibold uppercase tracking-tight text-white">
                    {CAPTIONS[i]?.title}
                  </p>
                  <p className="mt-0.5 text-xs uppercase tracking-widest text-lime-400">
                    {CAPTIONS[i]?.note}
                  </p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
