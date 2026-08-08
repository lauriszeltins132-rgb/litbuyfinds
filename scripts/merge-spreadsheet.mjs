#!/usr/bin/env node
/**
 * Merge new products from all LitBuy spreadsheet tabs into products.json.
 * Only appends products whose affiliate_link is not already in the catalog.
 *
 * Run: npm run merge:spreadsheet
 */
import {
  SPREADSHEET_SHEETS,
  buildCatalogProduct,
  canonicalLink,
  dedupeByLink,
  enrichPriceFromGviz,
  fetchGvizPriceQueues,
  fetchSheetHtml,
  loadProducts,
  nextProductId,
  parseSheetHtml,
  saveProducts,
  validateImportRow,
} from "./spreadsheet-import-shared.mjs";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const existing = loadProducts();
  const existingLinks = new Set(
    existing.map((product) => canonicalLink(product.affiliate_link))
  );

  const report = {
    added: 0,
    duplicatesSkipped: 0,
    failed: 0,
    failuresByReason: {},
    perSheet: {},
  };

  let idCounter = Number(nextProductId(existing)) - 1;
  const merged = [...existing];

  for (const sheetMeta of SPREADSHEET_SHEETS) {
    const sheetReport = {
      parsed: 0,
      added: 0,
      duplicates: 0,
      failed: 0,
    };

    console.log(`\nFetching ${sheetMeta.sheet} (gid=${sheetMeta.gid})…`);

    try {
      const [html, priceQueues] = await Promise.all([
        fetchSheetHtml(sheetMeta.gid),
        fetchGvizPriceQueues(sheetMeta.sheet),
      ]);

      const parsed = dedupeByLink(parseSheetHtml(html))
        .map((row) => ({
          ...row,
          price: enrichPriceFromGviz(row, priceQueues),
        }));

      sheetReport.parsed = parsed.length;
      console.log(`  Parsed ${parsed.length} row-aligned products`);

      for (const row of parsed) {
        const linkKey = canonicalLink(row.affiliate_link);
        if (!linkKey) {
          sheetReport.failed++;
          report.failed++;
          report.failuresByReason.invalid_link =
            (report.failuresByReason.invalid_link ?? 0) + 1;
          continue;
        }

        if (existingLinks.has(linkKey)) {
          sheetReport.duplicates++;
          report.duplicatesSkipped++;
          continue;
        }

        const validation = validateImportRow(row);
        if (!validation.ok) {
          sheetReport.failed++;
          report.failed++;
          report.failuresByReason[validation.reason] =
            (report.failuresByReason[validation.reason] ?? 0) + 1;
          continue;
        }

        idCounter += 1;
        merged.push(
          buildCatalogProduct(row, sheetMeta, String(idCounter))
        );
        existingLinks.add(linkKey);
        sheetReport.added++;
        report.added++;
      }
    } catch (error) {
      console.error(`  Sheet import failed: ${error.message}`);
      sheetReport.error = error.message;
    }

    report.perSheet[sheetMeta.slug] = sheetReport;
    await sleep(2000);
  }

  if (report.added > 0) {
    saveProducts(merged);
  }

  console.log("\n=== Spreadsheet merge report ===");
  console.log(`New products added: ${report.added}`);
  console.log(`Duplicates skipped: ${report.duplicatesSkipped}`);
  console.log(`Failed / broken entries: ${report.failed}`);
  if (Object.keys(report.failuresByReason).length > 0) {
    console.log("Failure reasons:", report.failuresByReason);
  }
  console.log(`Catalog total: ${merged.length}`);
  console.log("\nPer sheet:");
  for (const [slug, stats] of Object.entries(report.perSheet)) {
    console.log(
      `  ${slug}: parsed=${stats.parsed} added=${stats.added} duplicates=${stats.duplicates} failed=${stats.failed}${stats.error ? ` error=${stats.error}` : ""}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
