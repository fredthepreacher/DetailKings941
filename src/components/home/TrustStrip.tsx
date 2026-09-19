import { CalendarCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { reviewSummary } from "@/data/reviews";
import { Container } from "@/components/ui/Container";

const baseItems = [
  { icon: MapPin, label: "Southwest Florida · 941" },
  { icon: ShieldCheck, label: "Locally owned & operated" },
  { icon: Sparkles, label: "Hand-detailed finish" },
  { icon: CalendarCheck, label: "Quotes within one business day" },
];

/**
 * Only substantiated claims — no invented review counts or stats (spec 2).
 * The rating badge only renders once reviewSummary is populated with real,
 * verified numbers.
 */
export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-ink-900 py-6">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:justify-between">
          {reviewSummary && (
            <div className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wide text-white">
              <span className="text-ember-500">★ {reviewSummary.rating.toFixed(1)}</span>
              Google Rating · {reviewSummary.count} Reviews
            </div>
          )}
          {baseItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-steel-400"
            >
              <item.icon className="h-4 w-4 text-ember-500" strokeWidth={1.75} />
              {item.label}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
