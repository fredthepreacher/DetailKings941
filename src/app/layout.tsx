import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { websiteSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Detail Kings 941 | Auto Detailing in Southwest Florida",
    template: "%s | Detail Kings 941",
  },
  description:
    "Hand-detailed interior and exterior auto detailing in Southwest Florida's 941 area — full details, paint correction, ceramic coating, and more. Get a free quote today.",
  openGraph: {
    title: "Detail Kings 941 | Auto Detailing in Southwest Florida",
    description:
      "Hand-detailed interior and exterior auto detailing in Southwest Florida's 941 area.",
    siteName: "Detail Kings 941",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileActionBar />
      </body>
    </html>
  );
}
