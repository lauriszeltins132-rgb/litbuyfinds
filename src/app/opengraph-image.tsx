import { ImageResponse } from "next/og";
import {
  getStaticOgImageResponse,
  OG_IMAGE_SIZE,
} from "@/lib/static-og-image.server";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/jpeg";
export const alt = "LitBuy Finds — Real finds. Real quality.";

export default async function OpenGraphImage() {
  try {
    return await getStaticOgImageResponse();
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0a0b",
            color: "#D4FF3C",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          LitBuy Finds
        </div>
      ),
      { ...OG_IMAGE_SIZE }
    );
  }
}
