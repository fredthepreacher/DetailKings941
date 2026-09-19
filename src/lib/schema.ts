// JSON-LD structured-data builders. Kept minimal and honest: only fields we
// can actually back with confirmed data are emitted. `address` and
// `aggregateRating` are intentionally omitted while business.location and
// reviewSummary are unresolved — a wrong address in schema.org markup is
// worse for local SEO than no address.

import { business } from "@/data/business";
import { reviewSummary } from "@/data/reviews";
import { services } from "@/data/services";

const siteUrl = "https://www.detailkings941.com"; // placeholder domain — update once the real domain is chosen

export function localBusinessSchema() {
  const loc = business.location.confirmed;

  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name: business.name,
    telephone: business.phone.e164,
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    sameAs: [business.social.instagram, business.social.facebook].filter(Boolean),
    ...(loc && {
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.street,
        addressLocality: loc.city,
        addressRegion: loc.state,
        postalCode: loc.zip,
        addressCountry: "US",
      },
    }),
    ...(loc?.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: loc.coordinates.lat,
        longitude: loc.coordinates.lng,
      },
    }),
    ...(reviewSummary && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviewSummary.rating,
        reviewCount: reviewSummary.count,
      },
    }),
    priceRange: "$$",
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.shortDescription,
      },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: business.name,
    url: siteUrl,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

export const SITE_URL = siteUrl;
