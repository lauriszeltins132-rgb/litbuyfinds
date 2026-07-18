import Link from "next/link";
import type { Product } from "@/lib/types";
import { getDisplayBrand, getDisplayProductName } from "@/lib/product-validation";
import { formatProductPrice } from "@/lib/pricing";
import { getProductHref } from "@/lib/slugs";
import { getCardDisplayProps } from "@/lib/card-props";
import ProductCardImage from "@/components/ProductCardImage";

type HomepageFeaturedFindsProps = {
  products: Product[];
};

function getCardAlt(product: Product): string {
  const brand = getDisplayBrand(product);
  const name = getDisplayProductName(product);
  if (brand) {
    return `${brand} ${name} — LitBuy Spreadsheet find with QC on LitBuy Finds`;
  }
  return `${name} — LitBuy Spreadsheet find on LitBuy Finds`;
}

export default function HomepageFeaturedFinds({ products }: HomepageFeaturedFindsProps) {
  if (products.length === 0) return null;

  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Top spreadsheet picks
          </p>
          <h2 className="mt-2 text-2xl font-black sm:text-3xl">
            Featured LitBuy Spreadsheet Finds
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted">
            Verified QC items from the LitBuy spreadsheet — browse photos, prices, and
            agent links on LitBuy Finds.
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {products.map((product, index) => {
            const brand = getDisplayBrand(product);
            const name = getDisplayProductName(product);
            const href = getProductHref(product);
            const cardProps = getCardDisplayProps(product.id);
            const alt = getCardAlt(product);

            return (
              <li key={product.id}>
                <article className="product-card flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-panel shadow-sm">
                  <Link
                    href={href}
                    className="product-card-media product-image-shell product-image-shell--card relative block aspect-square overflow-hidden"
                  >
                    <ProductCardImage
                      src={product.image}
                      preferredSrc={cardProps?.displaySrc}
                      fallbacks={cardProps?.fallbacks}
                      fillClass={cardProps?.fillClass}
                      isProcessedCutout={cardProps?.isProcessedCutout}
                      alt={alt}
                      productHref={href}
                      priority={index < 3}
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-1.5 p-3">
                    <Link href={href} className="line-clamp-2 text-sm font-bold leading-snug">
                      {name}
                    </Link>
                    {brand ? (
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {brand}
                      </p>
                    ) : null}
                    <p className="text-sm font-black text-accent">
                      {formatProductPrice(product.price, "USD")}
                    </p>
                    <p className="mt-auto text-[10px] font-bold uppercase tracking-wide text-accent/80">
                      Found on LitBuy Spreadsheet
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 text-center">
          <Link
            href="/#browse"
            className="litbuy-seo-cta litbuy-seo-cta--accent inline-flex min-h-[2.75rem] items-center px-6 py-2.5 text-sm font-black"
          >
            Browse all LitBuy Spreadsheet finds
          </Link>
        </div>
      </div>
    </section>
  );
}
