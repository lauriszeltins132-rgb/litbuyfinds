#!/usr/bin/env node
/**
 * Merge new products from all LitBuy spreadsheet tabs into products.json.
 * Only appends products whose affiliate_link is not already in the catalog.
 *
 * Run: npm run merge:spreadsheet
 */
import {
  formatSyncReport,
  runSpreadsheetSync,
} from "./spreadsheet-sync-core.mjs";

async function main() {
  const report = await runSpreadsheetSync({ dryRun: false });
  console.log(formatSyncReport(report));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
