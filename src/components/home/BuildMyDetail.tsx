import Link from "next/link";
import { ArrowRight, CalendarCheck, HandCoins, Phone, ShieldCheck } from "lucide-react";
import { services } from "@/data/services";
import { business } from "@/data/business";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DynamicIcon } from "@/lib/icons";

const PROMISES = [
  { icon: HandCoins, label: "Free, no-obligation quote" },
  { icon: CalendarCheck, label: "Quote within one business day" },
  { icon: ShieldCheck, label: "No upsell pressure" },
];

export function BuildMyDetail() {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 sm:py-32">
      {/* Controlled lime energy behind the strongest conversion moment */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[36rem] w-[36rem] rounded-full opacity-[0.14] blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-lime-500), transparent 70%)" }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <span className="edge-label">Get Started</span>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
              Build My
              <br />
              <span className="gold-text">Detail</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-steel-300">
              Tell us about your vehicle and pick where you want to start. We
              scope it, price it straight, and get back to you fast — no phone
              tag, no pressure.
            </p>

            <ul className="mt-7 space-y-3">
              {PROMISES.map((p) => (
                <li key={p.label} className="flex items-center gap-3 text-sm text-steel-200">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500/10 text-lime-400">
                    <p.icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  {p.label}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-lime-500 px-8 font-display text-base font-semibold uppercase tracking-wide text-ink-950 shadow-[0_10px_30px_-8px_rgba(124,255,0,0.6)] transition-all hover:bg-lime-400"
              >
                Start My Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${business.phone.e164}`}
                className="inline-flex items-center gap-2 font-display text-base font-semibold text-white transition-colors hover:text-lime-400"
              >
                <Phone className="h-4 w-4" />
                {business.phone.display}
              </a>
            </div>
          </div>

          {/* Service picker — obvious next action, drops straight into the quote */}
          <Reveal className="rounded-3xl border border-white/10 bg-ink-950/60 p-6 backdrop-blur-sm sm:p-8">
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-white">
              Where do you want to start?
            </p>
            <p className="mt-1 text-xs text-steel-500">
              Pick one to begin your quote — you can change it in the next step.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/contact?service=${s.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-all hover:border-lime-500/40 hover:bg-lime-500/[0.06]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-steel-300 transition-colors group-hover:bg-lime-500 group-hover:text-ink-950">
                    <DynamicIcon name={s.icon} className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold uppercase tracking-tight text-steel-200 group-hover:text-white">
                    {s.name}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-steel-600 transition-all group-hover:translate-x-0.5 group-hover:text-lime-400" />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
