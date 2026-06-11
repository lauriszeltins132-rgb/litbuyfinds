import { formatDatasetAge } from "@/lib/catalog-meta";
import { getCatalogStats } from "@/lib/products";

export default function StatsStrip() {
  const stats = getCatalogStats();

  const items = [
    { label: "Total finds", value: stats.total.toLocaleString() },
    { label: "Brands", value: stats.brands.toLocaleString() },
    { label: "Categories", value: String(stats.categories) },
    { label: "QC linked", value: stats.withQc.toLocaleString() },
    { label: "With photos", value: stats.withImages.toLocaleString() },
    { label: "Updated", value: formatDatasetAge() },
  ];

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="panel-shell rounded-2xl border border-border px-4 py-4 text-center"
          >
            <p className="text-xl font-black text-accent sm:text-2xl">{item.value}</p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
