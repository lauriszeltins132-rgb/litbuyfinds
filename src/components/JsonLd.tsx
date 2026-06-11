import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { getAllProducts, getCategories } from "@/lib/products";
import { SITE_URL } from "@/lib/site";
import SchemaScript from "@/components/SchemaScript";

export default function JsonLd() {
  const products = getAllProducts();
  const categories = getCategories();

  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      description: SITE_DESCRIPTION,
      email: CONTACT_EMAIL,
      knowsAbout: [
        "LitBuy product discovery",
        "shopping agents",
        "QC photos",
        "sneaker finds",
        "streetwear finds",
      ],
      sameAs: [
        SOCIAL_LINKS.discord,
        SOCIAL_LINKS.telegram,
        SOCIAL_LINKS.tiktok,
        SOCIAL_LINKS.instagram,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
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
