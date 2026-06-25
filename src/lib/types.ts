export type ProductBadgeKind =
  | "trending"
  | "editors-pick"
  | "best-value"
  | "budget-pick"
  | "top-quality"
  | "new"
  | "popular"
  | "qc";

export type Product = {
  id: string;
  product_name: string;
  category: string;
  category_slug: string;
  sheet: string;
  group: "featured" | "category";
  price: number | null;
  affiliate_link: string;
  qc_link: string;
  image: string;
  /** Optional catalog overrides — not required for display */
  manual_badges?: ProductBadgeKind[];
  rn_score_override?: number;
};

export type CategoryInfo = {
  name: string;
  slug: string;
  count: number;
  href: string;
  group: "featured" | "category";
};
