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
  datePublished,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  numberOfItems: number;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: `${SITE_URL}${path}`,
    numberOfItems,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
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
  aboutOrganization = false,
  datePublished,
  dateModified,
}: {
  name: string;
  description: string;
  path: string;
  aboutOrganization?: boolean;
  datePublished?: string;
  dateModified?: string;
}) {
  const url = `${SITE_URL}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    mainEntityOfPage: { "@id": url },
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    isPartOf: {
      "@type": "WebSite",
      "@id": WEBSITE_SCHEMA_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": ORGANIZATION_SCHEMA_ID },
    ...(aboutOrganization
      ? { about: { "@id": ORGANIZATION_SCHEMA_ID } }
      : {}),
  };
}

export function buildTelegramAgentWebPageSchema({
  name,
  description,
  path,
  agentName,
  telegramUrl,
}: {
  name: string;
  description: string;
  path: string;
  agentName: string;
  telegramUrl: string;
}) {
  return buildJoinAgentWebPageSchema({
    name,
    description,
    path,
    joinUrl: telegramUrl,
    joinLabel: `Join ${agentName} Telegram`,
  });
}

export function buildDiscordAgentWebPageSchema({
  name,
  description,
  path,
  agentName,
  discordUrl,
}: {
  name: string;
  description: string;
  path: string;
  agentName: string;
  discordUrl: string;
}) {
  return buildJoinAgentWebPageSchema({
    name,
    description,
    path,
    joinUrl: discordUrl,
    joinLabel: `Join ${agentName} Discord`,
  });
}

function buildJoinAgentWebPageSchema({
  name,
  description,
  path,
  joinUrl,
  joinLabel,
}: {
  name: string;
  description: string;
  path: string;
  joinUrl: string;
  joinLabel: string;
}) {
  const url = `${SITE_URL}${path}`;
  const joinAction = {
    "@type": "JoinAction",
    target: joinUrl,
    name: joinLabel,
  };

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
      potentialAction: joinAction,
    },
    potentialAction: joinAction,
    publisher: { "@id": ORGANIZATION_SCHEMA_ID },
  };
}

export function buildAgentCouponWebPageSchema({
  name,
  description,
  path,
  couponUrl,
  offerHeadline,
  offerDescription,
}: {
  name: string;
  description: string;
  path: string;
  couponUrl: string;
  offerHeadline: string;
  offerDescription: string;
}) {
  const url = `${SITE_URL}${path}`;
  const claimAction = {
    "@type": "ClaimAction",
    target: couponUrl,
    name: "Claim LitBuy Coupon",
  };

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
      potentialAction: claimAction,
    },
    potentialAction: claimAction,
    mainEntity: {
      "@type": "Offer",
      name: offerHeadline,
      description: offerDescription,
      url: couponUrl,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@id": ORGANIZATION_SCHEMA_ID },
    },
    publisher: { "@id": ORGANIZATION_SCHEMA_ID },
  };
}
