"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/trending", label: "Trending" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/#browse", label: "Browse" },
] as const;

export default function MobileQuickNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 backdrop-blur-xl sm:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {LINKS.map((link) => {
          const active =
            link.href === "/#browse"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex flex-col items-center rounded-xl px-2 py-2 text-[11px] font-bold ${
                  active ? "bg-accent/15 text-accent" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
