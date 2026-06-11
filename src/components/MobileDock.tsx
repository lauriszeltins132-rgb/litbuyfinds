"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GlobalSearch from "./GlobalSearch";

const LINKS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/trending", label: "Trending", icon: "🔥" },
  { href: "/categories", label: "Categories", icon: "▦" },
  { href: "/brands", label: "Brands", icon: "◎" },
] as const;

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <nav className="mobile-dock sm:hidden" aria-label="Mobile navigation">
      <GlobalSearch variant="dock" />
      {LINKS.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-dock__link ${active ? "mobile-dock__link--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="mobile-dock__icon" aria-hidden>
              {link.icon}
            </span>
            <span className="mobile-dock__label">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
