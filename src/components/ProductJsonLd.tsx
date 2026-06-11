import type { Product } from "@/lib/types";
import { SITE_NAME } from "@/lib/constants";
import { extractBrand } from "@/lib/brands";
import { hasExactPrice } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";
import SchemaScript from "@/components/SchemaScript";

type ProductJsonLdProps = {
  product: Product;
  slug: string;
};

export default function ProductJsonLd({ product, slug }: ProductJsonLdProps) {
  const brand = extractBrand(product.product_name);
  const url = `${SITE_URL}/find/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product_name,
    description: `${product.product_name} — curated on ${SITE_NAME}`,
    image: product.image ? [product.image] : undefined,
    category: product.category,
    url,
    ...(brand
      ? {
          brand: {
            "@type": "Brand",
            name: brand,
          },
        }
      : {}),
    offers: hasExactPrice(product.price)
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: product.affiliate_link || url,
        }
      : undefined,
  };

  return <SchemaScript data={schema} />;
}
