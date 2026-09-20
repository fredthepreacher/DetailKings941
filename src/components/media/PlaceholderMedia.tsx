import Image from "next/image";
import { Camera } from "lucide-react";
import type { MediaAsset } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Renders a real image when `asset.status === "real"`, or a designed
 * placeholder (not a broken <img>) when the asset hasn't arrived yet.
 * Swapping media later is just editing /src/data/media.ts — no component
 * changes required.
 */
export function PlaceholderMedia({
  asset,
  className,
  sizes = "100vw",
  priority = false,
  fill = true,
}: {
  asset: MediaAsset;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  if (asset.status === "real" && asset.src) {
    // Intrinsic mode (fill=false): the image sizes itself from its natural
    // aspect ratio — used for masonry/editorial layouts where the tile height
    // should follow the photo rather than a fixed container.
    if (!fill) {
      return (
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          sizes={sizes}
          priority={priority}
          className={cn("h-auto w-full", className)}
        />
      );
    }
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950",
        fill ? "h-full w-full" : "aspect-[4/3] w-full",
        className,
      )}
      role="img"
      aria-label={asset.alt}
    >
      {/* Soft brand-lime glow so the empty state reads as designed, not broken */}
      <div
        className="absolute -right-1/4 -top-1/4 h-2/3 w-2/3 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-lime-500), transparent 70%)" }}
      />
      <div
        className="absolute -left-1/4 -bottom-1/4 h-2/3 w-2/3 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-chrome-b), transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, white 0, white 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2.5 px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
          <Camera className="h-4.5 w-4.5 text-steel-300" strokeWidth={1.5} />
        </div>
        <span className="font-display text-[11px] font-medium uppercase tracking-[0.2em] text-steel-400">
          Photo Pending
        </span>
      </div>
    </div>
  );
}
