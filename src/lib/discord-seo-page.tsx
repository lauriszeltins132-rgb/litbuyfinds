import type { Metadata } from "next";
import DiscordSeoLayout from "@/components/DiscordSeoLayout";
import { PROMO_OG_IMAGE_URL, SITE_NAME } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { getDiscordSeoPage } from "@/lib/discord-seo-pages";

function requireDiscordSeoPage(slug: string) {
  const config = getDiscordSeoPage(slug);
  if (!config) {
    throw new Error(`Unknown Discord SEO page: ${slug}`);
  }
  return config;
}

function buildDiscordPageMetadata(
  config: ReturnType<typeof requireDiscordSeoPage>
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

export function createDiscordSeoPage(slug: string) {
  const config = requireDiscordSeoPage(slug);

  async function generateMetadata(): Promise<Metadata> {
    return buildDiscordPageMetadata(config);
  }

  function Page() {
    return <DiscordSeoLayout config={config} />;
  }

  return { generateMetadata, Page };
}
