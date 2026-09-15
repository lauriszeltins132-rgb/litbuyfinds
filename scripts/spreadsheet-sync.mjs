#!/usr/bin/env node
/**
 * Full automated spreadsheet sync:
 * 1. Import new products from all tabs (append-only)
 * 2. Mirror new product images to Vercel Blob when credentials exist
 * 3. Regenerate catalog manifests when products were added
 * 4. Append run to data/spreadsheet-import-log.json
 *
 * Run: npm run spreadsheet:sync
 * Dry run: npm run spreadsheet:sync -- --dry-run
 *
 * Does NOT overwrite original image URLs in products.json.
 */
import { appendImportLog } from "./spreadsheet-import-log.mjs";
import { regenerateCatalogManifests } from "./regenerate-catalog-manifests.mjs";
import {
  formatSyncReport,
  runSpreadsheetSync,
} from "./spreadsheet-sync-core.mjs";

const dryRun = process.argv.includes("--dry-run");
const trigger = process.env.SYNC_TRIGGER ?? (dryRun ? "dry-run" : "manual");

async function mirrorNewProductImages(report) {
  const { hasBlobCredentials, mirrorMany } = await import(
    "./image-mirror-core.mjs"
  );
  if (!hasBlobCredentials()) {
    console.log(
      "\nImage mirror skipped (set BLOB_READ_WRITE_TOKEN to mirror on sync)."
    );
    return;
  }

  const urls = [
    ...new Set(
      (report.newProducts || [])
        .map((product) => product.image)
        .filter(Boolean)
    ),
  ];
  if (urls.length === 0) {
    console.log("\nNo new product images to mirror.");
    return;
  }

  console.log(`\nMirroring ${urls.length} new product image(s)…`);
  const result = await mirrorMany(urls, { concurrency: 6, dryRun: false });
  console.log(
    `  mirror uploaded=${result.uploaded} exists=${result.exists} failed=${result.failed}`
  );
}

async function main() {
  console.log(
    dryRun
      ? "Spreadsheet sync (dry run — no files will be written)…"
      : "Spreadsheet sync starting…"
  );

  const report = await runSpreadsheetSync({ dryRun });
  console.log("\n" + formatSyncReport(report));

  if (!dryRun) {
    appendImportLog(report, trigger);

    if (report.added > 0) {
      await mirrorNewProductImages(report);

      console.log("\nNew products detected — regenerating manifests…");
      await regenerateCatalogManifests();
      console.log(
        "\nDone. Commit changes and deploy to publish new product pages."
      );
    } else {
      console.log("\nNo new products — manifests unchanged.");
    }
  } else {
    console.log("\nDry run complete. No files modified.");
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
