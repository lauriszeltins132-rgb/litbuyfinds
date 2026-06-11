import type { CategoryInfo, Product } from "./types";
import productsData from "@/data/products.json";
import { auditCatalogPrices } from "./pricing";
import { validateImageUrl } from "./image-url";

function normalizeProduct(product: Product): Product {
  const validation = validateImageUrl(product.image);
  return {
    ...product,
    image: validation.valid ? validation.normalized : "",
  };
}

const products = (productsData as Product[]).map(normalizeProduct);

export function sortWithImagesFirst(items: Product[]): Product[] {
  return [...items].sort((a, b) => {
    const aScore = (a.image ? 2 : 0) + (a.qc_link ? 1 : 0);
    const bScore = (b.image ? 2 : 0) + (b.qc_link ? 1 : 0);
    return bScore - aScore;
  });
}

export function getAllProducts(): Product[] {
  return sortWithImagesFirst(products);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getTrendingProducts(): Product[] {
  return sortWithImagesFirst(
    products.filter((product) => product.category_slug === "trending-now")
  );
}

export function getLatestProducts(): Product[] {
  return sortWithImagesFirst(
    products.filter((product) => product.category_slug === "latest-finds")
  );
}

export function getDealProducts(maxPrice = 30): Product[] {
  return sortWithImagesFirst(
    products.filter(
      (product) => product.price !== null && product.price <= maxPrice
    )
  );
}

export function getQcProducts(): Product[] {
  return sortWithImagesFirst(
    products.filter((product) => product.qc_link && product.qc_link.length > 0)
  );
}

export function getProductsByCategorySlug(slug: string): Product[] {
  return sortWithImagesFirst(
    products.filter((product) => product.category_slug === slug)
  );
}

export function getCatalogStats() {
  const withImages = products.filter((p) => p.image).length;
  const withQc = products.filter((p) => p.qc_link).length;
  const uniqueUrls = new Set(products.map((p) => p.affiliate_link)).size;

  const priceAudit = auditCatalogPrices(products);

  return {
    total: products.length,
    withImages,
    withQc,
    uniqueUrls,
    categories: getCategories().filter((c) => c.group === "category").length,
    prices: {
      exact: priceAudit.exact,
      unavailable: priceAudit.unavailable,
      checkLatest: priceAudit.checkLatest,
      nullInSource: priceAudit.nullInSource,
    },
  };
}

export function getCategories(): CategoryInfo[] {
  const map = new Map<string, CategoryInfo>();

  for (const product of products) {
    const existing = map.get(product.category_slug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(product.category_slug, {
        name: product.category,
        slug: product.category_slug,
        count: 1,
        href:
          product.group === "featured"
            ? product.category_slug === "trending-now"
              ? "/trending"
              : "/latest"
            : `/categories/${product.category_slug}`,
        group: product.group,
      });
    }
  }

  const categoryOrder = [
    "trending-now",
    "latest-finds",
    "shoes",
    "hoodies-and-pants",
    "coats-and-jackets",
    "tshirts-and-shorts",
    "accessories",
    "electronics",
  ];

  return categoryOrder
    .filter((slug) => map.has(slug))
    .map((slug) => map.get(slug)!);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return getCategories().find((category) => category.slug === slug);
}

export { products };
