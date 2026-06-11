import Link from "next/link";
import type { CategoryInfo } from "@/lib/types";

type HomepageCategoriesProps = {
  categories: CategoryInfo[];
};

export default function HomepageCategories({ categories }: HomepageCategoriesProps) {
  const items = categories.filter((category) => category.group === "category");

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Shop by Category</h2>
            <p className="mt-1 text-sm text-muted">
              Sneakers, streetwear, bags, and more — jump straight in.
            </p>
          </div>
          <Link href="/categories" className="text-sm font-bold text-accent hover:underline">
            All categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((category) => (
            <Link
              key={category.slug}
              href={category.href}
              className="panel-shell rounded-2xl border border-border p-4 transition hover:border-accent/35"
            >
              <p className="font-bold text-foreground">{category.name}</p>
              <p className="mt-1 text-xs text-muted">
                {category.count.toLocaleString()} finds
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
