import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

export function renderOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a0b 0%, #141416 50%, #0f1a12 100%)",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#c9a227",
            fontWeight: 500,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#8b8b96",
            marginTop: 32,
          }}
        >
          litbuyfinds.io
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
