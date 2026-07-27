import type { Metadata } from "next";
import CouponSeoLayout from "@/components/CouponSeoLayout";
import { PROMO_OG_IMAGE_URL, SITE_NAME } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { getCouponSeoPage } from "@/lib/coupon-seo-pages";

function requireCouponSeoPage(slug: string) {
  const config = getCouponSeoPage(slug);
  if (!config) {
    throw new Error(`Unknown Coupon SEO page: ${slug}`);
  }
  return config;
}

function buildCouponPageMetadata(
  config: ReturnType<typeof requireCouponSeoPage>
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
          alt: config.imageAlt,
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

export function createCouponSeoPage(slug: string) {
  const config = requireCouponSeoPage(slug);

  async function generateMetadata(): Promise<Metadata> {
    return buildCouponPageMetadata(config);
  }

  function Page() {
    return <CouponSeoLayout config={config} />;
  }

  return { generateMetadata, Page };
}
