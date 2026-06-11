import type { Metadata } from "next";
import {
  HOMEPAGE_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
} from "./constants";
import { SITE_URL } from "./site";

const BASE_URL = SITE_URL;

function resolveOgImage(path: string, image?: string): string {
  if (image) return image;
  if (
    path.startsWith("/guides/") ||
    path.startsWith("/categories/") ||
    path.startsWith("/brands/")
  ) {
    return `${BASE_URL}${path}/opengraph-image`;
  }
  return `${BASE_URL}/opengraph-image`;
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
  const ogImage = resolveOgImage(path, image);

  return {
    title,
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
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            authors: authors ?? ["LitBuy Finds Team"],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

export function buildHomepageMetadata(): Metadata {
  const url = `${BASE_URL}/`;
  const ogImage = `${BASE_URL}/opengraph-image`;

  return {
    title: { absolute: HOMEPAGE_TITLE },
    description: SITE_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: HOMEPAGE_TITLE,
      description: SITE_OG_DESCRIPTION,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: HOMEPAGE_TITLE,
      description: SITE_OG_DESCRIPTION,
      images: [ogImage],
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
