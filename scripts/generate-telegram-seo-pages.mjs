#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src/app");

const SLUGS = [
  "telegram",
  "rn-finds",
  "litbuy-telegram",
  "mulebuy-telegram",
  "oopbuy-telegram",
  "acbuy-telegram",
  "kakobuy-telegram",
  "agent-finds-telegram",
  "spreadsheet-telegram",
  "qc-finds-telegram",
  "sneaker-finds-telegram",
  "fashion-finds-telegram",
];

const pageTemplate = (slug) => `import { createTelegramSeoPage } from "@/lib/telegram-seo-page";

const { generateMetadata, Page } = createTelegramSeoPage("${slug}");

export { generateMetadata };
export default Page;
`;

for (const slug of SLUGS) {
  const dir = path.join(appDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug));
  console.log("created", slug);
}
