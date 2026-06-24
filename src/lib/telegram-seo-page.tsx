import type { Metadata } from "next";
import TelegramSeoLayout from "@/components/TelegramSeoLayout";
import {
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_NAME,
} from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { getTelegramSeoPage } from "@/lib/telegram-seo-pages";

function requireTelegramSeoPage(slug: string) {
  const config = getTelegramSeoPage(slug);
  if (!config) {
    throw new Error(`Unknown Telegram SEO page: ${slug}`);
  }
  return config;
}

function buildTelegramPageMetadata(config: ReturnType<typeof requireTelegramSeoPage>): Metadata {
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

export function createTelegramSeoPage(slug: string) {
  const config = requireTelegramSeoPage(slug);

  async function generateMetadata(): Promise<Metadata> {
    return buildTelegramPageMetadata(config);
  }

  function Page() {
    return <TelegramSeoLayout config={config} />;
  }

  return { generateMetadata, Page };
}
