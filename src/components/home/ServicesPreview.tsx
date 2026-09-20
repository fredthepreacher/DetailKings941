import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/lib/icons";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";

const FEATURED_SLUG = "full-detail";

export function ServicesPreview() {
  const featured = services.find((s) => s.slug === FEATURED_SLUG) ?? services[0];
  const rest = services.filter((s) => s.slug !== featured.slug);

  return (
    <section className="bg-steel-50 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="edge-label !text-steel-500">What We Do</span>
            <h2 className="mt-4 max-w-xl font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-ink-950 sm:text-6xl">
              Detailing,
              <br />
              Done Right
            </h2>
          </div>
          <Button
            href="/services"
            variant="outline"
            className="!border-ink-950/15 !text-ink-950 hover:!bg-ink-950/5 shrink-0"
          >
            All Services
          </Button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Featured service — image-led, tied to real work */}
          <Link
            href={`/services/${featured.slug}`}
            className="group relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink-950 p-8 sm:min-h-[32rem]"
          >
            {featured.image && (
              <div className="absolute inset-0">
                <PlaceholderMedia
                  asset={featured.image}
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/10" />
                <div className="grain-overlay" />
              </div>
            )}
            <div className="relative">
              <span className="edge-label text-white/90">Signature · Most Booked</span>
              <h3 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                {featured.name}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-steel-200">
                {featured.shortDescription}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-wide text-lime-400">
                Explore the Full Detail
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>

          {/* Editorial index of the remaining services */}
          <ul className="flex flex-col justify-center">
            {rest.map((service, i) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex items-center gap-5 border-b border-ink-950/10 py-5 first:border-t"
                >
                  <span className="font-display text-xs font-semibold tabular-nums text-steel-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-white transition-colors group-hover:bg-lime-500 group-hover:text-ink-950">
                    <DynamicIcon name={service.icon} className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold uppercase tracking-tight text-ink-950">
                      {service.name}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-steel-500">
                      {service.shortDescription}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-steel-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
