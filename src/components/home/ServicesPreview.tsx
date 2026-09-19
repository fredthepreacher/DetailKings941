import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/lib/icons";

export function ServicesPreview() {
  return (
    <section className="bg-steel-50 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Detailing, Done Right"
            description="From a quick interior refresh to full paint correction and ceramic protection — every service is scaled to what your vehicle actually needs."
            tone="dark"
          />
          <Button href="/services" variant="outline" className="!border-ink-950/15 !text-ink-950 hover:!bg-ink-950/5 shrink-0">
            All Services
          </Button>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink-950/8 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ember-500/30 hover:shadow-[0_20px_40px_-16px_rgba(11,16,28,0.18)]"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-white transition-colors group-hover:bg-ember-500">
                  <DynamicIcon name={service.icon} className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold uppercase tracking-tight text-ink-950">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-600">
                  {service.shortDescription}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-ember-600">
                Learn more
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
