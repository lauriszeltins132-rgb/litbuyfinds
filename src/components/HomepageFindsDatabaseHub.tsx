import { getFindsAuthorityStats } from "@/lib/finds-authority";

export default function HomepageFindsDatabaseHub() {
  const stats = getFindsAuthorityStats();

  const hubs = [
  { href: "/latest-finds", label: "Latest finds", detail: "Weekly updated rep products" },
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet", detail: "Canonical spreadsheet database" },
  { href: "/litbuy-finds", label: "LitBuy finds", detail: "Branded product catalog" },
  { href: "/rep-finds", label: "Rep finds", detail: "Rep finds discovery hub" },
  { href: "/best-litbuy-finds", label: "Best LitBuy finds", detail: "Editor-ranked picks" },
  { href: "/best-budget-finds", label: "Budget finds", detail: "Affordable picks under $30" },
  { href: "/sneaker-finds", label: "Sneaker finds", detail: "Nike, Jordan, Adidas & more" },
  { href: "/clothing-finds", label: "Clothing finds", detail: "Hoodies, jackets, streetwear" },
  { href: "/streetwear-finds", label: "Streetwear finds", detail: "Stussy, Corteiz, hype layers" },
  { href: "/hoodie-finds", label: "Hoodie finds", detail: "Streetwear hoodies & crews" },
  { href: "/jacket-finds", label: "Jacket finds", detail: "Puffers, Moncler, outerwear" },
  { href: "/best-rep-finds", label: "Best rep finds", detail: "Editor-ranked QC picks" },
  { href: "/litbuy-qc", label: "QC finds database", detail: `${stats.qcFindsLabel} QC-linked finds` },
  { href: "/brands", label: "Brand finds", detail: `${stats.brandCount} brand hubs` },
  { href: "/categories", label: "Categories", detail: `${stats.categoryCount} product lanes` },
  { href: "/finds", label: "Finds hub", detail: "Full catalog search" },
] as const;

  return (
    <section className="px-4 py-5 sm:px-6 sm:py-7" aria-labelledby="finds-database-heading">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            LitBuy product discovery database
          </p>
          <h2
            id="finds-database-heading"
            className="mt-1 text-xl font-black leading-tight tracking-tight sm:text-2xl"
          >
            LitBuy Finds — rep products, QC photos & spreadsheet discovery
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            LitBuyFinds is a product discovery platform featuring {stats.totalFindsLabel} indexed
            finds with {stats.qcFindsLabel} QC-linked listings, spreadsheet-style browsing, verified
            agent links, and daily catalog updates. Search sneakers, clothing, streetwear, and brand
            finds — not just coupons or community links.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          <div className="rounded-xl border border-border/70 bg-surface/20 px-3 py-2.5">
            <p className="text-lg font-black text-foreground">{stats.totalFindsLabel}</p>
            <p className="text-[11px] font-semibold text-muted">Indexed finds</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface/20 px-3 py-2.5">
            <p className="text-lg font-black text-accent">{stats.qcFindsLabel}</p>
            <p className="text-[11px] font-semibold text-muted">QC-linked listings</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface/20 px-3 py-2.5">
            <p className="text-lg font-black text-foreground">{stats.brandCount}</p>
            <p className="text-[11px] font-semibold text-muted">Brand hubs</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface/20 px-3 py-2.5">
            <p className="text-lg font-black text-foreground">{stats.categoryCount}</p>
            <p className="text-[11px] font-semibold text-muted">Categories</p>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((hub) => (
            <a
              key={hub.href}
              href={hub.href}
              className="group flex flex-col rounded-xl border border-border/70 bg-white px-3.5 py-3 transition hover:border-accent/35 hover:shadow-sm"
            >
              <span className="text-sm font-bold text-foreground group-hover:text-accent">
                {hub.label} →
              </span>
              <span className="mt-0.5 text-xs text-muted">{hub.detail}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
