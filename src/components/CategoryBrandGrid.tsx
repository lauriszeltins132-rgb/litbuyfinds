import Link from "next/link";
import type { CategoryInfo } from "@/lib/types";

type CategoryBrandGridProps = {
  title: string;
  subtitle: string;
  items: CategoryInfo[];
};

export default function CategoryBrandGrid({
  title,
  subtitle,
  items,
}: CategoryBrandGridProps) {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-muted">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="panel-shell group flex items-center justify-between rounded-[24px] border border-border bg-panel p-5 transition-all hover:border-accent/30"
            >
              <div>
                <h2 className="text-lg font-bold text-foreground transition-colors group-hover:text-accent">
                  {item.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {item.count.toLocaleString()}{" "}
                  {item.count === 1 ? "find" : "finds"}
                </p>
              </div>
              <span className="text-accent">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
