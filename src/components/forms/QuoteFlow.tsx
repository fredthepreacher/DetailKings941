"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, ChevronLeft, ChevronRight, Loader2, PartyPopper } from "lucide-react";
import { services } from "@/data/services";
import { business } from "@/data/business";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const VEHICLE_TYPES = ["Sedan/Coupe", "SUV", "Truck", "Van/Minivan", "Other"] as const;

const CONDITIONS = [
  "Stains",
  "Pet hair",
  "Odor",
  "Heavy interior dirt",
  "Paint contamination",
  "Swirl marks / scratches",
  "Water spots",
  "Other",
] as const;

type FormState = {
  year: string;
  make: string;
  model: string;
  vehicleType: (typeof VEHICLE_TYPES)[number] | "";
  serviceSlugs: string[];
  conditions: string[];
  notes: string;
  name: string;
  phone: string;
  email: string;
};

const initialState: FormState = {
  year: "",
  make: "",
  model: "",
  vehicleType: "",
  serviceSlugs: [],
  conditions: [],
  notes: "",
  name: "",
  phone: "",
  email: "",
};

const STEP_LABELS = ["Vehicle", "Services", "Condition", "Contact", "Review"];
const TOTAL_STEPS = STEP_LABELS.length;
const CONTACT_STEP = 3;
const REVIEW_STEP = 4;

const emailOk = (v: string) => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const phoneOk = (v: string) => v.replace(/\D/g, "").length >= 7;
const nameOk = (v: string) => v.trim().length > 0;

export function QuoteFlow({
  preselectedService,
  variant = "page",
  persistKey,
  onDone,
}: {
  preselectedService?: string;
  variant?: "page" | "cinematic";
  /** When set, partial input survives closing/re-opening (sessionStorage). */
  persistKey?: string;
  /** Optional "done" affordance shown on the success screen (e.g. close overlay). */
  onDone?: () => void;
}) {
  const storageKey = persistKey ? `dk:quote:${persistKey}` : null;

  const [step, setStep] = useState<number>(() => {
    if (!storageKey || typeof window === "undefined") return 0;
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) {
        const s = (JSON.parse(raw) as { step?: number }).step;
        if (typeof s === "number") return Math.min(Math.max(s, 0), TOTAL_STEPS - 1);
      }
    } catch {
      /* ignore */
    }
    return 0;
  });

  const [form, setForm] = useState<FormState>(() => {
    const base: FormState = {
      ...initialState,
      serviceSlugs: preselectedService ? [preselectedService] : [],
    };
    if (!storageKey || typeof window === "undefined") return base;
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (!raw) return base;
      const saved = (JSON.parse(raw) as { form?: Partial<FormState> }).form ?? {};
      const merged: FormState = { ...base, ...saved };
      if (preselectedService && !merged.serviceSlugs.includes(preselectedService)) {
        merged.serviceSlugs = [preselectedService, ...merged.serviceSlugs];
      }
      return merged;
    } catch {
      return base;
    }
  });

  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Persist partial input so exiting and re-entering keeps the visitor's work.
  useEffect(() => {
    if (!storageKey) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify({ form, step }));
    } catch {
      /* ignore quota / private mode */
    }
  }, [form, step, storageKey]);

  const clearDraft = () => {
    if (!storageKey) return;
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleInArray = (key: "serviceSlugs" | "conditions", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const contactValid = nameOk(form.name) && phoneOk(form.phone) && emailOk(form.email);

  const canAdvance = () => {
    if (step === 0)
      return Boolean(form.year.trim() && form.make.trim() && form.model.trim() && form.vehicleType);
    if (step === 1) return form.serviceSlugs.length > 0;
    if (step === CONTACT_STEP) return contactValid;
    return true;
  };

  const next = () => {
    if (!canAdvance()) {
      if (step === CONTACT_STEP) setShowErrors(true);
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  // "Skip — I'll add it at the end": jump past contact; it's required to submit,
  // so Review will prompt for it there.
  const skipContact = () => setStep(REVIEW_STEP);

  const handleSubmit = async () => {
    if (!contactValid) {
      setShowErrors(true);
      setStep(CONTACT_STEP);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          year: form.year,
          make: form.make,
          model: form.model,
          vehicleType: form.vehicleType,
          serviceSlugs: form.serviceSlugs,
          conditions: form.conditions,
          notes: form.notes,
          source: variant === "cinematic" ? "build-my-detail" : "contact-page",
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      if (!res.ok || !data?.ok) {
        setSubmitError("We couldn't send your request just now. Please try again or call us.");
        return;
      }
      clearDraft();
      setSubmitted(true);
    } catch {
      setSubmitError("Network error — check your connection and try again, or give us a call.");
    } finally {
      setSubmitting(false);
    }
  };

  const wrapperClass =
    variant === "cinematic" ? "" : "rounded-3xl border border-white/10 bg-ink-900 p-6 sm:p-10";

  if (submitted) {
    return (
      <div className={cn(variant === "cinematic" ? "" : wrapperClass)}>
        <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-ink-900 px-8 py-16 text-center">
          <PartyPopper className="h-9 w-9 text-lime-500" />
          <h2 className="mt-5 font-display text-2xl font-semibold uppercase tracking-tight text-white sm:text-3xl">
            Request Received
          </h2>
          <p className="mt-3 max-w-md text-steel-400">
            Thanks, {form.name.split(" ")[0] || "there"} — we&apos;ll follow up shortly with pricing
            for your {form.year} {form.make} {form.model}. Need it faster?
          </p>
          <a
            href={`tel:${business.phone.e164}`}
            className="mt-6 font-display text-lg font-semibold text-lime-400 hover:text-lime-300"
          >
            Call {business.phone.display}
          </a>
          {onDone && (
            <button
              type="button"
              onClick={onDone}
              className="mt-8 font-display text-sm font-semibold uppercase tracking-wide text-steel-400 transition-colors hover:text-white"
            >
              Done
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {/* Progress */}
      <div className="mb-10 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col gap-2">
            <div
              className={cn(
                "h-1 rounded-full transition-colors duration-300",
                i <= step ? "bg-lime-500" : "bg-white/10",
              )}
            />
            <span
              className={cn(
                "hidden font-display text-[10px] font-semibold uppercase tracking-widest sm:block",
                i <= step ? "text-white" : "text-steel-600",
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <fieldset className="grid gap-5 sm:grid-cols-2">
              <legend className="mb-1 font-display text-xl font-semibold uppercase tracking-tight text-white sm:col-span-2">
                Your Vehicle
              </legend>
              <Field label="Year">
                <input
                  inputMode="numeric"
                  autoComplete="off"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value)}
                  placeholder="2021"
                  className={inputClass}
                />
              </Field>
              <Field label="Make">
                <input
                  value={form.make}
                  onChange={(e) => update("make", e.target.value)}
                  placeholder="Toyota"
                  autoCapitalize="words"
                  className={inputClass}
                />
              </Field>
              <Field label="Model">
                <input
                  value={form.model}
                  onChange={(e) => update("model", e.target.value)}
                  placeholder="Tacoma"
                  autoCapitalize="words"
                  className={inputClass}
                />
              </Field>
              <Field label="Vehicle Type">
                <select
                  value={form.vehicleType}
                  onChange={(e) => update("vehicleType", e.target.value as FormState["vehicleType"])}
                  className={inputClass}
                >
                  <option value="">Select one</option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>
            </fieldset>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-white">
                What Do You Need?
              </h2>
              <p className="mt-1 text-sm text-steel-400">Select all that apply.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services.map((s) => {
                  const checked = form.serviceSlugs.includes(s.slug);
                  return (
                    <button
                      type="button"
                      key={s.slug}
                      onClick={() => toggleInArray("serviceSlugs", s.slug)}
                      aria-pressed={checked}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors",
                        checked
                          ? "border-lime-500 bg-lime-500/10 text-white"
                          : "border-white/10 text-steel-300 hover:border-white/25",
                      )}
                    >
                      {s.name}
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                          checked ? "border-lime-500 bg-lime-500" : "border-white/20",
                        )}
                      >
                        {checked && <Check className="h-3.5 w-3.5 text-ink-950" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-white">
                Vehicle Condition
              </h2>
              <p className="mt-1 text-sm text-steel-400">
                Optional — helps us quote accurately. Select anything that applies.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {CONDITIONS.map((c) => {
                  const checked = form.conditions.includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleInArray("conditions", c)}
                      aria-pressed={checked}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                        checked
                          ? "border-lime-500 bg-lime-500/10 text-white"
                          : "border-white/10 text-steel-300 hover:border-white/25",
                      )}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6">
                <Field label="Anything else we should know?">
                  <textarea
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    rows={3}
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === 3 && (
            <fieldset className="grid gap-5">
              <legend className="mb-1 font-display text-xl font-semibold uppercase tracking-tight text-white">
                Contact Info
              </legend>
              <Field
                label="Name"
                error={showErrors && !nameOk(form.name) ? "Please enter your name." : undefined}
              >
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                  autoComplete="name"
                  autoCapitalize="words"
                  required
                  aria-required="true"
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Phone"
                  error={showErrors && !phoneOk(form.phone) ? "Enter a valid phone number." : undefined}
                >
                  <input
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass}
                    autoComplete="tel"
                    placeholder="(941) 555-0123"
                    required
                    aria-required="true"
                  />
                </Field>
                <Field
                  label="Email (optional)"
                  error={showErrors && !emailOk(form.email) ? "Enter a valid email or leave blank." : undefined}
                >
                  <input
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={skipContact}
                  className="font-display text-xs font-semibold uppercase tracking-wide text-steel-400 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
                >
                  Skip — I&apos;ll add it at the end
                </button>
              </div>
              <label className="flex items-start gap-3 rounded-xl border border-dashed border-white/15 px-4 py-3.5 text-sm text-steel-400">
                <Camera className="mt-0.5 h-4 w-4 shrink-0 text-steel-500" />
                Photo upload will be available here once the backend supports
                it — for now, feel free to text or email photos after
                submitting.
              </label>
            </fieldset>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display text-xl font-semibold uppercase tracking-tight text-white">
                Review &amp; Submit
              </h2>
              <dl className="mt-6 space-y-4 divide-y divide-white/10">
                <ReviewRow label="Vehicle" value={`${form.year} ${form.make} ${form.model} (${form.vehicleType})`} />
                <ReviewRow
                  label="Services"
                  value={
                    form.serviceSlugs
                      .map((slug) => services.find((s) => s.slug === slug)?.name)
                      .filter(Boolean)
                      .join(", ") || "—"
                  }
                />
                <ReviewRow label="Condition notes" value={[...form.conditions, form.notes].filter(Boolean).join(", ") || "—"} />
                <ReviewRow
                  label="Contact"
                  value={
                    contactValid
                      ? `${form.name} · ${form.phone}${form.email ? ` · ${form.email}` : ""}`
                      : "Not added yet"
                  }
                />
              </dl>

              {!contactValid && (
                <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gold-500/30 bg-gold-500/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-steel-200">
                    Add your name and phone so we can send your quote.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowErrors(true);
                      setStep(CONTACT_STEP);
                    }}
                    className="shrink-0 font-display text-xs font-semibold uppercase tracking-wide text-gold-300 underline underline-offset-4 hover:text-gold-200"
                  >
                    Add contact info
                  </button>
                </div>
              )}

              {submitError && (
                <p role="alert" className="mt-5 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={back}
          className={cn(step === 0 && "invisible")}
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {step < TOTAL_STEPS - 1 ? (
          <Button type="button" onClick={next} disabled={!canAdvance()}>
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={submitting || !contactValid}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : (
              "Submit Request"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-ink-950 px-4 py-3 text-sm text-white placeholder:text-steel-600 outline-none transition-colors focus:border-lime-500";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-steel-400">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-medium text-red-300">{error}</span>}
    </label>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 pt-4 first:pt-0 sm:flex-row sm:justify-between">
      <dt className="font-display text-xs font-semibold uppercase tracking-wide text-steel-500">
        {label}
      </dt>
      <dd className="text-sm text-white sm:text-right">{value}</dd>
    </div>
  );
}
