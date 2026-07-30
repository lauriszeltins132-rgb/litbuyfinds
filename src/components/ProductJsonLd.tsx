import type { Product } from "@/lib/types";
import { hasExactPrice } from "@/lib/pricing";
import { SITE_URL } from "@/lib/site";
import {
  getDisplayBrand,
  getDisplayProductName,
} from "@/lib/product-validation";
import { getProductSeoDescription } from "@/lib/product-details";
import SchemaScript from "@/components/SchemaScript";

type ProductJsonLdProps = {
  product: Product;
  slug: string;
};

export default function ProductJsonLd({ product, slug }: ProductJsonLdProps) {
  const brand = getDisplayBrand(product);
  const displayName = getDisplayProductName(product);
  const url = `${SITE_URL}/find/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: brand ? `${brand} ${displayName}` : displayName,
    description: getProductSeoDescription(product),
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
