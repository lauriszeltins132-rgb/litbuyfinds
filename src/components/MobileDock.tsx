"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GlobalSearch from "./GlobalSearch";

const LINKS = [
  { href: "/trending", label: "Hot", short: "🔥" },
  { href: "/categories", label: "Cats", short: "▦" },
  { href: "/brands", label: "Brands", short: "◎" },
  { href: "/#browse", label: "All", short: "☰" },
] as const;

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <div className="mobile-dock sm:hidden" role="navigation" aria-label="Mobile">
      <GlobalSearch variant="dock" />
      <div className="mobile-dock__divider" aria-hidden />
      <ul className="mobile-dock__nav">
        {LINKS.map((link) => {
          const active =
            link.href === "/#browse"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`mobile-dock__link ${active ? "mobile-dock__link--active" : ""}`}
              >
                <span className="mobile-dock__icon" aria-hidden>
                  {link.short}
                </span>
                <span className="mobile-dock__label">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
