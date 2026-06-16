#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src/app");

const SLUGS = [
  "litbuy-spreadsheet",
  "litbuy-qc",
  "litbuy-finds",
  "litbuy-sneakers",
  "litbuy-jackets",
  "litbuy-weidian",
  "litbuy-taobao",
  "litbuy-guide",
  "best-litbuy-finds",
  "litbuy-products",
  "best-litbuy-sneakers-2026",
  "best-litbuy-jackets-2026",
  "best-litbuy-bags-2026",
  "best-litbuy-accessories-2026",
  "best-litbuy-finds-under-50",
];

const pageTemplate = (slug) => `import { createSeoLandingPage } from "@/lib/seo-landing-page";

const { generateMetadata, Page } = createSeoLandingPage("${slug}");

export { generateMetadata };
export default Page;
`;

for (const slug of SLUGS) {
  const dir = path.join(appDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug));
  console.log("created", slug);
}
