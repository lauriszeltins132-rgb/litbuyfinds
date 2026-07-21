"use client";

import Link from "next/link";

type CollectionAiRefineProps = {
  categoryName: string;
  categorySlug: string;
};

export default function CollectionAiRefine({
  categoryName,
  categorySlug,
}: CollectionAiRefineProps) {
  const prompt = encodeURIComponent(
    `Only show the best ${categoryName} options below $40`
  );

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/40 px-4 py-3">
      <p className="text-sm text-muted">
        Refine {categoryName} with LitBuy AI
      </p>
      <Link
        href={`/ai?q=${prompt}`}
        className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white hover:opacity-90"
      >
        Refine with AI
      </Link>
      <span className="sr-only">Category slug {categorySlug}</span>
    </div>
  );
}
