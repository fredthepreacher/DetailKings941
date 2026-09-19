import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { business } from "@/data/business";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QuoteFlow } from "@/components/forms/QuoteFlow";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Get a free auto detailing quote from Detail Kings 941 in Southwest Florida.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;

  return (
    <div className="bg-ink-950 pt-32 pb-24">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Get A Quote"
          title="Let's Get Your Vehicle Booked"
          description="Tell us about your vehicle and what it needs — we'll follow up with pricing, usually within one business day."
          tone="light"
          align="center"
          className="mx-auto"
        />
        <div className="mt-6 flex justify-center">
          <a
            href={`tel:${business.phone.e164}`}
            className="flex items-center gap-2 font-display text-sm font-semibold text-steel-300 hover:text-white"
          >
            <Phone className="h-4 w-4" />
            Prefer to talk? Call {business.phone.display}
          </a>
        </div>

        <div className="mt-12">
          <QuoteFlow preselectedService={service} />
        </div>
      </Container>
    </div>
  );
}
