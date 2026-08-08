import CatalogDiscoveryLayout from "@/components/discovery/CatalogDiscoveryLayout";
import CatalogPanel from "@/components/CatalogPanel";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getLatestProducts } from "@/lib/products";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata({
  title: "New Finds",
  description:
    "Fresh LitBuy finds added recently — sneakers, streetwear, accessories, and more with verified buy links.",
  path: "/latest",
});

export default function LatestPage() {
  const products = getLatestProducts();
  const brands = getBrandsFromProducts(products);

  return (
    <CatalogDiscoveryLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "New Finds" },
      ]}
      currentPath="/latest"
      badge="Fresh drops"
      h1="New Finds"
      intro="The newest spreadsheet drops — browse photos, prices, and verified buy links."
      products={products}
      basePath="/latest"
      railTitle="Latest drops"
    >
      <CatalogPanel
        products={products}
        categories={getCategories()}
        brands={brands}
        basePath="/latest"
      />
    </CatalogDiscoveryLayout>
  );
}
