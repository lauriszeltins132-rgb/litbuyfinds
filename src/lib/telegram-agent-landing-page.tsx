import type { Metadata } from "next";
import TelegramAgentLandingLayout from "@/components/TelegramAgentLandingLayout";
import {
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_NAME,
} from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { getTelegramAgentLandingPage } from "@/lib/telegram-agent-landing-pages";

function requireTelegramAgentLandingPage(slug: string) {
  const config = getTelegramAgentLandingPage(slug);
  if (!config) {
    throw new Error(`Unknown Telegram agent landing page: ${slug}`);
  }
  return config;
}

function buildTelegramAgentPageMetadata(
  config: ReturnType<typeof requireTelegramAgentLandingPage>
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

export function createTelegramAgentLandingPage(slug: string) {
  const config = requireTelegramAgentLandingPage(slug);

  async function generateMetadata(): Promise<Metadata> {
    return buildTelegramAgentPageMetadata(config);
  }

  function Page() {
    return <TelegramAgentLandingLayout config={config} />;
  }

  return { generateMetadata, Page };
}
