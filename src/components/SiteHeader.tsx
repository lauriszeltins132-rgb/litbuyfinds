"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { REGISTER_HEADER_CTA_LABEL, SITE_NAME } from "@/lib/constants";
import CommunityLinks from "./CommunityLinks";
import RegisterLink from "./RegisterLink";
import GlobalSearch from "./GlobalSearch";
import AgentSelector from "./agents/AgentSelector";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/latest", label: "New Finds" },
  { href: "/guides", label: "Guides" },
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
      <header className="site-header sticky top-0 z-50 px-3 sm:px-6">
        <div className="mx-auto flex h-11 max-w-7xl items-center justify-between gap-2 sm:h-16">
          <Link href="/" rel="home" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo.svg"
              alt={SITE_NAME}
              width={28}
              height={28}
              className="sm:h-9 sm:w-9"
            />
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

          <div className="flex min-w-0 flex-1 items-center justify-end gap-0.5 sm:gap-2">
            <CommunityLinks variant="header" location="header" />
            <AgentSelector variant="mobile" className="sm:hidden" />
            <AgentSelector variant="header" className="hidden sm:block" />
            <GlobalSearch className="hidden sm:inline-flex" />
            <RegisterLink
              location="header"
              className="inline-flex shrink-0 rounded-full bg-accent px-2 py-1.5 text-[10px] font-black leading-none text-background sm:px-4 sm:py-2 sm:text-sm"
            >
              {REGISTER_HEADER_CTA_LABEL}
            </RegisterLink>
          </div>
        </div>
      </header>
    </>
  );
}
