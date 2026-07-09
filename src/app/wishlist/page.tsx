"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CatalogHero from "@/components/CatalogHero";
import ProductGrid from "@/components/ProductGrid";
import GuideSignupCallout from "@/components/conversion/GuideSignupCallout";
import RegisterLink from "@/components/RegisterLink";
import { useWishlist } from "@/context/WishlistContext";
import { WISHLIST_UNLOCK_THRESHOLD } from "@/lib/conversion";
import { REGISTER_MODAL_CTA_LABEL } from "@/lib/constants";
import type { Product } from "@/lib/types";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (wishlist.length === 0) {
      setSavedProducts([]);
      return;
    }

    let cancelled = false;
    void import("@/lib/products").then(({ getAllProducts }) => {
      if (cancelled) return;
      setSavedProducts(
        getAllProducts().filter((product) => wishlist.includes(product.id))
      );
    });

    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  return (
    <>
      <CatalogHero
        badge="Saved"
        title="Your Wishlist"
        subtitle="Items you've saved for later. Stored locally in your browser."
      />
      <section className="px-4 pb-16 sm:px-6">
        <div className="panel-shell mx-auto max-w-7xl rounded-[32px] border border-border-strong bg-panel p-5 sm:p-7">
          {savedProducts.length >= WISHLIST_UNLOCK_THRESHOLD ? (
            <div className="mb-6">
              <GuideSignupCallout variant="panel" />
            </div>
          ) : null}
          {savedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted">Your wishlist is empty.</p>
              <Link
                href="/"
                className="mt-4 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-bold text-white hover:bg-accent-hover"
              >
                Browse finds
              </Link>
              <p className="mt-6 max-w-sm text-xs leading-relaxed text-muted">
                Save finds with the heart icon, then{" "}
                <RegisterLink
                  location="wishlist_empty"
                  className="font-bold text-accent hover:underline"
                >
                  {REGISTER_MODAL_CTA_LABEL}
                </RegisterLink>{" "}
                to unlock verified buy links when you&apos;re ready.
              </p>
            </div>
          ) : (
            <ProductGrid products={savedProducts} />
          )}
        </div>
      </section>
    </>
  );
}
