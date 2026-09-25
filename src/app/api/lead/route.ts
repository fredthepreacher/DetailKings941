import { NextResponse } from "next/server";
import { deliverLead, type LeadPayload } from "@/lib/leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean) : [];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const name = str(b.name);
  const phone = str(b.phone);

  // Server-side validation is authoritative — never trust the client.
  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "missing_required_fields" }, { status: 422 });
  }

  const payload: LeadPayload = {
    name,
    phone,
    email: str(b.email) || undefined,
    year: str(b.year) || undefined,
    make: str(b.make) || undefined,
    model: str(b.model) || undefined,
    vehicleType: str(b.vehicleType) || undefined,
    serviceSlugs: strArr(b.serviceSlugs),
    conditions: strArr(b.conditions),
    notes: str(b.notes) || undefined,
    source: str(b.source) || "web",
  };

  const result = await deliverLead(payload);
  return NextResponse.json(result, { status: 200 });
}
