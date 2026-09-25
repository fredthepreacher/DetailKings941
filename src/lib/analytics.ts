// Provider-agnostic analytics hooks. Events go to `window.dataLayer` (GTM /
// GA4-compatible) and a `dk:analytics` CustomEvent, so any provider can be
// attached later without touching call sites. Never pass form values here —
// only event names and non-identifying context (service slug, source, timing).

export type AnalyticsEvent =
  | "cinematic_transition_started"
  | "cinematic_transition_completed"
  | "cinematic_transition_abandoned"
  | "cinematic_closed"
  | "build_my_detail_opened"
  | "service_selected";

type Props = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  (window.dataLayer ??= []).push({ event, ...props });
  window.dispatchEvent(new CustomEvent("dk:analytics", { detail: { event, ...props } }));
  if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
}
