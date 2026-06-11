import Link from "next/link";

const EXPLORE_LINKS = [
  {
    title: "Browse Finds",
    description: "Search and filter the full catalog",
    href: "/#browse",
  },
  {
    title: "Recently Added",
    description: "Fresh drops from the latest sheet",
    href: "/recently-added",
  },
  {
    title: "Brands",
    description: "Nike, Jordan, Gucci, and more",
    href: "/brands",
  },
  {
    title: "Categories",
    description: "Shoes, streetwear, bags, accessories",
    href: "/categories",
  },
  {
    title: "Guides",
    description: "Agents, QC photos, and ordering help",
    href: "/guides",
  },
  {
    title: "How to Buy",
    description: "Step-by-step LitBuy ordering guide",
    href: "/guides/how-to-order-from-litbuy",
  },
] as const;

export default function HomepageExploreNav() {
  return (
    <nav
      aria-label="Explore LitBuy Finds"
      className="px-4 pb-2 sm:px-6"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="sr-only">Explore LitBuy Finds</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface/35 p-4 transition hover:border-accent/30 hover:bg-surface/50"
              >
                <span className="font-black text-foreground group-hover:text-accent">
                  {item.title}
                </span>
                <span className="mt-1 text-sm text-muted">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-sm text-muted">
          New to agents?{" "}
          <Link
            href="/guides/what-are-qc-photos"
            className="font-bold text-accent hover:underline"
          >
            Learn about QC photos
          </Link>
        </p>
      </div>
    </nav>
  );
}
