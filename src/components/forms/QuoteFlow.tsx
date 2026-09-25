"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";
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

export function QuoteFlow({ preselectedService }: { preselectedService?: string }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(() => ({
    ...initialState,
    serviceSlugs: preselectedService ? [preselectedService] : [],
  }));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleInArray = (key: "serviceSlugs" | "conditions", value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const contactErrors = validateContact(form);
  const [showContactErrors, setShowContactErrors] = useState(false);
  const uid = useId();

  const canAdvance = () => {
    if (step === 0) return form.year.trim() && form.make.trim() && form.model.trim() && form.vehicleType;
    if (step === 1) return form.serviceSlugs.length > 0;
    return true;
  };

  const next = () => {
    if (step === 3 && Object.keys(contactErrors).length > 0) {
      // Explain instead of silently disabling: reveal errors, focus the first.
      setShowContactErrors(true);
      const first = (["name", "phone", "email"] as const).find((k) => contactErrors[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    if (canAdvance()) setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    // NOTE: no third-party form backend has been wired up per instruction
    // ("do not connect random third-party services without instruction").
    // This is the interaction architecture only — swap this handler for a
    // real submission (API route, email service, CRM webhook) once Fred
    // decides how leads should land.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-white/10 bg-ink-900 px-8 py-16 text-center">
        <PartyPopper className="h-9 w-9 text-lime-500" />
        <h2 className="mt-5 font-display text-2xl font-semibold uppercase tracking-tight text-white sm:text-3xl">
          Request Received
        </h2>
        <p className="mt-3 max-w-md text-steel-400">
          Thanks, {form.name.split(" ")[0] || "there"} — we&apos;ll follow up shortly with pricing for
          your {form.year} {form.make} {form.model}. Need it faster?
        </p>
        <a
          href={`tel:${business.phone.e164}`}
          className="mt-6 font-display text-lg font-semibold text-lime-400 hover:text-lime-300"
        >
          Call {business.phone.display}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-ink-900 p-6 sm:p-10">
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
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={form.year}
                  onChange={(e) => update("year", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="2021"
                  className={inputClass}
                />
              </Field>
              <Field label="Make">
                <input
                  value={form.make}
                  onChange={(e) => update("make", e.target.value)}
                  placeholder="Toyota"
                  className={inputClass}
                />
              </Field>
              <Field label="Model">
                <input
                  value={form.model}
                  onChange={(e) => update("model", e.target.value)}
                  placeholder="Tacoma"
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
              <Field label="Name" htmlFor={`${uid}-name`} error={showContactErrors ? contactErrors.name : undefined}>
                <input
                  id={`${uid}-name`}
                  name="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => form.name && setShowContactErrors(true)}
                  className={inputClass}
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  required
                  aria-required="true"
                  {...errorProps(`${uid}-name`, showContactErrors && contactErrors.name)}
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Mobile Phone" htmlFor={`${uid}-phone`} error={showContactErrors ? contactErrors.phone : undefined}>
                  <input
                    id={`${uid}-phone`}
                    name="tel"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    onBlur={() => form.phone && setShowContactErrors(true)}
                    placeholder="(941) 555-0123"
                    className={inputClass}
                    autoComplete="tel"
                    enterKeyHint="next"
                    required
                    aria-required="true"
                    {...errorProps(`${uid}-phone`, showContactErrors && contactErrors.phone)}
                  />
                </Field>
                <Field label="Email (optional)" htmlFor={`${uid}-email`} error={showContactErrors ? contactErrors.email : undefined}>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    onBlur={() => form.email && setShowContactErrors(true)}
                    className={inputClass}
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    enterKeyHint="done"
                    {...errorProps(`${uid}-email`, showContactErrors && contactErrors.email)}
                  />
                </Field>
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
                <ReviewRow label="Contact" value={`${form.name} · ${form.phone}${form.email ? ` · ${form.email}` : ""}`} />
              </dl>
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
          <Button type="button" onClick={handleSubmit}>
            Submit Request
          </Button>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/15 bg-ink-950 px-4 py-3 text-sm text-white placeholder:text-steel-600 outline-none transition-colors focus:border-lime-500 aria-[invalid=true]:border-red-400/70";

// US mobile numbers: 10 digits, optionally prefixed with country code 1.
function isValidUsPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateContact(form: FormState) {
  const errors: Partial<Record<"name" | "phone" | "email", string>> = {};
  if (form.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!form.phone.trim()) errors.phone = "A mobile number is required so we can send your quote.";
  else if (!isValidUsPhone(form.phone)) errors.phone = "Enter a 10-digit US phone number.";
  if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) {
    errors.email = "That email doesn't look right — or leave it blank.";
  }
  return errors;
}

function errorProps(id: string, error: string | false | undefined) {
  return error
    ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` }
    : {};
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  // With htmlFor the label is explicitly paired (needed once an error message
  // sits beside the input); without it, the wrapping label still associates.
  const Wrapper = htmlFor ? "div" : "label";
  return (
    <Wrapper className="block">
      {htmlFor ? (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-steel-400"
        >
          {label}
        </label>
      ) : (
        <span className="mb-1.5 block font-display text-xs font-semibold uppercase tracking-wide text-steel-400">
          {label}
        </span>
      )}
      {children}
      {error && htmlFor && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </Wrapper>
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
