import {
  Crown,
  Droplets,
  Hand,
  Handshake,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  Wand2,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Crown,
  Droplets,
  Hand,
  Handshake,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
  Wand2,
};

export function DynamicIcon({
  name,
  className,
  strokeWidth,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
