import type { Metadata } from "next";
import LitbuyCouponLandingLayout from "@/components/LitbuyCouponLandingLayout";
import {
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_NAME,
} from "@/lib/constants";
import {
  getLitbuyCouponLandingPage,
} from "@/lib/litbuy-coupon-landing-pages";
import { SITE_URL } from "@/lib/site";

function requireLitbuyCouponLandingPage(slug: string) {
  const config = getLitbuyCouponLandingPage(slug);
  if (!config) {
    throw new Error(`Unknown LitBuy coupon landing page: ${slug}`);
  }
  return config;
}

function buildLitbuyCouponPageMetadata(
  config: ReturnType<typeof requireLitbuyCouponLandingPage>
): Metadata {
  const url = `${SITE_URL}${config.path}`;

  return {
    title: { absolute: config.title },
    description: config.metaDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.metaDescription,
      url,
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
      title: config.title,
      description: config.metaDescription,
      images: [PROMO_OG_IMAGE_URL],
    },
  };
}

export function createLitbuyCouponLandingPage(slug: string) {
  const config = requireLitbuyCouponLandingPage(slug);

  async function generateMetadata(): Promise<Metadata> {
    return buildLitbuyCouponPageMetadata(config);
  }

  function Page() {
    return <LitbuyCouponLandingLayout config={config} />;
  }

  return { generateMetadata, Page };
}
