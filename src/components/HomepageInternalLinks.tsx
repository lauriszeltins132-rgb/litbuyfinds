import SmartLink from "@/components/SmartLink";
import { FINDS_DATABASE_HUB_LINKS } from "@/lib/finds-authority";
import { AGENTS_HUB_PATH } from "@/lib/agent-resource-agents";
import { AGENT_RESOURCE_LINKS } from "@/lib/seo-internal-links";

const SECTIONS = [
  {
    title: "Finds database",
    links: FINDS_DATABASE_HUB_LINKS.map((link) => ({
      href: link.href,
      label: link.label,
    })),
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
    title: "Shopping agents",
    links: [
      { href: AGENTS_HUB_PATH, label: "Compare shopping agents" },
      { href: "/rep-agent-spreadsheets", label: "Agent spreadsheets hub" },
      { href: "/telegram", label: "Telegram finds hub" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      ...AGENT_RESOURCE_LINKS.slice(0, 12).map((link) => ({
        href: link.href,
        label: link.label,
      })),
    ],
  },
  {
    title: "LitBuy authority",
    links: [
      { href: "/finds", label: "Finds hub" },
      { href: "/what-is-litbuy", label: "What is LitBuy" },
      { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
      { href: "/litbuy-discord", label: "LitBuy Discord" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
      { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
      { href: "/ai", label: "LitBuy AI" },
      { href: "/is-litbuy-legit", label: "Is LitBuy legit" },
      { href: "/sneaker-finds", label: "Sneaker finds" },
      { href: "/clothing-finds", label: "Clothing finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/best-rep-finds", label: "Rep finds" },
    ],
  },
  {
    title: "Guides & authority",
    links: [
      { href: "/guides", label: "Guides hub" },
      { href: "/how-to-use-litbuy", label: "How to use LitBuy" },
      { href: "/how-to-buy-reps", label: "How to buy reps" },
      { href: "/what-are-qc-photos", label: "What are QC photos" },
      { href: "/how-to-save-on-shipping", label: "Save on shipping" },
      { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
      { href: "/litbuy-qc-photos", label: "LitBuy QC photos" },
      { href: "/litbuy-spreadsheet", label: "Spreadsheet guide" },
    ],
  },
  {
    title: "Best finds",
    links: [
      { href: "/finds", label: "Finds hub" },
      { href: "/best-sneaker-finds", label: "Best sneaker finds" },
      { href: "/best-clothing-finds", label: "Best clothing finds" },
      { href: "/best-designer-finds", label: "Best designer finds" },
      { href: "/latest-finds", label: "Latest finds" },
      { href: "/trending", label: "Trending" },
      { href: "/nike-finds", label: "Nike finds" },
      { href: "/moncler-finds", label: "Moncler finds" },
    ],
  },
] as const;

export default function HomepageInternalLinks() {
  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-surface/20 p-5 sm:p-6">
        <h2 className="text-lg font-black sm:text-xl">Explore the LitBuy finds database</h2>
        <p className="mt-1 text-sm text-muted">
          Product discovery hubs, category databases, spreadsheet resources, and brand pages — all crawlable and linked from the homepage.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <SmartLink
                      href={link.href}
                      className="text-sm font-semibold text-muted hover:text-accent"
                    >
                      {link.label}
                    </SmartLink>
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
