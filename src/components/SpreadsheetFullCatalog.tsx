import { Suspense } from "react";
import BrowseCatalogPrefetch from "@/components/BrowseCatalogPrefetch";
import CatalogPanel from "@/components/CatalogPanel";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import { BROWSE_CATALOG_URL } from "@/lib/browse-catalog";

/** Full homepage catalog, mounted under the spreadsheet featured picks. */
export default function SpreadsheetFullCatalog() {
  return (
    <>
      <BrowseCatalogPrefetch />
      <section
        id="all-litbuy-spreadsheet-finds"
        className="scroll-mt-24 px-4 pt-2 sm:px-6"
      >
        <div className="mx-auto max-w-7xl pb-2">
          <h2 className="text-2xl font-black">All LitBuy spreadsheet finds</h2>
          <p className="mt-1 text-sm text-muted">
            Search, filter, and explore the full catalog.
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          <section className="px-4 pb-16 sm:px-6">
            <div className="panel-shell mx-auto max-w-7xl rounded-[32px] border border-border-strong bg-panel p-5 sm:p-7">
              <ProductGridSkeleton count={12} />
            </div>
          </section>
        }
      >
        <CatalogPanel
          basePath="/litbuy-spreadsheet"
          catalogSource={BROWSE_CATALOG_URL}
          inlineCategories
          scrollAnchorId="all-litbuy-spreadsheet-finds"
        />
      </Suspense>
    </>
  );
}
