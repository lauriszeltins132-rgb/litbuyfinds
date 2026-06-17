import Link from "next/link";
import { getAllGuides } from "@/lib/guides";
import { getCategories, getAllProducts } from "@/lib/products";
import { getBrandsFromProducts } from "@/lib/brands";

const FEATURED_BRAND_SLUGS = [
  "nike",
  "jordan",
  "adidas",
  "moncler",
  "stussy",
  "gucci",
  "louis-vuitton",
  "supreme",
  "stone-island",
  "balenciaga",
  "chrome-hearts",
  "bape",
];

const FEATURED_CATEGORY_SLUGS = [
  "shoes",
  "hoodies-and-pants",
  "coats-and-jackets",
  "accessories",
  "electronics",
];

const FEATURED_GUIDE_PATHS = [
  "/guides/beginner-guide-to-litbuy",
  "/guides/how-to-use-litbuy-finds",
  "/litbuy-qc",
  "/litbuy-spreadsheet",
  "/guides/how-to-buy-from-weidian",
  "/guides/how-to-find-good-reps",
  "/guides/litbuy-vs-allchinabuy",
  "/guides/litbuy-vs-sugargoo",
  "/guides/litbuy-vs-pandabuy-alternatives",
  "/guides/beginner-guide-to-litbuy",
  "/guides/how-to-use-litbuy-finds",
  "/guides/how-to-check-qc-photos",
  "/guides/how-to-buy-from-weidian",
  "/guides/how-shipping-works-with-agents",
];

type RelatedPagesProps = {
  currentPath?: string;
  brandSlug?: string;
  categorySlug?: string;
};

export default function RelatedPages({
  currentPath,
  brandSlug,
  categorySlug,
}: RelatedPagesProps) {
  const products = getAllProducts();
  const brands = getBrandsFromProducts(products)
    .filter((b) => b.slug !== brandSlug)
    .sort((a, b) => {
      const aFeatured = FEATURED_BRAND_SLUGS.indexOf(a.slug);
      const bFeatured = FEATURED_BRAND_SLUGS.indexOf(b.slug);
      if (aFeatured >= 0 && bFeatured >= 0) return aFeatured - bFeatured;
      if (aFeatured >= 0) return -1;
      if (bFeatured >= 0) return 1;
      return b.count - a.count;
    })
    .slice(0, 5);

  const categories = getCategories()
    .filter((c) => c.group === "category" && c.slug !== categorySlug)
    .sort((a, b) => {
      const aF = FEATURED_CATEGORY_SLUGS.indexOf(a.slug);
      const bF = FEATURED_CATEGORY_SLUGS.indexOf(b.slug);
      if (aF >= 0 && bF >= 0) return aF - bF;
      if (aF >= 0) return -1;
      if (bF >= 0) return 1;
      return b.count - a.count;
    })
    .slice(0, 5);

  const guides = getAllGuides()
    .filter((g) => g.path !== currentPath)
    .sort((a, b) => {
      const aF = FEATURED_GUIDE_PATHS.indexOf(a.path);
      const bF = FEATURED_GUIDE_PATHS.indexOf(b.path);
      if (aF >= 0 && bF >= 0) return aF - bF;
      if (aF >= 0) return -1;
      if (bF >= 0) return 1;
      return 0;
    })
    .slice(0, 5);

  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border bg-surface/30 p-5">
        <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">
          Related pages
        </h2>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Brands</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
              Categories
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={cat.href}
                    className="rounded-full border border-border px-3 py-1 text-xs font-bold hover:border-accent/40 hover:text-accent"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Guides</p>
            <ul className="mt-2 space-y-2 text-sm">
              {guides.map((guide) => (
                <li key={guide.path}>
                  <Link href={guide.path} className="text-muted hover:text-accent">
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
