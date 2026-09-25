import { Phone } from "lucide-react";
import { services } from "@/data/services";
import { business } from "@/data/business";
import { QuoteFlow } from "@/components/forms/QuoteFlow";

/**
 * The Build My Detail interface itself — rendered inside the cinematic
 * overlay (soft navigation) and by the full /build-my-detail page (refresh,
 * deep link, share), so both paths land on the identical experience.
 */
export function BuildMyDetailExperience({
  service,
  headingId,
  headingRef,
  headingLevel = "h2",
}: {
  service?: string | null;
  headingId?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
  headingLevel?: "h1" | "h2";
}) {
  const selected = services.find((s) => s.slug === service);
  const Heading = headingLevel;

  return (
    <div>
      <span className="edge-label">Get Started</span>
      <Heading
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white outline-none sm:text-6xl"
      >
        Build My <span className="gold-text">Detail</span>
      </Heading>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-steel-300">
        {selected ? (
          <>
            Starting with <span className="text-white">{selected.name}</span> — you can add
            more in a moment.{" "}
          </>
        ) : null}
        Tell us about your vehicle and we&apos;ll scope it, price it straight, and get back to
        you fast. No phone tag, no pressure.
      </p>
      <a
        href={`tel:${business.phone.e164}`}
        className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-steel-300 transition-colors hover:text-lime-400"
      >
        <Phone className="h-4 w-4" />
        Prefer to talk? Call {business.phone.display}
      </a>

      <div className="mt-10">
        <QuoteFlow preselectedService={selected?.slug} />
      </div>
    </div>
  );
}
