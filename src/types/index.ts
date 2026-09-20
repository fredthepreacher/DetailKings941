// Shared content/data types for the Detail Kings 941 site.
// Keep this the single source of truth for shapes used by /src/data/*.

export type MediaAsset = {
  /** Stable id, e.g. "hero-primary" */
  id: string;
  /** Public path once a real file is dropped in (e.g. /images/hero/...) */
  src: string | null;
  alt: string;
  width: number;
  height: number;
  /** Is `src` a real, client-supplied asset, or an unfilled placeholder slot? */
  status: "placeholder" | "real";
  /** Where a focal point should sit for cropping, 0-100 each axis */
  focalPoint?: { x: number; y: number };
  credit?: string;
};

export type VideoAsset = {
  /** Stable id, e.g. "hero-foam-wash" */
  id: string;
  /** Primary/desktop H.264 MP4 path */
  src: string;
  /** Lighter mobile MP4 path, when a separate derivative exists */
  srcMobile?: string;
  /** WebP/AVIF poster frame — also the reduced-motion still */
  poster: string;
  /** Descriptive label used for aria + captioning */
  alt: string;
  /** Intrinsic pixel dimensions of the encoded derivative */
  width: number;
  height: number;
  status: "placeholder" | "real";
};

export type BeforeAfterPair = {
  id: string;
  title: string;
  vehicle: string;
  service?: string;
  before: MediaAsset;
  after: MediaAsset;
  orientation: "landscape" | "portrait" | "square";
};

export type Service = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  included: string[];
  idealFor: string;
  startingPrice?: string; // "Starting at $150" — omit until verified
  durationEstimate?: string; // omit until verified
  category: "interior" | "exterior" | "full-detail" | "paint" | "protection" | "add-on";
  verified: boolean; // false = drafted for client review, not confirmed real offering
  icon: string; // lucide-react icon name
  image?: MediaAsset; // representative real client work photo, once available
};

export type Review = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date: string;
  source: "google" | "facebook";
  sourceUrl?: string;
  verified: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  verified: boolean;
};

export type DifferentiatorItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  verified: boolean;
};

export type ServiceArea = {
  slug: string;
  city: string;
  state: "FL";
  active: boolean;
};
