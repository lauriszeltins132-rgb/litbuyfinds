"use client";

import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { BrandInfo } from "@/lib/brands";
import type { CategoryInfo, Product } from "@/lib/types";
import { buildPageHref } from "@/lib/catalog-url";
import { filterProducts } from "@/lib/filters";
import { POPULAR_SEARCHES } from "@/lib/constants";
import {
  getBrowseCatalogCache,
  loadBrowseCatalog,
  type BrowseCatalogPayload,
} from "@/lib/browse-catalog";
import { useWishlist } from "@/context/WishlistContext";
import ControlButton from "@/components/ui/ControlButton";
import Select from "@/components/ui/Select";
import TextInput from "@/components/ui/TextInput";
import FilterChips from "./FilterChips";
import Pagination from "./Pagination";
import ProductGrid from "./ProductGrid";
import ProductGridSkeleton from "./ProductGridSkeleton";

const PAGE_SIZE = 48;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured order" },
  { value: "popular", label: "Most popular" },
  { value: "newest", label: "Newest" },
  { value: "qc", label: "QC linked first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

type CatalogPanelProps = {
  products?: Product[];
  categories?: CategoryInfo[];
  brands?: BrandInfo[];
  basePath?: string;
  /** Fetch the full browse catalog client-side (homepage performance). */
  catalogSource?: string;
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
  products: productsProp = [],
  categories: categoriesProp = [],
  brands: brandsProp = [],
  basePath = "/",
  catalogSource,
}: CatalogPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const params = currentParams(searchParams);
  const { wishlist } = useWishlist();
  const [catalogData, setCatalogData] = useState<BrowseCatalogPayload | null>(
    catalogSource ? getBrowseCatalogCache() : null
  );
  const [catalogLoading, setCatalogLoading] = useState(
    Boolean(catalogSource && !getBrowseCatalogCache())
  );

  const products = catalogSource ? (catalogData?.products ?? []) : productsProp;
  const categories = catalogSource
    ? (catalogData?.categories ?? [])
    : categoriesProp;
  const brands = catalogSource ? (catalogData?.brands ?? []) : brandsProp;

  const search = searchParams.get("q") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const minPrice = searchParams.get("min") ?? "";
  const maxPrice = searchParams.get("max") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const qcOnly = searchParams.get("qc") === "1";
  const savedOnly = searchParams.get("saved") === "1";
  const urlPage = Math.max(
    1,
    parseInt(searchParams.get("page") ?? "1", 10) || 1
  );
  const filterKey = `${search}|${brand}|${minPrice}|${maxPrice}|${sort}|${qcOnly}|${savedOnly}`;
  const [page, setPage] = useState(urlPage);
  const prevFilterKeyRef = useRef(filterKey);
  const prevPageRef = useRef(page);

  const [query, setQuery] = useState(search);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setQuery(search);
  }, [search]);

  useEffect(() => {
    if (!catalogSource) return;
    if (getBrowseCatalogCache()) {
      setCatalogData(getBrowseCatalogCache());
      setCatalogLoading(false);
      return;
    }

    let cancelled = false;
    loadBrowseCatalog(catalogSource)
      .then((payload) => {
        if (cancelled) return;
        setCatalogData(payload);
        setCatalogLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCatalogLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [catalogSource]);

  useEffect(() => {
    if (prevFilterKeyRef.current !== filterKey) {
      prevFilterKeyRef.current = filterKey;
      setPage(1);
    }
  }, [filterKey]);

  useEffect(() => {
    const onPopState = () => {
      const nextPage = Math.max(
        1,
        parseInt(new URLSearchParams(window.location.search).get("page") ?? "1", 10) ||
          1
      );
      setPage(nextPage);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const savedIds = useMemo(() => new Set(wishlist), [wishlist]);

  const filtered = useMemo(
    () =>
      filterProducts(products, {
        search,
        category: "",
        brand,
        minPrice,
        maxPrice,
        sort,
        qcOnly,
        savedOnly,
        savedIds,
      }),
    [
      products,
      search,
      brand,
      minPrice,
      maxPrice,
      sort,
      qcOnly,
      savedOnly,
      savedIds,
    ]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [filtered, currentPage]
  );

  function goToPage(nextPage: number) {
    const clamped = Math.max(1, Math.min(nextPage, totalPages));
    if (clamped === currentPage) return;

    setPage(clamped);
    prevPageRef.current = clamped;

    const nextUrl = buildPageHref(basePath, params, clamped);
    window.history.pushState({ catalogPage: clamped }, "", nextUrl);
  }

  useEffect(() => {
    prevPageRef.current = currentPage;
  }, [currentPage]);

  function navigate(url: string) {
    startTransition(() => {
      router.push(url, { scroll: false });
    });
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    navigate(buildUrl(basePath, params, { q: query.trim() }));
  }

  function applyPrice() {
    navigate(
      buildUrl(basePath, params, {
        min: minInput.trim(),
        max: maxInput.trim(),
      })
    );
  }

  function toggleParam(key: string, active: boolean) {
    navigate(buildUrl(basePath, params, { [key]: active ? "" : "1" }));
  }

  const topBrands = brands.slice(0, 18);
  const onCategoryPage =
    pathname.startsWith("/category/") || pathname.startsWith("/categories/");
  const onFeaturedPage = pathname === "/trending" || pathname === "/latest";

  const filterControls = (
    <>
      <Select
        id="sort"
        label="Sort items"
        value={sort}
        onChange={(value) =>
          navigate(buildUrl(basePath, params, { sort: value }))
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
    </>
  );

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

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => toggleParam("qc", qcOnly)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              qcOnly
                ? "border-accent bg-accent/12 text-accent"
                : "border-border text-muted hover:border-accent/40"
            }`}
          >
            QC linked
          </button>
          <button
            type="button"
            onClick={() => toggleParam("saved", savedOnly)}
            className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
              savedOnly
                ? "border-accent bg-accent/12 text-accent"
                : "border-border text-muted hover:border-accent/40"
            }`}
          >
            Saved only
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted sm:hidden"
          >
            {filtersOpen ? "Hide filters" : "More filters"}
          </button>
        </div>

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

        <div
          className={`mt-6 grid grid-cols-1 gap-4 border-b border-border pb-6 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end ${
            filtersOpen ? "" : "hidden sm:grid"
          }`}
        >
          {filterControls}
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

        <div id="catalog-product-grid" className="catalog-product-grid mt-6 scroll-mt-24">
          {catalogLoading ? (
            <ProductGridSkeleton count={12} />
          ) : isPending ? (
            <ProductGridSkeleton count={8} />
          ) : paginated.length > 0 ? (
            <ProductGrid products={paginated} instant />
          ) : (
            <div className="rounded-2xl border border-border bg-surface/30 px-6 py-10 text-center">
              <p className="text-base font-bold text-foreground">No finds matched</p>
              <p className="mt-2 text-sm text-muted">
                Try a broader search, clear filters, or browse popular picks.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {POPULAR_SEARCHES.slice(0, 6).map((term) => (
                  <Link
                    key={term}
                    href={buildUrl(basePath, params, { q: term })}
                    scroll={false}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40 hover:text-accent"
                  >
                    {term}
                  </Link>
                ))}
                <Link
                  href="/trending"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-accent hover:underline"
                >
                  Trending finds
                </Link>
                <Link
                  href="/wishlist"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground/80 hover:border-accent/40"
                >
                  Saved items
                </Link>
              </div>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      </div>
    </section>
  );
}
