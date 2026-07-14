import type { Metadata } from "next";
import DiscordAgentLandingLayout from "@/components/DiscordAgentLandingLayout";
import {
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_NAME,
} from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { getDiscordAgentLandingPage } from "@/lib/discord-agent-landing-pages";

function requireDiscordAgentLandingPage(slug: string) {
  const config = getDiscordAgentLandingPage(slug);
  if (!config) {
    throw new Error(`Unknown Discord agent landing page: ${slug}`);
  }
  return config;
}

function buildDiscordAgentPageMetadata(
  config: ReturnType<typeof requireDiscordAgentLandingPage>
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

export function createDiscordAgentLandingPage(slug: string) {
  const config = requireDiscordAgentLandingPage(slug);

  async function generateMetadata(): Promise<Metadata> {
    return buildDiscordAgentPageMetadata(config);
  }

  function Page() {
    return <DiscordAgentLandingLayout config={config} />;
  }

  return { generateMetadata, Page };
}
