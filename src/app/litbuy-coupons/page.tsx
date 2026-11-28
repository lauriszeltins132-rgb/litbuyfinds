import type { Metadata } from "next";
import LitbuyCouponsPage from "@/components/LitbuyCouponsPage";
import {
  LITBUY_COUPONS_METADATA,
  LITBUY_COUPONS_PATH,
} from "@/lib/litbuy-coupons-page";
import { buildPageMetadata } from "@/lib/seo";

const LITBUY_COUPONS_OG_IMAGE = "https://litbuyfinds.io/banners/litbuy-coupons-og.jpg";

export const metadata: Metadata = buildPageMetadata({
  title: LITBUY_COUPONS_METADATA.title,
  description: LITBUY_COUPONS_METADATA.description,
  path: LITBUY_COUPONS_PATH,
  image: LITBUY_COUPONS_OG_IMAGE,
});

/** ISR — refresh last-updated date daily */
export const revalidate = 86400;

export default function Page() {
  return <LitbuyCouponsPage />;
}
