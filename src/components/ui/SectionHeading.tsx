import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 font-display text-xs font-semibold uppercase tracking-[0.3em]",
            tone === "dark" ? "text-lime-500" : "text-lime-400",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-balance font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-ink-950" : "text-white",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            tone === "dark" ? "text-steel-600" : "text-steel-300",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
