"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { LITBUY_SIGNUP_URL, SITE_NAME } from "@/lib/constants";
import CommunityLinks from "./CommunityLinks";
import GlobalSearch from "./GlobalSearch";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/latest", label: "New Finds" },
  { href: "/brands", label: "Brands" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "Saved" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { wishlist } = useWishlist();

  return (
    <>
      <div className="accent-line" />
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image src="/logo.svg" alt={SITE_NAME} width={36} height={36} />
            <span className="hidden font-black tracking-tight text-foreground sm:inline">
              {SITE_NAME}
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 overflow-x-auto lg:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive ? "chip-active" : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {link.href === "/wishlist" && wishlist.length > 0 && (
                    <span className="ml-1 text-accent">{wishlist.length}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <CommunityLinks variant="header" />
            <GlobalSearch />
            <Link
              href={LITBUY_SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-black text-background sm:inline-flex"
            >
              Register
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
