// ============================================================================
// SERVER-SIDE LEAD ADAPTER  (imported only by the /api/lead route handler)
// ----------------------------------------------------------------------------
// The cinematic UX must not be blocked on backend wiring, so submission goes
// through this single seam. Today no live destination is configured, so the
// adapter runs in an explicit **development fallback**: it captures the lead
// server-side and returns `delivered: false`. It NEVER reports a lead as
// delivered unless a real transport actually accepted it.
//
// To go live, set LEAD_WEBHOOK_URL (e.g. a CRM/Zapier/email webhook). No
// component code changes are needed — the shape below is the contract.
// ============================================================================

export type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  year?: string;
  make?: string;
  model?: string;
  vehicleType?: string;
  serviceSlugs?: string[];
  conditions?: string[];
  notes?: string;
  source?: string;
};

export type LeadResult = {
  ok: boolean;
  /** True ONLY when a real transport accepted the lead. */
  delivered: boolean;
  /** "webhook" | "webhook-error" | "dev-fallback" */
  mode: string;
  id: string;
};

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export async function deliverLead(payload: LeadPayload): Promise<LeadResult> {
  const id = newId();
  const webhook = process.env.LEAD_WEBHOOK_URL;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, receivedAt: new Date().toISOString(), ...payload }),
      });
      if (res.ok) return { ok: true, delivered: true, mode: "webhook", id };
      console.error(`[lead][webhook] destination returned ${res.status} for ${id} — NOT delivered`);
      return { ok: true, delivered: false, mode: "webhook-error", id };
    } catch (err) {
      console.error(`[lead][webhook] transport failed for ${id} — NOT delivered:`, err);
      return { ok: true, delivered: false, mode: "webhook-error", id };
    }
  }

  // No destination configured yet: capture only. Explicitly NOT delivered.
  console.info(
    `[lead][dev-fallback] captured (NOT delivered) ${id} — ` +
      `${payload.name} / ${payload.phone}${payload.email ? ` / ${payload.email}` : ""} — ` +
      `services: ${(payload.serviceSlugs ?? []).join(", ") || "none"}`,
  );
  return { ok: true, delivered: false, mode: "dev-fallback", id };
}
