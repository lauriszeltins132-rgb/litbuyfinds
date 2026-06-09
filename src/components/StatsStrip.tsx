import { getCatalogStats } from "@/lib/products";

export default function StatsStrip() {
  const stats = getCatalogStats();

  const items = [
    { label: "Total finds", value: stats.total.toLocaleString() },
    { label: "With photos", value: stats.withImages.toLocaleString() },
    { label: "Unique links", value: stats.uniqueUrls.toLocaleString() },
    { label: "Categories", value: String(stats.categories) },
  ];

  return (
    <section className="px-4 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="panel-shell rounded-2xl border border-border px-4 py-4 text-center"
          >
            <p className="text-2xl font-black text-accent">{item.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
