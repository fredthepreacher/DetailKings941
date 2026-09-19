import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Typographic placeholder favicon until the real logo is supplied — swap
// this file out (or replace with a static icon.png) once the client's
// actual logo/brand mark is confirmed (see ASSET_AUDIT_REPORT.md).
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b101c",
          borderRadius: 14,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            color: "#ff5a1f",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          DK
        </div>
      </div>
    ),
    { ...size },
  );
}
