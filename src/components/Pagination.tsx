"use client";

import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Crawlable prev URL — keep in sync with onPageChange for SEO. */
  prevHref?: string;
  /** Crawlable next URL — keep in sync with onPageChange for SEO. */
  nextHref?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  prevHref,
  nextHref,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  function handleNav(
    event: React.MouseEvent<HTMLAnchorElement>,
    page: number
  ) {
    event.preventDefault();
    onPageChange(page);
  }

  return (
    <nav
      aria-label="Pagination"
      className="catalog-pagination mt-8 flex items-center justify-center gap-3"
    >
      {prevDisabled || !prevHref ? (
        <span className="control-btn pointer-events-none opacity-40">Previous</span>
      ) : (
        <Link
          href={prevHref}
          rel="prev"
          scroll={false}
          onClick={(event) => handleNav(event, currentPage - 1)}
          className="control-btn"
        >
          Previous
        </Link>
      )}

      <span className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </span>

      {nextDisabled || !nextHref ? (
        <span className="control-btn pointer-events-none opacity-40">Next</span>
      ) : (
        <Link
          href={nextHref}
          rel="next"
          scroll={false}
          onClick={(event) => handleNav(event, currentPage + 1)}
          className="control-btn"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
