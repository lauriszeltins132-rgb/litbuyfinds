#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src/app");

const SLUGS = [
  "best-finds",
  "best-finds-this-week",
  "best-finds-this-month",
  "best-under-20",
  "best-under-30",
  "best-under-50",
  "best-under-100",
  "best-sneakers",
  "best-jackets",
  "best-hoodies",
  "best-bags",
  "best-accessories",
  "best-qc-items",
];

const pageTemplate = (slug) => `import { createBestOfPage } from "@/lib/best-of-page";

const { generateMetadata, Page } = createBestOfPage("${slug}");

export { generateMetadata };
export default Page;
`;

for (const slug of SLUGS) {
  const dir = path.join(appDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug));
  console.log("created", slug);
}
