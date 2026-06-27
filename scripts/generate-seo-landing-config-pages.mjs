#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const appDir = path.join(root, "src/app");
const configPath = path.join(root, "src/lib/seo-landing-config.ts");

const configSource = fs.readFileSync(configPath, "utf8");
const slugMatches = [...configSource.matchAll(/^\s{2}"([^"]+)":\s*\{/gm)];
const SLUGS = slugMatches.map((match) => match[1]);

if (SLUGS.length === 0) {
  console.error("No slugs found in seo-landing-config.ts");
  process.exit(1);
}

const pageTemplate = (slug) => `import { createSeoLandingConfigPage } from "@/lib/seo-landing-config-page";

const { generateMetadata, Page } = createSeoLandingConfigPage("${slug}");

export { generateMetadata };
export default Page;
`;

for (const slug of SLUGS) {
  const dir = path.join(appDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "page.tsx"), pageTemplate(slug));
  console.log("created seo-landing-config", slug);
}
