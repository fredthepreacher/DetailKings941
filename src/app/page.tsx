import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { Transformation } from "@/components/home/Transformation";
import { Differentiators } from "@/components/home/Differentiators";
import { ResultsReel } from "@/components/home/ResultsReel";
import { Gallery } from "@/components/home/Gallery";
import { LocalStory } from "@/components/home/LocalStory";
import { Process } from "@/components/home/Process";
import { Reviews } from "@/components/home/Reviews";
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
      <Hero />
      <TrustStrip />
      <ServicesPreview />
      <Transformation />
      <Differentiators />
      <ResultsReel />
      <Gallery />
      <LocalStory />
      <Process />
      <Reviews />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
