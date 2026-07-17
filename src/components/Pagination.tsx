"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string>;
  /** Use programmatic navigation (with server refresh) instead of plain links. */
  onNavigate?: (url: string) => void;
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

function PaginationControl({
  href,
  disabled,
  onNavigate,
  children,
}: {
  href: string;
  disabled?: boolean;
  onNavigate?: (url: string) => void;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span className="control-btn pointer-events-none opacity-40">{children}</span>
    );
  }

  if (onNavigate) {
    return (
      <button
        type="button"
        onClick={() => onNavigate(href)}
        className="control-btn"
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} scroll={false} className="control-btn">
      {children}
    </Link>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
  onNavigate,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="catalog-pagination mt-8 flex items-center justify-center gap-3"
    >
      <PaginationControl
        href={buildHref(basePath, searchParams, currentPage - 1)}
        disabled={prevDisabled}
        onNavigate={onNavigate}
      >
        Previous
      </PaginationControl>

      <span className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </span>

      <PaginationControl
        href={buildHref(basePath, searchParams, currentPage + 1)}
        disabled={nextDisabled}
        onNavigate={onNavigate}
      >
        Next
      </PaginationControl>
    </nav>
  );
}
