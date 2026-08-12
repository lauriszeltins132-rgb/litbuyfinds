"use client";

import Link from "next/link";
import {
  CONTACT_EMAIL,
  REGISTER_CTA_LABEL,
  SITE_NAME,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { TELEGRAM_COMMUNITY_FOOTER_LINKS } from "@/lib/telegram-seo-pages";
import RegisterLink from "./RegisterLink";
import SmartLink from "./SmartLink";
import CommunityLinks from "./CommunityLinks";
import FooterTrustBar from "./FooterTrustBar";
import TrustStrip from "./TrustStrip";
import siteNavigation from "@/data/site-navigation.json";

const GUIDE_LINKS = [
  { href: "/guides", label: "All guides" },
  { href: "/litbuy-coupons", label: "LitBuy coupons" },
  { href: "/guides/litbuy-finds", label: "LitBuy finds" },
  { href: "/guides/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/guides/litbuy-qc-photos", label: "LitBuy QC photos" },
  { href: "/guides/beginner-guide-to-litbuy", label: "Beginner guide" },
  { href: "/how-to-buy", label: "How to buy" },
];

const COLLECTION_LINKS = [
  { href: "/best-litbuy-finds-2026", label: "Best finds 2026" },
  { href: "/best-budget-finds", label: "Budget finds" },
  { href: "/collections/best-litbuy-finds-2026", label: "2026 collection" },
  { href: "/collections/best-nike-finds", label: "Best Nike finds" },
  { href: "/collections/best-qc-approved-finds", label: "QC finds" },
  { href: "/collections/best-budget-finds", label: "Budget collection" },
  { href: "/collections/litbuy-spreadsheet-alternative", label: "Sheet alternative" },
];

const RESOURCE_LINKS = [
  { href: "/litbuy-spreadsheet", label: "LitBuy spreadsheet" },
  { href: "/guides/litbuy-spreadsheet-guide", label: "Spreadsheet guide" },
  { href: "/latest-finds", label: "Latest finds" },
  { href: "/finds", label: "Finds database" },
  { href: "/litbuy-qc", label: "QC photo guide" },
  { href: "/best-rep-finds", label: "Best rep finds" },
];

const TRUST_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
];

const AGENT_FINDS_LINKS = [
  { href: "/litbuy-finds", label: "LitBuy finds" },
  { href: "/kakobuy-finds", label: "Kakobuy finds" },
  { href: "/oopbuy-finds", label: "OopBuy finds" },
  { href: "/hipobuy-finds", label: "HipoBuy finds" },
  { href: "/acbuy-finds", label: "ACBuy finds" },
  { href: "/mulebuy-finds", label: "MuleBuy finds" },
];

export default function Footer() {
  const categories = siteNavigation.categories;
  const brands = siteNavigation.footerBrands;

  return (
    <footer className="relative mt-auto border-t border-border bg-surface px-4 py-16 sm:px-6">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl">
        <TrustStrip compact />
        <div className="mt-8 overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/10 via-surface to-background p-6 shadow-[0_12px_40px_rgba(26,29,22,0.07)] sm:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Community
              </p>
              <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
                Join buyers on Discord & Telegram
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                QC checks, shipping advice, and daily finds from real buyers.
                The fastest way to get help before you ship your haul.
              </p>
            </div>
            <CommunityLinks
              variant="cta"
              location="footer_cta"
              showTelegramHandle
            />
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-black text-foreground hover:text-accent">
              {SITE_NAME}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
              Curated LitBuy discovery — verified links, QC references, and
              fresh catalog updates across fashion, sneakers, and accessories.
            </p>
            <p className="mt-4 text-xs text-muted">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Categories
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link href={category.href} className="text-foreground/75 transition hover:text-accent">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Link
              href="/brands"
              className="text-xs font-bold uppercase tracking-[0.18em] text-muted transition hover:text-accent"
            >
              Brand directory
            </Link>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/brands" className="font-bold text-accent hover:underline">
                  Browse all brands
                </Link>
              </li>
              {brands.map((brand) => (
                <li key={brand.slug}>
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="text-foreground/75 transition hover:text-accent"
                  >
                    {brand.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Community
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TELEGRAM_COMMUNITY_FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground/75 transition hover:text-accent"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-foreground/75 transition hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link href="/telegram" className="text-foreground/75 transition hover:text-accent">
                  All Telegram guides
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="text-foreground/75 transition hover:text-accent">
                  Advertise
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
              Guides & trust
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {GUIDE_LINKS.map((link) => (
                <li key={link.href}>
                  <SmartLink href={link.href} className="text-foreground/75 transition hover:text-accent">
                    {link.label}
                  </SmartLink>
                </li>
              ))}
              {COLLECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/75 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/75 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              {TRUST_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/75 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/trending" className="text-foreground/75 transition hover:text-accent">
                  Trending finds
                </Link>
              </li>
              {AGENT_FINDS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-foreground/75 transition hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <RegisterLink
                  location="footer"
                  className="font-bold text-accent hover:underline"
                >
                  {REGISTER_CTA_LABEL}
                </RegisterLink>
              </li>
            </ul>
          </div>
        </div>

        <FooterTrustBar />

        <div className="mt-8 flex flex-col gap-4 border-t border-border/80 pt-8 text-xs leading-relaxed text-muted sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl">
            LitBuy Finds is an independent discovery catalog. We do not sell
            products directly. Images and links are sourced from public
            spreadsheets and affiliate programs. Always verify QC and seller
            details before purchasing.{" "}
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-accent hover:underline"
            >
              Join RN Finds Telegram
            </a>
          </p>
          <p className="shrink-0 text-foreground/50">
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
