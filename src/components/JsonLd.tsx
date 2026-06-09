import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import { getAllProducts, getCategories } from "@/lib/products";

export default function JsonLd() {
  const products = getAllProducts();
  const categories = getCategories();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: "https://litbuyfinds.io",
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://litbuyfinds.io/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    about: categories.map((category) => ({
      "@type": "CollectionPage",
      name: category.name,
      url: `https://litbuyfinds.io${category.href}`,
      numberOfItems: category.count,
    })),
    offers: {
      "@type": "AggregateOffer",
      offerCount: products.length,
      priceCurrency: "USD",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
