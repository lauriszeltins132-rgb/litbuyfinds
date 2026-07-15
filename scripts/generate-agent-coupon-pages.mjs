#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src/app");

const SLUGS = [
  "litbuy-coupons",
  "best-litbuy-coupons",
  "litbuy-coupons-2026",
  "litbuy-discount",
  "litbuy-promo",
  "kakobuy-coupons",
  "best-kakobuy-coupons",
  "kakobuy-coupons-2026",
  "mulebuy-coupons",
  "best-mulebuy-coupons",
  "mulebuy-coupons-2026",
  "oopbuy-coupons",
  "best-oopbuy-coupons",
  "oopbuy-coupons-2026",
  "hipobuy-coupons",
  "best-hipobuy-coupons",
  "hipobuy-coupons-2026",
];

const pageTemplate = (slug) => `import { createAgentCouponLandingPage } from "@/lib/agent-coupon-landing-page";

const { generateMetadata, Page } = createAgentCouponLandingPage("${slug}");

export { generateMetadata };
export default Page;
`;

for (const slug of SLUGS) {
  const dir = path.join(appDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug));
  console.log("created", slug);
}
