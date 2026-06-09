"use client";

import { useMemo } from "react";
import Link from "next/link";
import CatalogHero from "@/components/CatalogHero";
import ProductGrid from "@/components/ProductGrid";
import { useWishlist } from "@/context/WishlistContext";
import { getAllProducts } from "@/lib/products";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  const savedProducts = useMemo(
    () => getAllProducts().filter((product) => wishlist.includes(product.id)),
    [wishlist]
  );

  return (
    <>
      <CatalogHero
        badge="Saved"
        title="Your Wishlist"
        subtitle="Items you've saved for later. Stored locally in your browser."
      />
      <section className="px-4 pb-16 sm:px-6">
        <div className="panel-shell mx-auto max-w-7xl rounded-[32px] border border-border-strong bg-panel p-5 sm:p-7">
          {savedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted">Your wishlist is empty.</p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-hover"
              >
                Browse finds
              </Link>
            </div>
          ) : (
            <ProductGrid products={savedProducts} />
          )}
        </div>
      </section>
    </>
  );
}
