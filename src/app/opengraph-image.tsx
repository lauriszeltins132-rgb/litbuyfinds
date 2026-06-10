import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(135deg, #0a0a0b 0%, #141416 50%, #0f1a12 100%)",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#c9a227",
            fontWeight: 500,
          }}
        >
          Premium LitBuy Product Discovery
        </div>
      </div>
    ),
    { ...size }
  );
}
