import Link from "next/link";

const SECTIONS = [
  {
    title: "LitBuy community",
    links: [
      { href: "/litbuy-telegram", label: "LitBuy Telegram" },
      { href: "/telegram", label: "Telegram finds hub" },
      { href: "/litbuy-spreadsheet", label: "LitBuy Spreadsheet" },
      { href: "/litbuy-coupons", label: "LitBuy Coupons" },
    ],
  },
  {
    title: "Top collections",
    links: [
      { href: "/collections/best-nike-finds", label: "Best Nike finds" },
      { href: "/collections/best-jordan-finds", label: "Best Jordan finds" },
      { href: "/collections/best-sneakers", label: "Best sneakers" },
      { href: "/collections/best-qc-approved-finds", label: "QC approved" },
      { href: "/collections/trending-this-week", label: "Trending this week" },
      { href: "/collections/best-under-50", label: "Under $50" },
    ],
  },
  {
    title: "Popular brands",
    links: [
      { href: "/brands/nike", label: "Nike" },
      { href: "/brands/jordan", label: "Jordan" },
      { href: "/brands/moncler", label: "Moncler" },
      { href: "/brands/stussy", label: "Stussy" },
      { href: "/brands/chrome-hearts", label: "Chrome Hearts" },
      { href: "/brands/louis-vuitton", label: "Louis Vuitton" },
    ],
  },
  {
    title: "Categories",
    links: [
      { href: "/categories/shoes", label: "Sneakers" },
      { href: "/categories/hoodies", label: "Hoodies" },
      { href: "/categories/coats-and-jackets", label: "Jackets" },
      { href: "/categories/accessories", label: "Accessories" },
      { href: "/categories/tshirts-and-shorts", label: "T-shirts" },
      { href: "/categories/electronics", label: "Electronics" },
    ],
  },
  {
    title: "Guides & fresh finds",
    links: [
      { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
      { href: "/guides/how-to-check-qc-photos", label: "QC photos guide" },
      { href: "/guides/litbuy-spreadsheet", label: "Spreadsheet guide" },
      { href: "/latest", label: "Latest finds" },
      { href: "/trending", label: "Trending" },
      { href: "/guides", label: "All guides" },
    ],
  },
] as const;

export default function HomepageInternalLinks() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-surface/20 p-5 sm:p-6">
        <h2 className="text-lg font-black sm:text-xl">Explore the catalog</h2>
        <p className="mt-1 text-sm text-muted">
          Jump to collections, brands, categories, and guides — all indexable landing pages.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-muted hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
