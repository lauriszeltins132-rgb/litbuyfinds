import type { Metadata } from "next";
import CatalogDiscoveryLayout from "@/components/discovery/CatalogDiscoveryLayout";
import CatalogPanel from "@/components/CatalogPanel";
import SignupCard from "@/components/SignupCard";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getTrendingProducts } from "@/lib/products";
import { getTrendingMetadataCopy } from "@/lib/metadata-copy";
import { buildPageMetadata } from "@/lib/seo";

const trendingMeta = getTrendingMetadataCopy();

export const metadata: Metadata = buildPageMetadata({
  title: trendingMeta.title,
  description: trendingMeta.description,
  path: "/trending",
});

export default function TrendingPage() {
  const products = getTrendingProducts();
  const brands = getBrandsFromProducts(products);

  return (
    <CatalogDiscoveryLayout
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Trending" },
      ]}
      currentPath="/trending"
      badge="Trending now"
      h1="Trending This Week"
      intro="What buyers are browsing right now — photos, QC references, and buy links."
      products={products}
      basePath="/trending"
      railTitle="Trending picks"
      footer={<SignupCard location="trending" variant="compact" />}
    >
      <CatalogPanel
        products={products}
        categories={getCategories()}
        brands={brands}
        basePath="/trending"
      />
    </CatalogDiscoveryLayout>
  );
}
