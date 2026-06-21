export type Product = {
  id: string;
  product_name: string;
  category: string;
  category_slug: string;
  sheet: string;
  group: "featured" | "category";
  price: number | null;
  affiliate_link: string;
  /** Original marketplace URL when the source feed provides it. */
  source_url?: string;
  qc_link: string;
  image: string;
};

export type CategoryInfo = {
  name: string;
  slug: string;
  count: number;
  href: string;
  group: "featured" | "category";
};
