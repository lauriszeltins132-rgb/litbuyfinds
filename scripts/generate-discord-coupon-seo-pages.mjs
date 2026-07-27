#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src/app");

const AGENT_SLUGS = ["litbuy", "kakobuy", "mulebuy", "hipobuy", "oopbuy"];

const DISCORD_SLUGS = AGENT_SLUGS.map((slug) => `discord-${slug}`);

const COUPON_SLUGS = AGENT_SLUGS.flatMap((slug) => [
  `${slug}-coupons`,
  `best-${slug}-coupons`,
  `${slug}-coupons-2026`,
]);

const discordPageTemplate = (slug) => `import { createDiscordSeoPage } from "@/lib/discord-seo-page";

const { generateMetadata, Page } = createDiscordSeoPage("${slug}");

export { generateMetadata };
export default Page;
`;

const couponPageTemplate = (slug) => `import { createCouponSeoPage } from "@/lib/coupon-seo-page";

const { generateMetadata, Page } = createCouponSeoPage("${slug}");

export { generateMetadata };
export default Page;
`;

function writePage(slug, template) {
  const dir = path.join(appDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), template(slug));
}

for (const slug of DISCORD_SLUGS) {
  writePage(slug, discordPageTemplate);
  console.log("created discord", slug);
}

for (const slug of COUPON_SLUGS) {
  writePage(slug, couponPageTemplate);
  console.log("created coupon", slug);
}

console.log(
  `Done. ${DISCORD_SLUGS.length} Discord pages, ${COUPON_SLUGS.length} coupon pages.`
);
