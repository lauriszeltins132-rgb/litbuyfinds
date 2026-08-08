import { Suspense, type ReactNode } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import DiscoveryRail from "@/components/DiscoveryRail";
import { getFindsAuthorityStats } from "@/lib/finds-authority";
import type { Product } from "@/lib/types";

type CatalogDiscoveryLayoutProps = {
  breadcrumbs: { label: string; href?: string }[];
  currentPath: string;
  badge: string;
  h1: string;
  intro: string;
  products: Product[];
  basePath: string;
  railTitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function CatalogDiscoveryLayout({
  breadcrumbs,
  currentPath,
  badge,
  h1,
  intro,
  products,
  basePath,
  railTitle = "Browse finds",
  children,
  footer,
}: CatalogDiscoveryLayoutProps) {
  const stats = getFindsAuthorityStats();
  const railProducts = products.slice(0, 12);

  return (
    <>
      <Breadcrumbs items={breadcrumbs} currentPath={currentPath} />

      <section className="px-4 pb-2 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {badge}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{h1}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{intro}</p>
          <p className="mt-2 text-xs font-semibold text-muted">
            {products.length.toLocaleString()} finds on this page ·{" "}
            {stats.totalFindsLabel} indexed · {stats.qcFindsLabel} with QC links
          </p>
        </div>
      </section>

      {railProducts.length > 0 ? (
        <DiscoveryRail
          title={railTitle}
          subtitle="Tap a product to view photos, price, and buy link"
          href={basePath}
          products={railProducts}
          preloadImages
          tight
        />
      ) : null}

      <Suspense fallback={<div className="py-24 text-center text-muted">Loading...</div>}>
        {children}
      </Suspense>

      {footer}
    </>
  );
}
