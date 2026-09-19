import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, serviceCategoryLabels } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DynamicIcon } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Auto Detailing Services",
  description:
    "Interior detailing, exterior detailing, paint correction, ceramic coating, and more — auto detailing services in Southwest Florida's 941 area.",
};

export default function ServicesPage() {
  return (
    <div className="bg-ink-950 pt-32 pb-24">
      <Container>
        <SectionHeading
          eyebrow="Services"
          title="Detailing, Scaled To Your Vehicle"
          description="Every service below can be booked on its own or combined into a full detail. Pricing is confirmed on your quote once we know your vehicle and what it needs."
          tone="light"
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-ink-900 p-7 transition-all hover:-translate-y-1 hover:border-ember-500/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <DynamicIcon name={service.icon} className="h-6 w-6 text-ember-500" strokeWidth={1.75} />
                  <span className="font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-steel-500">
                    {serviceCategoryLabels[service.category]}
                  </span>
                </div>
                <h2 className="mt-5 font-display text-xl font-semibold uppercase tracking-tight text-white">
                  {service.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-steel-400">
                  {service.shortDescription}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-ember-500">
                View details
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
