"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

type ChipItem = {
  label: string;
  count?: number;
  href: string;
  active?: boolean;
};

type FilterChipsProps = {
  title: string;
  items: ChipItem[];
  allHref: string;
  allActive?: boolean;
  /** When set, chip clicks update filters immediately without waiting on the router. */
  onNavigate?: (href: string) => void;
  /** Optional non-route action chip (e.g. scroll to sponsored section). */
  actionChip?: {
    label: string;
    onClick: () => void;
  };
};

export default function FilterChips({
  title,
  items,
  allHref,
  allActive = false,
  onNavigate,
  actionChip,
}: FilterChipsProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!onNavigate) return;
    event.preventDefault();
    onNavigate(href);
  }

  return (
    <div>
      <p className="control-label mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={allHref}
          scroll={false}
          onClick={(event) => handleClick(event, allHref)}
          className={`control-chip ${allActive ? "control-chip-active" : ""}`}
        >
          All {title.toLowerCase()}
        </Link>

        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            scroll={false}
            onClick={(event) => handleClick(event, item.href)}
            className={`control-chip ${item.active ? "control-chip-active" : ""}`}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className="text-xs opacity-70">{item.count}</span>
            )}
          </Link>
        ))}

        {actionChip ? (
          <button
            type="button"
            onClick={actionChip.onClick}
            className="control-chip"
          >
            {actionChip.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
