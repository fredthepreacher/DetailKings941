import type { NextConfig } from "next";

// Cinematic Spatial Navigation flag. An explicit NEXT_PUBLIC_CINEMATIC_EXPERIENCE
// always wins; otherwise it defaults ON for local dev + Vercel previews and OFF
// for production, so a production build can never pick it up by accident.
const cinematic =
  process.env.NEXT_PUBLIC_CINEMATIC_EXPERIENCE ??
  (process.env.VERCEL_ENV === "production" ? "false" : "true");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CINEMATIC_EXPERIENCE: cinematic,
  },
};

export default nextConfig;
