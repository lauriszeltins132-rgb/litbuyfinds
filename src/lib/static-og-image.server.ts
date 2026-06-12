import { readFile } from "fs/promises";
import path from "path";
import { PROMO_BANNER_ALT } from "./constants";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };
export const OG_IMAGE_CONTENT_TYPE = "image/jpeg";

export async function getStaticOgImageResponse(): Promise<Response> {
  const file = await readFile(
    path.join(process.cwd(), "public/banners/litbuy-finds-og.jpg")
  );
  return new Response(file, {
    headers: {
      "Content-Type": OG_IMAGE_CONTENT_TYPE,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export const OG_IMAGE_ALT = PROMO_BANNER_ALT;
