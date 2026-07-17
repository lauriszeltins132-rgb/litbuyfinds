import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";
import CatalogPanel from "@/components/CatalogPanel";

export default async function HomepageCatalogSection() {
  const allProducts = getAllProducts();
  const categories = getCategories();
  const brands = getBrandsFromProducts(allProducts);

  return (
    <CatalogPanel
      products={allProducts}
      categories={categories}
      brands={brands}
      basePath="/"
    />
  );
}
