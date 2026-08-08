import DiscoveryRail from "@/components/DiscoveryRail";
import { getDiscoveryBrowseRails } from "@/lib/discovery-page-utils";
import type { Product } from "@/lib/types";

type DiscoveryBrowseRailsProps = {
  slug: string;
  path: string;
  primaryProducts: Product[];
  categories?: string[];
};

export default function DiscoveryBrowseRails({
  slug,
  path,
  primaryProducts,
  categories = [],
}: DiscoveryBrowseRailsProps) {
  const rails = getDiscoveryBrowseRails({
    slug,
    primaryProducts,
    categories,
  });

  if (rails.length === 0) return null;

  return (
    <>
      {rails.map((rail, index) => (
        <DiscoveryRail
          key={rail.id}
          title={rail.title}
          subtitle={rail.subtitle}
          href={rail.href}
          products={rail.products}
          showTrendingScore={rail.showTrendingScore}
          freshness={rail.freshness}
          preloadImages={index === 0}
          tight
        />
      ))}
    </>
  );
}
