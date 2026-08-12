import type { SeoListConfig } from "./top-lists";
import { TOP_LISTS } from "./top-lists";
import { COLLECTION_SEO_BODIES } from "./collection-seo-bodies";
import { getEditorsPicks } from "./discovery";
import { getEngagementPicks } from "./engagement-picks";
import { extractBrand } from "./brands";
import { getCollectionFaqs } from "./collection-faqs";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts, getTrendingProducts } from "./products";

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

function byMaxPrice(max: number) {
  return priced(getAllProducts().filter((p) => p.price !== null && p.price <= max));
}

function wrap(
  slug: string,
  config: Omit<SeoListConfig, "slug" | "path" | "faqs"> & {
    faqs?: SeoListConfig["faqs"];
  }
): SeoListConfig {
  return {
    slug,
    path: `/collections/${slug}`,
    ...config,
    seoBody: config.seoBody ?? COLLECTION_SEO_BODIES[slug]?.join("\n\n"),
    faqs: config.faqs ?? getCollectionFaqs(slug, config.h1),
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
    title: "Best LitBuy Finds 2026 | QC Photos & Spreadsheet Picks",
    metaDescription:
      "The best LitBuy finds in 2026 — editor picks, QC-approved products, and trending sneakers and fashion from the spreadsheet catalog.",
    badge: "Collection",
    h1: "Best LitBuy finds 2026",
    intro:
      "A shareable snapshot of standout LitBuy rep finds for 2026 — curated from the spreadsheet catalog with QC references, trusted agent links, and daily sync updates.",
    getProducts: () => getEditorsPicks(96),
    relatedLinks: [
      { href: "/best-litbuy-finds-2026", label: "Best finds landing page" },
      { href: "/best-budget-finds", label: "Budget finds" },
      { href: "/top-litbuy-finds-this-month", label: "This month" },
      { href: "/most-popular-finds-now", label: "Popular today" },
      { href: "/guides/litbuy-finds", label: "LitBuy finds guide" },
    ],
    clusterLinks: [
      { href: "/categories/shoes", label: "Sneakers" },
      { href: "/categories/hoodies", label: "Hoodies" },
      { href: "/categories/accessories", label: "Accessories" },
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

  "best-stussy-finds": wrap("best-stussy-finds", {
    title: "Best Stussy LitBuy Finds",
    metaDescription:
      "Best Stussy finds on LitBuy — hoodies, tees, and streetwear staples with verified links and QC references.",
    badge: "Collection",
    h1: "Best Stussy LitBuy finds",
    intro:
      "Stüssy picks from the catalog — logo hoodies, graphic tees, and streetwear layers ranked for photos and QC.",
    getProducts: () => filterFeaturedEligible(byBrand("Stussy")).slice(0, 72),
    relatedLinks: [
      { href: "/brands/stussy", label: "All Stussy" },
      { href: "/collections/best-hoodies", label: "Best hoodies" },
    ],
    clusterLinks: [
      { href: "/collections/best-corteiz-finds", label: "Corteiz finds" },
    ],
  }),

  "best-corteiz-finds": wrap("best-corteiz-finds", {
    title: "Best Corteiz LitBuy Finds",
    metaDescription:
      "Best Corteiz finds on LitBuy — Alcatraz hoodies, cargos, and UK streetwear with verified agent links.",
    badge: "Collection",
    h1: "Best Corteiz LitBuy finds",
    intro:
      "Corteiz-heavy collection for haul planning and social shares — hoodies, cargos, and graphic pieces.",
    getProducts: () => filterFeaturedEligible(byBrand("Corteiz")).slice(0, 72),
    relatedLinks: [
      { href: "/brands/corteiz", label: "All Corteiz" },
      { href: "/collections/best-hoodies", label: "Best hoodies" },
    ],
    clusterLinks: [
      { href: "/collections/best-stussy-finds", label: "Stussy finds" },
    ],
  }),

  "best-hoodies": wrap("best-hoodies", {
    title: "Best Hoodie Finds on LitBuy",
    metaDescription:
      "Best hoodie finds on LitBuy — Stussy, Corteiz, Nike tech fleece, Supreme, and streetwear layers.",
    badge: "Collection",
    h1: "Best hoodie finds",
    intro:
      "Hoodie and sweatshirt picks from across the catalog — filter by brand on product pages before you buy.",
    getProducts: () =>
      filterFeaturedEligible(
        byCategory("hoodies-and-pants").filter((p) =>
          /hoodie|sweatshirt|crewneck/i.test(p.product_name)
        )
      ).slice(0, 72),
    relatedLinks: [
      { href: "/categories/hoodies", label: "Hoodies category" },
      { href: "/best-hoodies", label: "Best hoodies list" },
    ],
    clusterLinks: [
      { href: "/collections/best-stussy-finds", label: "Stussy" },
      { href: "/collections/best-corteiz-finds", label: "Corteiz" },
    ],
  }),

  "best-accessories": wrap("best-accessories", {
    title: "Best Accessory Finds on LitBuy",
    metaDescription:
      "Best accessory finds — hats, belts, jewelry, eyewear, and streetwear add-ons with LitBuy links.",
    badge: "Collection",
    h1: "Best accessory finds",
    intro:
      "Small details that complete a fit — accessories ranked for photos, QC, and verified buy links.",
    getProducts: () => filterFeaturedEligible(byCategory("accessories")).slice(0, 72),
    relatedLinks: [
      { href: "/categories/accessories", label: "Accessories category" },
      { href: "/best-accessories", label: "Best accessories list" },
    ],
    clusterLinks: [{ href: "/collections/best-bags", label: "Best bags" }],
  }),

  "best-under-20": wrap("best-under-20", {
    title: "Best LitBuy Finds Under $20",
    metaDescription:
      "Best LitBuy finds under $20 — budget tees, accessories, and low-risk haul fillers.",
    badge: "Collection",
    h1: "Best finds under $20",
    intro: "Lowest-risk picks under $20 — ideal for first hauls or filling shipping weight.",
    getProducts: TOP_LISTS["top-products-under-20"].getProducts,
    relatedLinks: [
      { href: "/best-under-20", label: "Under $20 list" },
      { href: "/collections/best-under-30", label: "Under $30" },
    ],
    clusterLinks: [{ href: "/collections/best-budget-finds", label: "Budget finds" }],
  }),

  "best-under-30": wrap("best-under-30", {
    title: "Best LitBuy Finds Under $30",
    metaDescription:
      "Best LitBuy finds under $30 — affordable sneakers, tees, and accessories worth sharing.",
    badge: "Collection",
    h1: "Best finds under $30",
    intro: "Budget-friendly rotation pieces under $30 with verified LitBuy links.",
    getProducts: TOP_LISTS["top-budget-finds"].getProducts,
    relatedLinks: [
      { href: "/best-under-30", label: "Under $30 list" },
      { href: "/collections/best-under-50", label: "Under $50" },
    ],
    clusterLinks: [{ href: "/collections/best-under-20", label: "Under $20" }],
  }),

  "best-under-50": wrap("best-under-50", {
    title: "Best LitBuy Finds Under $50",
    metaDescription:
      "Best LitBuy finds under $50 — sneakers, hoodies, and streetwear with QC references.",
    badge: "Collection",
    h1: "Best finds under $50",
    intro: "Mid-budget picks under $50 — strong value for haul building and first-time buyers.",
    getProducts: TOP_LISTS["top-products-under-50"].getProducts,
    relatedLinks: [
      { href: "/best-under-50", label: "Under $50 list" },
      { href: "/collections/best-under-100", label: "Under $100" },
    ],
    clusterLinks: [{ href: "/collections/best-sneakers", label: "Best sneakers" }],
  }),

  "best-under-100": wrap("best-under-100", {
    title: "Best LitBuy Finds Under $100",
    metaDescription:
      "Best LitBuy finds under $100 — sneakers, jackets, bags, and designer picks.",
    badge: "Collection",
    h1: "Best finds under $100",
    intro: "Mid-range haul picks under $100 with photos, QC links, and verified agent checkout.",
    getProducts: TOP_LISTS["top-products-under-100"].getProducts,
    relatedLinks: [
      { href: "/best-under-100", label: "Under $100 list" },
      { href: "/collections/best-under-50", label: "Under $50" },
    ],
    clusterLinks: [{ href: "/collections/best-jackets", label: "Best jackets" }],
  }),

  "top-qc-finds": wrap("top-qc-finds", {
    title: "Top QC Finds on LitBuy",
    metaDescription:
      "Top QC finds on LitBuy — products with quality control reference photos for sneakers, jackets, and bags.",
    badge: "Collection",
    h1: "Top QC finds",
    intro:
      "The strongest QC-documented listings in the catalog — compare batches before you order.",
    getProducts: TOP_LISTS["best-qc-approved-finds"].getProducts,
    relatedLinks: [
      { href: "/top-qc-finds", label: "Top QC page" },
      { href: "/guides/how-to-check-qc-photos", label: "QC guide" },
    ],
    clusterLinks: [
      { href: "/collections/best-qc-approved-finds", label: "QC approved" },
      { href: "/collections/best-sneakers", label: "Sneakers" },
    ],
  }),

  "trending-this-week": wrap("trending-this-week", {
    title: "Trending LitBuy Finds This Week",
    metaDescription:
      "Trending LitBuy finds this week — hottest sneakers, jackets, and streetwear with verified links.",
    badge: "Collection",
    h1: "Trending this week",
    intro:
      "What is gaining momentum right now — ranked from trending imports and engagement signals.",
    getProducts: () => filterFeaturedEligible(priced(getTrendingProducts())).slice(0, 72),
    relatedLinks: [
      { href: "/trending", label: "Trending page" },
      { href: "/best-finds-this-week", label: "Best this week" },
    ],
    clusterLinks: [
      { href: "/collections/best-litbuy-finds-2026", label: "Best 2026" },
    ],
  }),

  "most-saved-finds": wrap("most-saved-finds", {
    title: "Most Saved LitBuy Finds",
    metaDescription:
      "Most saved and clicked LitBuy finds — community favorites with verified buy links.",
    badge: "Collection",
    h1: "Most saved finds",
    intro:
      "High-engagement picks from visitor clicks and saves — useful when you want what others are bookmarking.",
    getProducts: () => getEngagementPicks(72),
    relatedLinks: [
      { href: "/most-popular-finds-now", label: "Popular today" },
      { href: "/collections/trending-this-week", label: "Trending week" },
      { href: "/litbuy-coupons", label: "LitBuy coupons" },
    ],
    clusterLinks: [
      { href: "/collections/best-nike-finds", label: "Nike finds" },
    ],
  }),
};

export const SHARE_COLLECTION_SLUGS = Object.keys(SHARE_COLLECTIONS);

export function getShareCollection(slug: string): SeoListConfig | undefined {
  return SHARE_COLLECTIONS[slug];
}
