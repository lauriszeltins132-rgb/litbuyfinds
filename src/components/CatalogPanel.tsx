"use client";

import { FormEvent, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BrandInfo } from "@/lib/brands";
import type { CategoryInfo, Product } from "@/lib/types";
import { filterProducts } from "@/lib/filters";
import ControlButton from "@/components/ui/ControlButton";
import Select from "@/components/ui/Select";
import TextInput from "@/components/ui/TextInput";
import FilterChips from "./FilterChips";
import Pagination from "./Pagination";
import ProductGrid from "./ProductGrid";

const PAGE_SIZE = 48;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured order" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

type CatalogPanelProps = {
  products: Product[];
  categories: CategoryInfo[];
  brands: BrandInfo[];
  basePath?: string;
};

function currentParams(searchParams: URLSearchParams) {
  const record: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function buildUrl(
  basePath: string,
  params: Record<string, string>,
  updates: Record<string, string>
) {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(updates)) {
    if (!value) next.delete(key);
    else next.set(key, value);
  }
  next.delete("page");
  const query = next.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export default function CatalogPanel({
  products,
  categories,
  brands,
  basePath = "/",
}: CatalogPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = currentParams(searchParams);

  const search = searchParams.get("q") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const minPrice = searchParams.get("min") ?? "";
  const maxPrice = searchParams.get("max") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [query, setQuery] = useState(search);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search,
        category: "",
        brand,
        minPrice,
        maxPrice,
        sort,
      }),
    [products, search, brand, minPrice, maxPrice, sort]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    router.push(buildUrl(basePath, params, { q: query.trim() }));
  }

  function applyPrice() {
    router.push(
      buildUrl(basePath, params, {
        min: minInput.trim(),
        max: maxInput.trim(),
      })
    );
  }

  const topBrands = brands.slice(0, 18);
  const onCategoryPage =
    pathname.startsWith("/category/") || pathname.startsWith("/categories/");
  const onFeaturedPage = pathname === "/trending" || pathname === "/latest";

  return (
    <section className="px-4 pb-16 sm:px-6">
      <div className="panel-shell mx-auto max-w-7xl rounded-[32px] border border-border-strong bg-panel p-5 sm:p-7">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <TextInput
              id="catalog-search"
              label="Search finds"
              value={query}
              onChange={setQuery}
              placeholder="Search by item name, brand, or category"
              type="search"
              icon={<SearchIcon />}
            />
            <ControlButton
              type="submit"
              variant="primary"
              className="w-full sm:mb-0.5 sm:w-auto sm:min-w-[7.5rem]"
            >
              Search
            </ControlButton>
          </div>
        </form>

        <div className="space-y-6 border-b border-border pb-6">
          <FilterChips
            title="Categories"
            allHref="/"
            allActive={pathname === "/" && !onCategoryPage && !onFeaturedPage}
            items={categories.map((item) => ({
              label: item.name,
              count: item.count,
              href: item.href,
              active: pathname === item.href,
            }))}
          />

          <FilterChips
            title="Brands"
            allHref={buildUrl(basePath, params, { brand: "" })}
            allActive={!brand}
            items={topBrands.map((item) => ({
              label: item.name,
              count: item.count,
              href: buildUrl(basePath, params, { brand: item.slug }),
              active: brand === item.slug,
            }))}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-b border-border pb-6 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <Select
            id="sort"
            label="Sort items"
            value={sort}
            onChange={(value) =>
              router.push(buildUrl(basePath, params, { sort: value }))
            }
            options={SORT_OPTIONS}
            fullWidth
          />

          <TextInput
            id="min-price"
            label="Min price (USD)"
            type="number"
            min={0}
            value={minInput}
            onChange={setMinInput}
            placeholder="0"
          />

          <TextInput
            id="max-price"
            label="Max price (USD)"
            type="number"
            min={0}
            value={maxInput}
            onChange={setMaxInput}
            placeholder="500"
          />

          <ControlButton
            variant="primary"
            onClick={applyPrice}
            className="w-full lg:mb-0.5 lg:w-auto"
          >
            Apply price
          </ControlButton>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {paginated.length.toLocaleString()}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {filtered.length.toLocaleString()}
            </span>{" "}
            finds
          </p>
        </div>

        <div className="mt-6">
          <ProductGrid products={paginated} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
          searchParams={params}
        />
      </div>
    </section>
  );
}
