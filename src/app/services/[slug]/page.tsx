import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { services } from "@/data/services";
import { business } from "@/data/business";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/lib/icons";
import { breadcrumbSchema } from "@/lib/schema";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const breadcrumbs = breadcrumbSchema([
    { name: "Services", url: "/services" },
    { name: service.name, url: `/services/${service.slug}` },
  ]);

  return (
    <div className="bg-ink-950 pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <Container>
        {service.image && (
          <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-3xl sm:aspect-[21/9]">
            <PlaceholderMedia asset={service.image} sizes="(min-width: 1024px) 1000px, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
          </div>
        )}
        <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-500 text-ink-950">
              <DynamicIcon name={service.icon} className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-steel-300">
              {service.longDescription}
            </p>

            {!service.verified && (
              <p className="mt-4 max-w-2xl rounded-lg border border-lime-500/30 bg-lime-500/10 px-4 py-2 text-xs text-lime-300">
                Draft service description — pending confirmation from Detail Kings 941.
              </p>
            )}

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-500">
                  What&apos;s Included
                </h2>
                <ul className="mt-4 space-y-3">
                  {service.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-steel-200">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-500">
                  Ideal For
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-steel-200">{service.idealFor}</p>

                <h2 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.2em] text-steel-500">
                  Where
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-steel-200">
                  Southwest Florida / the 941 area.
                </p>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-ink-900 p-7">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Get A Quote For {service.name}
            </p>
            <p className="mt-2 text-sm text-steel-400">
              Tell us about your vehicle and we&apos;ll follow up with pricing.
            </p>
            <Button href={`/contact?service=${service.slug}`} size="lg" className="mt-6 w-full">
              Get a Quote
            </Button>
            <a
              href={`tel:${business.phone.e164}`}
              className="mt-3 block text-center font-display text-sm font-semibold text-steel-300 hover:text-white"
            >
              or call {business.phone.display}
            </a>
          </aside>
        </div>
      </Container>
    </div>
  );
}
