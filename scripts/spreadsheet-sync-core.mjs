/**
 * Core spreadsheet sync — import new products only, never modify existing rows.
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

/**
 * @param {object} options
 * @param {boolean} [options.dryRun=false] - parse and report without writing products.json
 * @param {typeof SPREADSHEET_SHEETS} [options.sheets] - subset of tabs to scan
 * @param {number} [options.sheetDelayMs=2000] - pause between sheet fetches
 */
export async function runSpreadsheetSync({
  dryRun = false,
  sheets = SPREADSHEET_SHEETS,
  sheetDelayMs = 2000,
} = {}) {
  const existing = loadProducts();
  const existingLinks = new Set(
    existing.map((product) => canonicalLink(product.affiliate_link))
  );

  const report = {
    dryRun,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    added: 0,
    duplicatesSkipped: 0,
    failed: 0,
    failuresByReason: {},
    perSheet: {},
    catalogTotalBefore: existing.length,
    catalogTotalAfter: existing.length,
    newProducts: [],
  };

  let idCounter = Number(nextProductId(existing)) - 1;
  const merged = [...existing];
  const pendingProducts = [];

  for (const sheetMeta of sheets) {
    const sheetReport = {
      parsed: 0,
      added: 0,
      duplicates: 0,
      failed: 0,
    };

    try {
      const [html, priceQueues] = await Promise.all([
        fetchSheetHtml(sheetMeta.gid),
        fetchGvizPriceQueues(sheetMeta.sheet),
      ]);

      const parsed = dedupeByLink(parseSheetHtml(html)).map((row) => ({
        ...row,
        price: enrichPriceFromGviz(row, priceQueues),
      }));

      sheetReport.parsed = parsed.length;

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
        const product = buildCatalogProduct(
          row,
          sheetMeta,
          String(idCounter)
        );
        pendingProducts.push(product);
        existingLinks.add(linkKey);
        sheetReport.added++;
        report.added++;
      }
    } catch (error) {
      sheetReport.error = error.message;
    }

    report.perSheet[sheetMeta.slug] = sheetReport;

    if (sheetDelayMs > 0 && sheets.indexOf(sheetMeta) < sheets.length - 1) {
      await sleep(sheetDelayMs);
    }
  }

  if (report.added > 0 && !dryRun) {
    merged.push(...pendingProducts);
    saveProducts(merged);
    report.newProducts = pendingProducts.map((p) => ({
      id: p.id,
      name: p.product_name,
      category_slug: p.category_slug,
      affiliate_link: p.affiliate_link,
    }));
  } else if (dryRun && report.added > 0) {
    report.newProducts = pendingProducts.map((p) => ({
      id: "(pending)",
      name: p.product_name,
      category_slug: p.category_slug,
      affiliate_link: p.affiliate_link,
    }));
  }

  report.catalogTotalAfter = dryRun ? existing.length + report.added : merged.length;
  report.finishedAt = new Date().toISOString();

  return report;
}

export function formatSyncReport(report) {
  const lines = [
    `Spreadsheet sync ${report.dryRun ? "(dry run) " : ""}report`,
    `  Started:  ${report.startedAt}`,
    `  Finished: ${report.finishedAt}`,
    `  Added: ${report.added}`,
    `  Duplicates skipped: ${report.duplicatesSkipped}`,
    `  Failed: ${report.failed}`,
    `  Catalog: ${report.catalogTotalBefore} → ${report.catalogTotalAfter}`,
  ];

  if (Object.keys(report.failuresByReason).length > 0) {
    lines.push(`  Failure reasons: ${JSON.stringify(report.failuresByReason)}`);
  }

  lines.push("  Per sheet:");
  for (const [slug, stats] of Object.entries(report.perSheet)) {
    lines.push(
      `    ${slug}: parsed=${stats.parsed} added=${stats.added} duplicates=${stats.duplicates} failed=${stats.failed}${stats.error ? ` error=${stats.error}` : ""}`
    );
  }

  return lines.join("\n");
}
