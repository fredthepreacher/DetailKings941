import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CINEMATIC_ENABLED } from "@/lib/cinematic/flag";
import { Container } from "@/components/ui/Container";
import { BuildMyDetailExperience } from "@/components/cinematic/BuildMyDetailExperience";

// Same interface the cinematic overlay shows, as a real page for refresh,
// deep links, and shares. /contact stays the indexable quote page, so this
// one is noindex with a canonical pointing there.
export const metadata: Metadata = {
  title: "Build My Detail",
  description: "Build your auto detail and get a free quote from Detail Kings 941.",
  alternates: { canonical: "/contact" },
  robots: { index: false, follow: true },
};

export default async function BuildMyDetailPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  if (!CINEMATIC_ENABLED) {
    redirect(service ? `/contact?service=${encodeURIComponent(service)}` : "/contact");
  }

  return (
    <div className="bg-ink-950 pb-24 pt-32">
      <Container className="max-w-3xl">
        <BuildMyDetailExperience service={service} headingLevel="h1" />
      </Container>
    </div>
  );
}
