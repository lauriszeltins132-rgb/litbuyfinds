import CategoryBrandGrid from "@/components/CategoryBrandGrid";
import { getCategories } from "@/lib/products";

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
