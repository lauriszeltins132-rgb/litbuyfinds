# LitBuy Finds

A catalog website for LitBuy spreadsheet finds with affiliate buy links.

Built with Next.js, TypeScript, and Tailwind CSS. Product data comes from your Excel spreadsheet.

## Quick start

```bash
cd /Users/admin/litbuyfinds
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Update products from Excel

1. Put your `.xlsx` file in the `data/` folder (as `products.xlsx`)
2. Run:

```bash
npm run convert-data
```

3. Restart the dev server if it's running

## Pages

| URL | Description |
|-----|-------------|
| `/` | Home — trending + latest preview |
| `/trending` | Trending Now sheet |
| `/latest` | Latest Finds sheet |
| `/categories` | All categories |
| `/category/shoes` | Category pages (shoes, hoodies, etc.) |
| `/finds` | Search all products |
| `/wishlist` | Saved items |

## Project structure

```
data/products.xlsx          ← your spreadsheet
scripts/convert-spreadsheet.mjs  ← Excel → JSON converter
src/data/products.json      ← generated product data (3,087 products)
src/app/                    ← pages
src/components/             ← UI components
```
