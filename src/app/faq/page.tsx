import type { Metadata } from "next";
import { FAQSection } from "@/components/home/FAQSection";
import { faqSchema } from "@/lib/schema";
import { faqItems } from "@/data/faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about Detail Kings 941's auto detailing services.",
};

export default function FaqPage() {
  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqSchema(faqItems.map(({ question, answer }) => ({ question, answer }))),
          ),
        }}
      />
      <FAQSection />
    </div>
  );
}
