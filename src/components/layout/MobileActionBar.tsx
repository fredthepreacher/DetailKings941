import { NotebookPen, Phone } from "lucide-react";
import { business } from "@/data/business";

/**
 * Sticky thumb-reach conversion bar for mobile — CALL / QUOTE. Directions is
 * intentionally omitted until an address is confirmed (spec 12: "only
 * include directions when the operating location is confirmed").
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/10 bg-ink-950/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden">
      <a
        href={`tel:${business.phone.e164}`}
        className="flex flex-1 items-center justify-center gap-2 border-r border-white/10 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-white active:bg-white/5"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <a
        href="/contact"
        className="flex flex-1 items-center justify-center gap-2 bg-lime-500 py-3.5 font-display text-sm font-semibold uppercase tracking-wide text-ink-950 active:bg-lime-600"
      >
        <NotebookPen className="h-4 w-4" />
        Get a Quote
      </a>
    </div>
  );
}
