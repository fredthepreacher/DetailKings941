import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { websiteSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/schema";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { CinematicHost } from "@/components/cinematic/CinematicHost";
import { CINEMATIC_ENABLED } from "@/lib/cinematic/flag";

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
    images: [
      {
        url: "/images/hero/blue-camaro-1600x900.webp",
        width: 1600,
        height: 900,
        alt: "Detail Kings 941 — freshly detailed blue Camaro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#7CFF00",
};

export default function RootLayout({ children, cinema }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: lets Next suspend smooth scrolling during route
    // changes so navigation never animates the page scroll.
    <html lang="en" className="h-full" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        <MotionProvider>
          <Header />
          {/* The "stage": the live page the cinematic camera dollies into. */}
          <div data-cinematic-stage="" className="flex flex-1 flex-col">
            <main className="flex-1 pb-16 lg:pb-0">{children}</main>
            <Footer />
          </div>
          <MobileActionBar />
          {CINEMATIC_ENABLED && <CinematicHost />}
          {cinema}
        </MotionProvider>
      </body>
    </html>
  );
}
