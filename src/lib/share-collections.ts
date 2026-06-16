import type { SeoListConfig } from "./top-lists";
import { TOP_LISTS } from "./top-lists";
import { getEditorsPicks } from "./discovery";
import { extractBrand } from "./brands";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts } from "./products";

function priced(items: ReturnType<typeof getAllProducts>) {
  return items.filter((p) => hasExactPrice(p.price));
}

function byBrand(name: string) {
  return priced(
    getAllProducts().filter(
      (p) => extractBrand(p.product_name)?.toLowerCase() === name.toLowerCase()
    )
  );
}

function byCategory(...slugs: string[]) {
  return priced(getAllProducts().filter((p) => slugs.includes(p.category_slug)));
}

function byKeyword(pattern: RegExp) {
  return priced(getAllProducts().filter((p) => pattern.test(p.product_name)));
}

function wrap(
  slug: string,
  config: Omit<SeoListConfig, "slug" | "path">
): SeoListConfig {
  return {
    slug,
    path: `/collections/${slug}`,
    ...config,
  };
}

export const SHARE_COLLECTIONS: Record<string, SeoListConfig> = {
  "best-nike-finds": wrap("best-nike-finds", {
    title: "Best Nike LitBuy Finds 2026",
    metaDescription:
      "Shareable collection of the best Nike LitBuy finds — Dunks, Air Max, Travis Scott and more with QC references and verified links.",
    badge: "Collection",
    h1: "Best Nike LitBuy finds",
    intro:
      "Premium Nike picks from the LitBuy Finds catalog. Ideal for Discord shares, Pinterest boards, and haul planning.",
    getProducts: TOP_LISTS["top-nike-finds"].getProducts,
    relatedLinks: [
      { href: "/top-nike-finds", label: "Top Nike list" },
      { href: "/brands/nike", label: "All Nike" },
      { href: "/guides/litbuy-finds", label: "LitBuy finds guide" },
    ],
    clusterLinks: [
      { href: "/collections/best-sneakers", label: "Best sneakers" },
      { href: "/collections/best-jordan-finds", label: "Jordan finds" },
    ],
  }),
  "best-jordan-finds": wrap("best-jordan-finds", {
    title: "Best Jordan LitBuy Finds 2026",
    metaDescription:
      "Best Jordan finds on LitBuy — retros, collabs, and grails with photos, QC links, and agent buy buttons.",
    badge: "Collection",
    h1: "Best Jordan LitBuy finds",
    intro:
      "Jordan-heavy collection ranked for photos and QC. Share this page when someone asks for Jordan links.",
    getProducts: TOP_LISTS["best-jordan-finds-2026"].getProducts,
    relatedLinks: [
      { href: "/best-jordan-finds-2026", label: "Jordan 2026 list" },
      { href: "/brands/jordan", label: "All Jordan" },
    ],
    clusterLinks: [
      { href: "/collections/best-nike-finds", label: "Nike finds" },
      { href: "/collections/best-sneakers", label: "Sneakers" },
    ],
  }),
  "best-moncler-finds": wrap("best-moncler-finds", {
    title: "Best Moncler LitBuy Finds",
    metaDescription:
      "Moncler jackets and outerwear finds on LitBuy with verified links and QC references.",
    badge: "Collection",
    h1: "Best Moncler LitBuy finds",
    intro:
      "Moncler picks from the catalog — puffers, vests, and outerwear with strong listing photos.",
    getProducts: () =>
      filterFeaturedEligible(byBrand("Moncler")).slice(0, 72),
    relatedLinks: [
      { href: "/guides/best-moncler-finds", label: "Moncler guide" },
      { href: "/collections/best-jackets", label: "Best jackets" },
    ],
    clusterLinks: [
      { href: "/collections/best-qc-approved-finds", label: "QC finds" },
    ],
  }),
  "best-budget-finds": wrap("best-budget-finds", {
    title: "Best Budget LitBuy Finds Under $30",
    metaDescription:
      "Affordable LitBuy finds under $30 — budget sneakers, tees, and accessories worth sharing.",
    badge: "Collection",
    h1: "Best budget LitBuy finds",
    intro:
      "Low-risk haul fillers and starter picks. Confirm live LitBuy price before checkout.",
    getProducts: TOP_LISTS["top-budget-finds"].getProducts,
    relatedLinks: [
      { href: "/top-budget-finds", label: "Top budget list" },
      { href: "/deals", label: "Deals page" },
    ],
    clusterLinks: [
      { href: "/guides/litbuy-spreadsheet", label: "Spreadsheet guide" },
    ],
  }),
  "best-qc-approved-finds": wrap("best-qc-approved-finds", {
    title: "Best QC Approved LitBuy Finds",
    metaDescription:
      "QC-approved LitBuy finds with warehouse photo references — sneakers, jackets, bags, and more.",
    badge: "Collection",
    h1: "Best QC approved finds",
    intro:
      "Listings with QC references attached. Use these when you want extra confidence before buying.",
    getProducts: TOP_LISTS["best-qc-approved-finds"].getProducts,
    relatedLinks: [
      { href: "/best-qc-approved-finds", label: "QC list page" },
      { href: "/guides/litbuy-qc-photos", label: "QC guide" },
    ],
    clusterLinks: [
      { href: "/collections/best-nike-finds", label: "Nike finds" },
    ],
  }),
  "best-jackets": wrap("best-jackets", {
    title: "Best Jacket Finds on LitBuy",
    metaDescription:
      "Best jacket and outerwear finds — Moncler, Arc'teryx, Stone Island, puffers, and shells.",
    badge: "Collection",
    h1: "Best jacket finds",
    intro:
      "Outerwear-focused collection from coats and jackets categories plus premium brand picks.",
    getProducts: () =>
      filterFeaturedEligible(
        byCategory("coats-and-jackets")
      ).slice(0, 72),
    relatedLinks: [
      { href: "/categories/coats-and-jackets", label: "Jackets category" },
      { href: "/collections/best-moncler-finds", label: "Moncler finds" },
    ],
    clusterLinks: [
      { href: "/collections/best-qc-approved-finds", label: "QC finds" },
    ],
  }),
  "best-bags": wrap("best-bags", {
    title: "Best Bag Finds on LitBuy",
    metaDescription:
      "Designer and streetwear bag finds — Louis Vuitton, Gucci, Goyard, and more on LitBuy.",
    badge: "Collection",
    h1: "Best bag finds",
    intro:
      "Handbags, crossbody, and backpack picks with photos and verified LitBuy links.",
    getProducts: TOP_LISTS["top-designer-bags"].getProducts,
    relatedLinks: [
      { href: "/top-designer-bags", label: "Designer bags list" },
      { href: "/best-bag-brands-on-litbuy", label: "Bag brands" },
    ],
    clusterLinks: [
      { href: "/collections/best-budget-finds", label: "Budget finds" },
    ],
  }),
  "best-sneakers": wrap("best-sneakers", {
    title: "Best Sneaker Finds on LitBuy 2026",
    metaDescription:
      "Best sneaker finds on LitBuy — Nike, Jordan, Adidas, New Balance with QC and verified links.",
    badge: "Collection",
    h1: "Best sneaker finds",
    intro:
      "Sneaker-heavy shareable collection for TikTok bios, Discord, and Reddit threads.",
    getProducts: TOP_LISTS["top-rep-sneakers"].getProducts,
    relatedLinks: [
      { href: "/top-rep-sneakers", label: "Top sneakers list" },
      { href: "/categories/shoes", label: "Shoes category" },
    ],
    clusterLinks: [
      { href: "/collections/best-nike-finds", label: "Nike" },
      { href: "/collections/best-jordan-finds", label: "Jordan" },
    ],
  }),
  "best-litbuy-finds-2026": wrap("best-litbuy-finds-2026", {
    title: "Best LitBuy Finds 2026",
    metaDescription:
      "The best LitBuy finds in 2026 — editor picks, QC-approved products, and trending sneakers and fashion.",
    badge: "Collection",
    h1: "Best LitBuy finds 2026",
    intro:
      "A shareable snapshot of standout catalog picks for 2026. Updated with daily catalog sync.",
    getProducts: () => getEditorsPicks(96),
    relatedLinks: [
      { href: "/top-litbuy-finds-this-month", label: "This month" },
      { href: "/most-popular-finds-now", label: "Popular today" },
      { href: "/guides/litbuy-finds", label: "LitBuy finds guide" },
    ],
    clusterLinks: [
      { href: "/collections/best-qc-approved-finds", label: "QC finds" },
    ],
  }),
  "litbuy-spreadsheet-alternative": wrap("litbuy-spreadsheet-alternative", {
    title: "Best LitBuy Spreadsheet Alternative",
    metaDescription:
      "LitBuy Finds is a searchable alternative to raw LitBuy spreadsheets — browse 10,000+ finds with photos, filters, and QC links.",
    badge: "Collection",
    h1: "LitBuy spreadsheet alternative",
    intro:
      "Skip endless rows. Search by brand, open product pages with QC badges, and share collection links instead of fragile sheet URLs.",
    getProducts: () => getEditorsPicks(72),
    relatedLinks: [
      { href: "/guides/litbuy-spreadsheet", label: "Spreadsheet guide" },
      { href: "/guides/litbuy-finds", label: "LitBuy finds guide" },
    ],
    clusterLinks: [
      { href: "/collections/best-litbuy-finds-2026", label: "Best finds 2026" },
    ],
  }),
};

export const SHARE_COLLECTION_SLUGS = Object.keys(SHARE_COLLECTIONS);

export function getShareCollection(slug: string): SeoListConfig | undefined {
  return SHARE_COLLECTIONS[slug];
}
