import CatalogPanel from "@/components/CatalogPanel";
import BrowseCatalogPrefetch from "@/components/BrowseCatalogPrefetch";
import { BROWSE_CATALOG_URL } from "@/lib/browse-catalog";

export default function HomepageCatalogSection() {
  return (
    <>
      <BrowseCatalogPrefetch />
      <CatalogPanel basePath="/" catalogSource={BROWSE_CATALOG_URL} />
    </>
  );
}
