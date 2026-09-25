// ============================================================================
// FEATURE FLAGS
// ----------------------------------------------------------------------------
// Cinematic Spatial Navigation (Phase B) is kept behind a flag so it can be
// disabled instantly without a code change.
//
//   Build-time default : NEXT_PUBLIC_CINEMATIC="off" disables it everywhere.
//   Instant kill switch: append ?cinematic=off to any URL (persists for the
//                        session via localStorage), or set
//                        localStorage["dk:cinematic"]="off" in devtools.
//   Force on           : ?cinematic=on  (or localStorage "on").
//
// The flag is read at click-time, never at render-time, so triggers always
// render as ordinary links and there is no hydration mismatch.
// ============================================================================

const LS_KEY = "dk:cinematic";

export function cinematicEnabled(): boolean {
  // Baked at build time; the only value that disables by default is "off".
  const envDefault = process.env.NEXT_PUBLIC_CINEMATIC !== "off";

  if (typeof window === "undefined") return envDefault;

  try {
    const q = new URL(window.location.href).searchParams.get("cinematic");
    if (q === "off" || q === "on") {
      window.localStorage.setItem(LS_KEY, q); // make the override sticky
      return q === "on";
    }
    const ls = window.localStorage.getItem(LS_KEY);
    if (ls === "off") return false;
    if (ls === "on") return true;
  } catch {
    /* private mode / storage disabled — fall back to the build default */
  }

  return envDefault;
}
