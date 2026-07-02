import Link from "next/link";
import SchemaScript from "@/components/SchemaScript";
import { buildBreadcrumbSchema } from "@/lib/schema";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  currentPath?: string;
  compact?: boolean;
};

export default function Breadcrumbs({ items, currentPath, compact = false }: BreadcrumbsProps) {
  return (
    <>
      <SchemaScript data={buildBreadcrumbSchema(items, currentPath)} />
    <nav
      aria-label="Breadcrumb"
      className={compact ? "px-4 pt-2 sm:px-6" : "px-4 pt-6 sm:px-6"}
    >
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-border-strong">/</span>}
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-semibold text-foreground" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
    </>
  );
}
