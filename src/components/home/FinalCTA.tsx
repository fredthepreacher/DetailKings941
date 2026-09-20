import { Phone } from "lucide-react";
import { business } from "@/data/business";
import { resultVideos } from "@/data/media";
import { VideoMedia } from "@/components/media/VideoMedia";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-28 sm:py-36">
      {/* Subtle closing motion — reuses an already-shipped derivative, stays
          lazy + viewport-gated, and drops to the poster under reduced motion. */}
      <div className="absolute inset-0 opacity-35">
        <VideoMedia asset={resultVideos[1]} objectClassName="object-[50%_35%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/60" />
        <div className="grain-overlay" />
      </div>
      <Container className="relative z-10 text-center">
        <h2 className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold uppercase leading-[1.02] tracking-tight text-white sm:text-6xl">
          Ready For The <span className="chrome-text">Finish</span> You&apos;ve Been Putting Off?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-steel-300">
          Get a straight quote in minutes, or call us directly — either way,
          your vehicle is in good hands.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/contact" size="lg">
            Get a Quote
          </Button>
          <a
            href={`tel:${business.phone.e164}`}
            className="flex items-center gap-2 font-display text-base font-semibold text-white hover:text-lime-400"
          >
            <Phone className="h-4 w-4" />
            {business.phone.display}
          </a>
        </div>
      </Container>
    </section>
  );
}
