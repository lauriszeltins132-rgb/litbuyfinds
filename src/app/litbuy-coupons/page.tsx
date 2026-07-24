import type { Metadata } from "next";
import LitbuyCouponsPage from "@/components/LitbuyCouponsPage";
import {
  LITBUY_COUPONS_METADATA,
  LITBUY_COUPONS_PATH,
} from "@/lib/litbuy-coupons-page";
import { PROMO_BANNER_OG } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: LITBUY_COUPONS_METADATA.title,
  description: LITBUY_COUPONS_METADATA.description,
  path: LITBUY_COUPONS_PATH,
  image: `https://litbuyfinds.io${PROMO_BANNER_OG}`,
});

/** ISR — refresh last-updated date daily */
export const revalidate = 86400;

export default function Page() {
  return <LitbuyCouponsPage />;
}
