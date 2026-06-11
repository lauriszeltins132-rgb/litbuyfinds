import { extractBrand, getBrandsFromProducts } from "./brands";
import { filterFeaturedEligible } from "./product-media";
import { hasExactPrice } from "./pricing";
import { getAllProducts, getTrendingProducts } from "./products";
import type { Product } from "./types";
import type { SeoListConfig } from "./top-lists";

function priced(items: Product[]): Product[] {
  return items.filter((p) => hasExactPrice(p.price));
}

export type ComparisonConfig = SeoListConfig & {
  compareGroups?: { label: string; products: Product[] }[];
};

export const COMPARISON_PAGES: Record<string, ComparisonConfig> = {
  "nike-vs-adidas-finds": {
    slug: "nike-vs-adidas-finds",
    path: "/nike-vs-adidas-finds",
    title: "Nike vs Adidas Finds on LitBuy",
    metaDescription:
      "Compare Nike and Adidas finds on LitBuy Finds — side-by-side picks, pricing, and links to full brand catalogs.",
    badge: "Comparison",
    h1: "Nike vs Adidas finds",
    intro:
      "Two of the biggest sneaker brands in the catalog, compared. Browse highlights from each, then dive into the full brand pages for more options.",
    getProducts: () => [],
    compareGroups: [
      {
        label: "Nike picks",
        products: filterFeaturedEligible(
          priced(
            getAllProducts().filter(
              (p) => extractBrand(p.product_name)?.toLowerCase() === "nike"
            )
          )
        ).slice(0, 24),
      },
      {
        label: "Adidas picks",
        products: filterFeaturedEligible(
          priced(
            getAllProducts().filter(
              (p) => extractBrand(p.product_name)?.toLowerCase() === "adidas"
            )
          )
        ).slice(0, 24),
      },
    ],
    relatedLinks: [
      { href: "/top-nike-finds", label: "Top Nike" },
      { href: "/brands/adidas", label: "All Adidas" },
      { href: "/top-rep-sneakers", label: "Top sneakers" },
    ],
    clusterLinks: [
      { href: "/guides/how-to-use-litbuy-finds", label: "How to use LitBuy Finds" },
      { href: "/trending", label: "Trending" },
    ],
  },
  "best-bag-brands-on-litbuy": {
    slug: "best-bag-brands-on-litbuy",
    path: "/best-bag-brands-on-litbuy",
    title: "Best Bag Brands on LitBuy",
    metaDescription:
      "Compare the best bag brands on LitBuy — Louis Vuitton, Gucci, Goyard, Dior and more with catalog links.",
    badge: "Comparison",
    h1: "Best bag brands on LitBuy",
    intro:
      "Bag-heavy brands ranked by catalog depth. Use this page to pick a label, then browse that brand's full collection.",
    getProducts: () =>
      filterFeaturedEligible(
        priced(
          getAllProducts().filter((p) =>
            /bag|crossbody|keepall|neverfull|birkin|tote|backpack/i.test(
              p.product_name
            )
          )
        )
      ).slice(0, 48),
    relatedLinks: [
      { href: "/top-designer-bags", label: "Top designer bags" },
      { href: "/top-louis-vuitton-finds", label: "Louis Vuitton" },
      { href: "/top-gucci-finds", label: "Gucci" },
    ],
    clusterLinks: [
      { href: "/brands/goyard", label: "Goyard" },
      { href: "/brands/dior", label: "Dior" },
    ],
  },
  "best-seller-comparison": {
    slug: "best-seller-comparison",
    path: "/best-seller-comparison",
    title: "Best Seller Comparison — Trending vs Latest",
    metaDescription:
      "Compare trending finds vs latest drops on LitBuy Finds — see what is hot now versus what just landed in the catalog.",
    badge: "Comparison",
    h1: "Best seller comparison",
    intro:
      "Trending sheet picks versus the newest latest-finds arrivals. Useful when you want proven heat or fresh drops.",
    getProducts: () => [],
    compareGroups: [
      {
        label: "Trending now",
        products: filterFeaturedEligible(priced(getTrendingProducts())).slice(0, 24),
      },
      {
        label: "Latest finds",
        products: filterFeaturedEligible(
          priced(getAllProducts().filter((p) => p.category_slug === "latest-finds"))
        ).slice(0, 24),
      },
    ],
    relatedLinks: [
      { href: "/trending", label: "Trending page" },
      { href: "/latest", label: "Latest finds" },
      { href: "/recently-added", label: "Recently added" },
    ],
    clusterLinks: [
      { href: "/guides/litbuy-spreadsheet-guide", label: "Spreadsheet guide" },
      { href: "/guides/how-to-use-litbuy-finds", label: "How to use LitBuy Finds" },
    ],
  },
};

export const COMPARISON_SLUGS = Object.keys(COMPARISON_PAGES);

export function getBagBrandRankings() {
  const bagProducts = getAllProducts().filter((p) =>
    /bag|crossbody|keepall|neverfull|tote|backpack/i.test(p.product_name)
  );
  return getBrandsFromProducts(bagProducts).slice(0, 10);
}
