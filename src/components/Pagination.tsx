"use client";

import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string>;
};

function buildHref(
  basePath: string,
  searchParams: Record<string, string>,
  page: number
) {
  const params = new URLSearchParams(searchParams);
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="catalog-pagination mt-8 flex items-center justify-center gap-3"
    >
      {prevDisabled ? (
        <span className="control-btn pointer-events-none opacity-40">Previous</span>
      ) : (
        <Link
          href={buildHref(basePath, searchParams, currentPage - 1)}
          scroll={false}
          className="control-btn"
        >
          Previous
        </Link>
      )}

      <span className="rounded-full border border-border bg-[#0f1117] px-4 py-2 text-sm font-semibold text-muted">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </span>

      {nextDisabled ? (
        <span className="control-btn pointer-events-none opacity-40">Next</span>
      ) : (
        <Link
          href={buildHref(basePath, searchParams, currentPage + 1)}
          scroll={false}
          className="control-btn"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
