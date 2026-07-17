"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
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
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="control-btn"
        >
          Previous
        </button>
      )}

      <span className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-muted">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </span>

      {nextDisabled ? (
        <span className="control-btn pointer-events-none opacity-40">Next</span>
      ) : (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="control-btn"
        >
          Next
        </button>
      )}
    </nav>
  );
}
