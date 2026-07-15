import type { Metadata } from "next";
import AgentCouponLandingLayout from "@/components/AgentCouponLandingLayout";
import {
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_NAME,
} from "@/lib/constants";
import { getAgentCouponLandingPage } from "@/lib/agent-coupon-landing-pages";
import { SITE_URL } from "@/lib/site";

function requireAgentCouponLandingPage(slug: string) {
  const config = getAgentCouponLandingPage(slug);
  if (!config) {
    throw new Error(`Unknown agent coupon landing page: ${slug}`);
  }
  return config;
}

function buildAgentCouponPageMetadata(
  config: ReturnType<typeof requireAgentCouponLandingPage>
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

export function createAgentCouponLandingPage(slug: string) {
  const config = requireAgentCouponLandingPage(slug);

  async function generateMetadata(): Promise<Metadata> {
    return buildAgentCouponPageMetadata(config);
  }

  function Page() {
    return <AgentCouponLandingLayout config={config} />;
  }

  return { generateMetadata, Page };
}
