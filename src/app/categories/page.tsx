import type { Metadata } from "next";
import CategoryBrandGrid from "@/components/CategoryBrandGrid";
import { getCategories } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Browse by Category – Shoes, Streetwear, Bags & More",
  description:
    "Browse LitBuy finds by category — sneakers, hoodies, jackets, bags, accessories, and electronics with filters and agent links.",
  path: "/categories",
});

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CategoryBrandGrid
        title="Categories"
        subtitle="Browse finds by spreadsheet section."
        items={getCategories()}
      />
    </div>
  );
}
