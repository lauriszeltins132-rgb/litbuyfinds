# LitBuy SEO Launch — Search Console Workflow

**Site:** https://litbuyfinds.io  
**Sitemap:** https://litbuyfinds.io/sitemap.xml  
**Updated:** 2026-07-21

## 1. Submit sitemap

1. Open [Google Search Console](https://search.google.com/search-console) for `litbuyfinds.io`.
2. Go to **Sitemaps**.
3. Submit: `https://litbuyfinds.io/sitemap.xml`
4. Confirm no errors after the next crawl.

## 2. Inspect priority URLs

Use **URL Inspection** for each page below. After inspection, click **Request indexing** for updated or new pages.

| Priority | URL |
|----------|-----|
| 1 | `https://litbuyfinds.io/` |
| 2 | `https://litbuyfinds.io/litbuy-finds` |
| 3 | `https://litbuyfinds.io/litbuy-spreadsheet` |
| 4 | `https://litbuyfinds.io/what-is-litbuy-finds` |
| 5 | `https://litbuyfinds.io/how-to-use-litbuy` |
| 6 | `https://litbuyfinds.io/litbuy-qc-photos` |
| 7 | `https://litbuyfinds.io/ai` |
| 8 | `https://litbuyfinds.io/what-is-litbuy` |
| 9 | `https://litbuyfinds.io/is-litbuy-legit` |
| 10 | `https://litbuyfinds.io/is-litbuy-safe` |
| 11 | `https://litbuyfinds.io/litbuy-review` |
| 12 | `https://litbuyfinds.io/litbuy-coupons` |
| 13 | `https://litbuyfinds.io/telegram-litbuy` |
| 14 | `https://litbuyfinds.io/discord-litbuy` |
| 15 | `https://litbuyfinds.io/litbuy-spreadsheet-2026` |

## 3. Request indexing

Request indexing only for:

- New authority pages (first launch)
- Pages with substantial content updates
- Homepage after authority hub changes

Do not request indexing for every product URL individually.

## 4. Page Indexing report

Weekly for the first month:

- Check **Indexed** vs **Not indexed** counts
- Review **Excluded** reasons (duplicate, crawled not indexed, noindex)
- Fix soft 404s and redirect chains reported here

## 5. Core Web Vitals

- Monitor **LCP**, **INP**, **CLS** in Search Console and Vercel Speed Insights
- Product images use white `object-contain` cards — watch for CLS on catalog grids
- Homepage uses ISR (`revalidate: 3600`) for discovery rails

## 6. Structured data

- Validate sample URLs in [Rich Results Test](https://search.google.com/test/rich-results)
- Check Search Console **Enhancements** for FAQ, Breadcrumb, Product errors
- We do not use `AggregateRating` or fake review schema

## 7. AI visibility (Search Console)

Google provides generative-AI visibility reporting in Search Console when available:

- Review **AI features** / generative visibility reports for branded queries
- Track impressions for: `litbuy`, `litbuy finds`, `litbuy spreadsheet`, `litbuy ai`
- Compare against `.org` competitors by improving clarity, not copying content

## 8. Query monitoring (2–4 weeks post-launch)

Review **Performance** → **Search results** for:

| Query cluster | Target page |
|---------------|-------------|
| litbuy / what is litbuy | `/what-is-litbuy` |
| litbuy finds | `/litbuy-finds`, `/what-is-litbuy-finds` |
| litbuy spreadsheet | `/litbuy-spreadsheet`, `/litbuy-spreadsheet-2026` |
| litbuy qc / qc photos | `/litbuy-qc-photos`, `/litbuy-qc` |
| litbuy coupons / discount | `/litbuy-coupons`, `/litbuy-discount` |
| litbuy telegram / discord | `/telegram-litbuy`, `/discord-litbuy` |
| is litbuy legit / safe | `/is-litbuy-legit`, `/is-litbuy-safe` |
| litbuy ai | `/ai` |
| litbuy shoes / hoodies / bags | Category collection pages |

## 9. Technical checklist

- [ ] Canonical domain: `https://litbuyfinds.io` (no www)
- [ ] HTTP → HTTPS redirect (Vercel default)
- [ ] `robots.txt` allows `/`, disallows `/wishlist`, `/stats`
- [ ] Sitemap excludes chat query URLs and noindex pages
- [ ] No accidental `noindex` on authority pages
- [ ] Mobile content matches desktop (mobile-first indexing)

## 10. Deferred improvements

- Consolidate duplicate Nike/Jordan list URLs (root vs `/collections/` vs `/top-*`)
- Add `HowTo` schema to step-by-step buying guides
- Per-brand minimum product thresholds before indexing thin brand pages
- Search Console rank tracking export automation

## Notes

- Sitemaps help discovery; they do not guarantee indexing.
- Structured data helps understanding; it does not guarantee rich results.
- Rankings are not guaranteed — focus on useful, unique pages with real catalog value.
