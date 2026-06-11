import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { getAllProducts, getCategories } from "@/lib/products";
import {
  CONTENT_TEAM_DESCRIPTION,
  CONTENT_TEAM_NAME,
  ORGANIZATION_SCHEMA_ID,
  WEBSITE_SCHEMA_ID,
} from "@/lib/trust";
import { SITE_URL } from "@/lib/site";
import SchemaScript from "@/components/SchemaScript";

export default function JsonLd() {
  const products = getAllProducts();
  const categories = getCategories();

  const graph = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_SCHEMA_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
      description: SITE_DESCRIPTION,
      email: CONTACT_EMAIL,
      foundingDate: "2026",
      knowsAbout: [
        "LitBuy product discovery",
        "shopping agents",
        "QC photos",
        "Weidian finds",
        "Taobao finds",
        "sneaker finds",
        "streetwear finds",
        "budget finds",
      ],
      sameAs: [
        SOCIAL_LINKS.discord,
        SOCIAL_LINKS.telegram,
        SOCIAL_LINKS.tiktok,
        SOCIAL_LINKS.instagram,
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: CONTACT_EMAIL,
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#content-team`,
      name: CONTENT_TEAM_NAME,
      url: SITE_URL,
      description: CONTENT_TEAM_DESCRIPTION,
      parentOrganization: { "@id": ORGANIZATION_SCHEMA_ID },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_SCHEMA_ID,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": ORGANIZATION_SCHEMA_ID },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "ItemList",
      name: `${SITE_NAME} catalog`,
      numberOfItems: products.length,
      itemListElement: categories.slice(0, 12).map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${category.href}`,
        name: category.name,
      })),
    },
  ];

  return (
    <SchemaScript
      data={{
        "@context": "https://schema.org",
        "@graph": graph,
      }}
    />
  );
}
