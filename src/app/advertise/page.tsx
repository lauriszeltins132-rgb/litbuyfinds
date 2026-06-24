import type { Metadata } from "next";
import AdvertisePageLayout from "@/components/AdvertisePageLayout";
import {
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_NAME,
} from "@/lib/constants";
import {
  ADVERTISE_KEYWORDS,
  ADVERTISE_META_DESCRIPTION,
  ADVERTISE_PAGE_PATH,
  ADVERTISE_PAGE_TITLE,
} from "@/lib/advertise-page";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: ADVERTISE_PAGE_TITLE },
  description: ADVERTISE_META_DESCRIPTION,
  keywords: [...ADVERTISE_KEYWORDS],
  alternates: { canonical: `${SITE_URL}${ADVERTISE_PAGE_PATH}` },
  robots: { index: true, follow: true },
  openGraph: {
    title: ADVERTISE_PAGE_TITLE,
    description: ADVERTISE_META_DESCRIPTION,
    url: `${SITE_URL}${ADVERTISE_PAGE_PATH}`,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: PROMO_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: PROMO_BANNER_ALT,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ADVERTISE_PAGE_TITLE,
    description: ADVERTISE_META_DESCRIPTION,
    images: [PROMO_OG_IMAGE_URL],
  },
};

export default function AdvertisePage() {
  return <AdvertisePageLayout />;
}
