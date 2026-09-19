import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 rounded-full whitespace-nowrap select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-ember-500 text-white shadow-[0_8px_24px_-8px_rgba(255,90,31,0.6)] hover:bg-ember-400 hover:shadow-[0_10px_30px_-6px_rgba(255,90,31,0.75)]",
  secondary:
    "bg-white text-ink-950 hover:bg-steel-100",
  outline:
    "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
  ghost: "text-white/80 hover:text-white hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: never;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const rest = { ...props } as Record<string, unknown>;
  delete rest.href;
  delete rest.variant;
  delete rest.size;
  delete rest.className;
  delete rest.children;

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
