import type { Metadata } from "next";
import { shopTeamMedia } from "@/data/media";
import { differentiators } from "@/data/differentiators";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderMedia } from "@/components/media/PlaceholderMedia";
import { DynamicIcon } from "@/lib/icons";
import { LocalStory } from "@/components/home/LocalStory";

export const metadata: Metadata = {
  title: "About Us",
  description: "Detail Kings 941 is a locally owned auto detailing business serving Southwest Florida's 941 area.",
};

export default function AboutPage() {
  return (
    <div className="bg-ink-950 pt-32 pb-24">
      <Container>
        <SectionHeading
          eyebrow="About"
          title="Detail Kings 941"
          description="A locally owned auto detailing operation serving Southwest Florida — built around hand-finished work, not shortcuts. (Full owner/shop story to be added once provided by the client.)"
          tone="light"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {shopTeamMedia.map((asset) => (
            <div key={asset.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <PlaceholderMedia asset={asset} sizes="50vw" />
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2">
          {differentiators.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-ink-900 p-7">
              <DynamicIcon name={item.icon} className="h-6 w-6 text-lime-500" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-steel-400">{item.description}</p>
            </div>
          ))}
        </div>
      </Container>

      <div className="mt-24">
        <LocalStory />
      </div>
    </div>
  );
}
