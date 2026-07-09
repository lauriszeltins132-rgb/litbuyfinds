import { getBrandsFromProducts } from "@/lib/brands";
import { filterProducts } from "@/lib/filters";
import { getAllProducts, getCategories } from "@/lib/products";
import CatalogPanel from "@/components/CatalogPanel";

const PAGE_SIZE = 48;

type HomepageCatalogSectionProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomepageCatalogSection({
  searchParams,
}: HomepageCatalogSectionProps) {
  const params = await searchParams;
  const savedOnly = params.saved === "1";
  const allProducts = getAllProducts();
  const categories = getCategories();
  const brands = getBrandsFromProducts(allProducts);

  if (savedOnly) {
    return (
      <CatalogPanel
        products={allProducts}
        categories={categories}
        brands={brands}
        basePath="/"
      />
    );
  }

  const page = Math.max(1, parseInt(String(params.page ?? "1"), 10) || 1);
  const filtered = filterProducts(allProducts, {
    search: String(params.q ?? ""),
    category: "",
    brand: String(params.brand ?? ""),
    minPrice: String(params.min ?? ""),
    maxPrice: String(params.max ?? ""),
    sort: String(params.sort ?? "featured"),
    qcOnly: params.qc === "1",
    savedOnly: false,
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <CatalogPanel
      products={paginated}
      categories={categories}
      brands={brands}
      basePath="/"
      serverCatalog={{
        totalCount: filtered.length,
        page: currentPage,
        pageSize: PAGE_SIZE,
      }}
    />
  );
}
