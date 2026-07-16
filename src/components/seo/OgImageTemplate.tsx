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
            "linear-gradient(135deg, #FAF6ED 0%, #FFFDF8 50%, #F5EDE0 100%)",
          color: "#1A1712",
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
            color: "#C8761A",
            fontWeight: 600,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 36,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#22c55e",
            }}
          />
          <div style={{ fontSize: 22, color: "#a1a1aa" }}>litbuyfinds.io</div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
