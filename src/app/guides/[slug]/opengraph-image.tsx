import {
  getStaticOgImageResponse,
  OG_IMAGE_ALT,
  OG_IMAGE_SIZE,
} from "@/lib/static-og-image.server";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/jpeg";
export const alt = OG_IMAGE_ALT;

export default async function GuideOgImage() {
  return getStaticOgImageResponse();
}
