#!/usr/bin/env node
/**
 * Regenerate catalog-derived manifests after products.json changes.
 * Subset of npm run build — skips Next.js compile and SEO page generation.
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const STEPS = [
  "generate-dataset-meta.mjs",
  "generate-search-index.mjs",
  "generate-site-navigation.mjs",
  "generate-dead-image-manifest.mjs",
  "generate-damaged-processed-manifest.mjs",
  "generate-image-quality-manifest.mjs",
  "generate-card-props.mjs",
];

function run(script) {
  const scriptPath = path.join(__dirname, script);
  console.log(`\n→ node scripts/${script}`);
  const result = spawnSync("node", [scriptPath], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(`Manifest step failed: ${script}`);
  }
}

export function regenerateCatalogManifests() {
  console.log("Regenerating catalog manifests…");
  for (const step of STEPS) {
    run(step);
  }
  console.log("\nCatalog manifests updated.");
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  regenerateCatalogManifests();
}
