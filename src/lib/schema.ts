import type { BreadcrumbItem } from "@/components/Breadcrumbs";
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
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    author: {
      "@type": "Organization",
      name: "LitBuy Finds",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "LitBuy Finds",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    ...(dateModified ? { dateModified } : {}),
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
      name: "LitBuy Finds",
      url: SITE_URL,
    },
  };
}
