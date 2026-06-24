import type { BreadcrumbItem } from "@/components/Breadcrumbs";
import { SITE_NAME } from "./constants";
import {
  ORGANIZATION_SCHEMA_ID,
  WEBSITE_SCHEMA_ID,
  getContentAuthorSchema,
} from "./trust";
import { SITE_URL } from "./site";

export function buildBreadcrumbSchema(
  items: BreadcrumbItem[],
  currentPath?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const itemUrl = item.href
        ? `${SITE_URL}${item.href}`
        : currentPath
          ? `${SITE_URL}${currentPath}`
          : undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    }),
  };
}

export function buildArticleSchema({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished,
    dateModified,
    author: getContentAuthorSchema(),
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_SCHEMA_ID,
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    isPartOf: { "@id": WEBSITE_SCHEMA_ID },
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildItemListSchema({
  name,
  description,
  path,
  items,
}: {
  name: string;
  description?: string;
  path: string;
  items: { name: string; url: string; position: number }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    url: `${SITE_URL}${path}`,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      name: item.name,
      url: item.url,
    })),
  };
}

export function buildCollectionPageSchema({
  name,
  description,
  path,
  numberOfItems,
}: {
  name: string;
  description: string;
  path: string;
  numberOfItems: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    numberOfItems,
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_SCHEMA_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": ORGANIZATION_SCHEMA_ID },
  };
}

export function buildAboutPageSchema({
  description,
  path,
}: {
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    publisher: { "@id": ORGANIZATION_SCHEMA_ID },
    author: getContentAuthorSchema(),
  };
}

export function buildWebPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    mainEntityOfPage: { "@id": url },
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_SCHEMA_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": ORGANIZATION_SCHEMA_ID },
  };
}
