#!/usr/bin/env node
/**
 * Resumable catalog image mirroring → Vercel Blob (public CDN).
 *
 * Usage:
 *   npm run images:mirror -- --dry-run
 *   npm run images:mirror
 *   npm run images:mirror -- --concurrency=6 --limit=100
 *
 * Requires BLOB_READ_WRITE_TOKEN in the environment (Vercel Blob public store).
 * Does NOT modify products.json original image URLs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  hasBlobCredentials,
  loadMirrorMap,
  mirrorMany,
} from "./image-mirror-core.mjs";
import { validateCatalogUrl } from "./url-policy.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PRODUCTS_PATH = path.join(ROOT, "src", "data", "products.json");

function parseArgs(argv) {
  const opts = {
    dryRun: argv.includes("--dry-run"),
    concurrency: 8,
    limit: 0,
    onlyFailed: argv.includes("--only-failed"),
  };
  for (const arg of argv) {
    const conc = arg.match(/^--concurrency=(\d+)$/);
    if (conc) opts.concurrency = Math.max(1, Math.min(25, Number(conc[1])));
    const limit = arg.match(/^--limit=(\d+)$/);
    if (limit) opts.limit = Number(limit[1]);
  }
  return opts;
}

function collectEligibleUrls() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, "utf8"));
  const urls = [];
  const seen = new Set();
  for (const product of products) {
    const raw = product.image;
    if (!raw) continue;
    const validation = validateCatalogUrl(raw, "image", {
      httpsOnly: true,
      requirePath: true,
    });
    if (!validation.valid) continue;
    if (seen.has(validation.normalized)) continue;
    seen.add(validation.normalized);
    urls.push(validation.normalized);
  }
  return urls;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const map = loadMirrorMap();
  const already = new Set(Object.keys(map.urls || {}));

  let urls = collectEligibleUrls();
  console.log(`Eligible catalog images: ${urls.length}`);
  console.log(`Already mirrored (map): ${already.size}`);

  if (!opts.onlyFailed) {
    urls = urls.filter((url) => !already.has(url));
  }

  if (opts.limit > 0) {
    urls = urls.slice(0, opts.limit);
  }

  console.log(
    `Queued this run: ${urls.length} (concurrency=${opts.concurrency}${opts.dryRun ? ", dry-run" : ""})`
  );

  if (!opts.dryRun && !hasBlobCredentials()) {
    console.error(`
ERROR: No Vercel Blob credentials found.

Configure a Public Blob store, then set:

  BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

In Vercel: Project → Storage → Create Blob (Public) → connect to this project.
For local/CI migration jobs, copy the token into .env.local (never commit it).

Aborting without uploads. Re-run with --dry-run to preview, or set the token.
`);
    process.exit(2);
  }

  let done = 0;
  const started = Date.now();
  const result = await mirrorMany(urls, {
    concurrency: opts.concurrency,
    dryRun: opts.dryRun,
    onProgress: ({ status, reason }) => {
      done += 1;
      if (done % 25 === 0 || status === "failed") {
        const tag = status === "failed" ? ` FAIL:${reason}` : "";
        console.log(`  [${done}/${urls.length}] ${status}${tag}`);
      }
    },
  });

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log("\nMirror run complete");
  console.log(`  uploaded: ${result.uploaded}`);
  console.log(`  exists:   ${result.exists}`);
  console.log(`  skipped:  ${result.skipped}`);
  console.log(`  dry-run:  ${result.dry}`);
  console.log(`  failed:   ${result.failed}`);
  console.log(`  elapsed:  ${seconds}s`);
  console.log(
    `\nNext: commit src/data/image-mirror-map.json after a successful upload run, then regenerate card props (npm run regenerate:catalog).`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
