import type { Product } from "@/lib/types";
import { SITE_NAME } from "@/lib/constants";

type ProductJsonLdProps = {
  product: Product;
  slug: string;
};

export default function ProductJsonLd({ product, slug }: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product_name,
    description: `${product.product_name} — curated on ${SITE_NAME}`,
    image: product.image ? [product.image] : undefined,
    category: product.category,
    url: `https://litbuyfinds.io/find/${slug}`,
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: product.affiliate_link || `https://litbuyfinds.io/find/${slug}`,
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
