import collaborationData from "@/data/sellers-collaboration.json";
import { validateImageUrl } from "@/lib/image-url";
import { isDeadImageUrl } from "@/lib/dead-images";
import type { Product } from "@/lib/types";

export type SellersCollaborationEntry = {
  weidianId: string;
  sourceUrl: string;
  product_name: string;
  price_cny: number | null;
  price: number | null;
  image: string;
  qc_link: string;
};

type SellersCollaborationConfig = {
  title: string;
  subtitle: string;
  updatedAt: string;
  products: SellersCollaborationEntry[];
};

const config = collaborationData as SellersCollaborationConfig;

/** Stable product ids — weidian item ids, outside the numeric catalog range. */
function toProductId(weidianId: string): string {
  return weidianId;
}

function toAffiliateLink(weidianId: string): string {
  return `https://litbuy.com/product/weidian/${weidianId}?inviteCode=SMKS`;
}

function normalizeImage(raw: string): string {
  const validation = validateImageUrl(raw);
  if (!validation.valid || !validation.normalized) return "";
  if (isDeadImageUrl(validation.normalized)) return "";
  return validation.normalized;
}

function entryToProduct(entry: SellersCollaborationEntry): Product {
  return {
    id: toProductId(entry.weidianId),
    product_name: entry.product_name,
    // Reuse an existing featured lane so PDP breadcrumbs stay on live routes
    // without adding SEO category/collection pages for this rail.
    category: "Latest Finds",
    category_slug: "latest-finds",
    sheet: "Other Sellers Collaboration Link",
    group: "featured",
    price: entry.price,
    affiliate_link: toAffiliateLink(entry.weidianId),
    qc_link: entry.qc_link || "",
    image: normalizeImage(entry.image),
  };
}

const collaborationProducts: Product[] = config.products
  .map(entryToProduct)
  .filter((product) => Boolean(product.image));

const productsById = new Map(
  collaborationProducts.map((product) => [product.id, product])
);

export function getSellersCollaborationMeta(): {
  title: string;
  subtitle: string;
  updatedAt: string;
} {
  return {
    title: config.title,
    subtitle: config.subtitle,
    updatedAt: config.updatedAt,
  };
}

/** Homepage rail products — static JSON only, no runtime API calls. */
export function getSellersCollaborationProducts(): Product[] {
  return collaborationProducts;
}

export function getSellersCollaborationProductById(
  id: string
): Product | undefined {
  return productsById.get(id);
}
