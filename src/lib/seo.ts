import type { Metadata } from "next";
import {
  HOMEPAGE_TITLE,
  PROMO_BANNER_ALT,
  PROMO_OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
  SITE_OG_TITLE,
} from "./constants";
import { SITE_URL } from "./site";

const BASE_URL = SITE_URL;

const DEFAULT_OG_IMAGE = {
  url: PROMO_OG_IMAGE_URL,
  width: 1200,
  height: 630,
  alt: PROMO_BANNER_ALT,
  type: "image/jpeg",
};

function resolveOgImage(image?: string): string {
  return image ?? PROMO_OG_IMAGE_URL;
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: PageMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = resolveOgImage(image);
  const pageTitle = title.trim();

  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: url },
    ...(type === "article" && publishedTime
      ? {
          other: {
            "article:published_time": publishedTime,
            ...(modifiedTime
              ? { "article:modified_time": modifiedTime }
              : {}),
          },
        }
      : {}),
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      images: [{ ...DEFAULT_OG_IMAGE, url: ogImage, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

export function buildHomepageMetadata(): Metadata {
  const url = `${BASE_URL}/`;

  return {
    title: { absolute: HOMEPAGE_TITLE },
    description: SITE_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: SITE_OG_TITLE,
      description: SITE_OG_DESCRIPTION,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_OG_TITLE,
      description: SITE_OG_DESCRIPTION,
      images: [PROMO_OG_IMAGE_URL],
    },
  };
}

export function buildArticlePageMetadata(
  options: Omit<PageMetadataOptions, "type"> & {
    publishedTime: string;
    modifiedTime: string;
  }
): Metadata {
  return buildPageMetadata({
    ...options,
    type: "article",
    authors: options.authors ?? ["LitBuy Finds Team"],
  });
}
