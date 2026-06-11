#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src/app");

const SLUGS = [
  "top-rep-sneakers",
  "top-nike-finds",
  "top-designer-bags",
  "top-budget-finds",
  "top-streetwear-finds",
  "top-products-under-20",
  "top-products-under-50",
  "top-products-under-100",
  "top-louis-vuitton-finds",
  "top-gucci-finds",
  "nike-vs-adidas-finds",
  "best-bag-brands-on-litbuy",
  "best-seller-comparison",
];

const pageTemplate = (slug) => `import { createSeoListPage } from "@/lib/seo-list-page";

const { generateMetadata, Page } = createSeoListPage("${slug}");

export { generateMetadata };
export default Page;
`;

for (const slug of SLUGS) {
  const dir = path.join(appDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug));
  console.log("created", slug);
}
