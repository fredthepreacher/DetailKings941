import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Transformation } from "@/components/home/Transformation";
import { ServiceSelector } from "@/components/home/ServiceSelector";
import { Process } from "@/components/home/Process";
import { ResultsReel } from "@/components/home/ResultsReel";
import { Gallery } from "@/components/home/Gallery";
import { LocalStory } from "@/components/home/LocalStory";
import { Differentiators } from "@/components/home/Differentiators";
import { ProofOfWork } from "@/components/home/ProofOfWork";
import { BuildMyDetail } from "@/components/home/BuildMyDetail";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { localBusinessSchema, faqSchema } from "@/lib/schema";
import { faqItems } from "@/data/faq";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(faqItems.map(({ question, answer }) => ({ question, answer }))),
          ),
        }}
      />
      {/* 1 · Cinematic hero */}
      <Hero />
      {/* 2 · Immediate trust strip */}
      <TrustStrip />
      {/* 3 · Major before/after transformation — the core creative idea */}
      <Transformation />
      {/* 4 · Visual service selector */}
      <ServiceSelector />
      {/* 5 · The King's Treatment process */}
      <Process />
      {/* 6 · Cinematic result — the Results Reel */}
      <ResultsReel />
      {/* 7 · Visual breath + trust reset — Real Work. Real Results. */}
      <ProofOfWork />
      {/* 8 · Optional exploration — curated gallery into the full portfolio */}
      <Gallery />
      {/* 9 · Florida vehicle-care problem / solution */}
      <LocalStory />
      {/* 10 · Proof-driven Why Detail Kings */}
      <Differentiators />
      {/* 11 · Build My Detail quote experience */}
      <BuildMyDetail />
      {/* 11 · FAQ */}
      <FAQSection />
      {/* 12 · Cinematic final CTA */}
      <FinalCTA />
    </>
  );
}
