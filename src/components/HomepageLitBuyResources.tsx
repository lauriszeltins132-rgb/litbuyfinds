import Link from "next/link";

const RESOURCES = [
  {
    href: "/best-litbuy-finds-2026",
    label: "Best LitBuy Finds 2026",
    description: "Curated editor picks with QC photos and agent links",
  },
  {
    href: "/best-budget-finds",
    label: "Budget LitBuy Finds",
    description: "Affordable rep picks under $30 from the spreadsheet catalog",
  },
  {
    href: "/litbuy-spreadsheet",
    label: "LitBuy Spreadsheet",
    description:
      "Canonical spreadsheet resource — searchable catalog, categories, QC, agent links",
  },
  {
    href: "/litbuy-qc",
    label: "LitBuy QC Finds Database",
    description: "QC-linked products and quality-check workflow",
  },
  {
    href: "/rep-finds",
    label: "Rep Finds Hub",
    description: "Searchable rep finds database — best, cheap, and designer lanes",
  },
  {
    href: "/litbuy-sneakers",
    label: "Best LitBuy Sneakers",
    description: "Nike, Jordan, Adidas and New Balance picks",
  },
  {
    href: "/litbuy-jackets",
    label: "Best LitBuy Jackets",
    description: "Puffers, shells and streetwear outerwear",
  },
  {
    href: "/best-litbuy-finds",
    label: "Best LitBuy Finds",
    description: "Editor picks from the LitBuy finds database",
  },
  {
    href: "/brands",
    label: "Browse All Brands",
    description: "Nike, Moncler, Chrome Hearts, Stussy and more",
  },
] as const;

export default function HomepageLitBuyResources() {
  return (
    <section className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl font-black">Popular LitBuy Resources</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Guides for LitBuy spreadsheets, QC photos, sneakers, jackets, and marketplace
          buying — built for search and sharing.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-surface/30 p-4 transition hover:border-accent/40 hover:bg-surface/50"
              >
                <span className="font-bold text-foreground group-hover:text-accent">
                  {item.label}
                </span>
                <span className="mt-1 text-sm text-muted">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
