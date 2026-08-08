#!/usr/bin/env node
/**
 * Dry-run spreadsheet check — outputs JSON report to stdout.
 * Used by /api/cron/spreadsheet-check on Vercel.
 */
import { SPREADSHEET_SHEETS } from "./spreadsheet-import-shared.mjs";
import { runSpreadsheetSync } from "./spreadsheet-sync-core.mjs";

const quickSheets = SPREADSHEET_SHEETS.filter((sheet) =>
  ["latest-finds", "trending-now"].includes(sheet.slug)
);

const report = await runSpreadsheetSync({
  dryRun: true,
  sheets: quickSheets,
  sheetDelayMs: 1000,
});

const output = {
  ok: true,
  job: "spreadsheet-check",
  mode: "dry-run",
  pendingImport: report.added,
  duplicatesSkipped: report.duplicatesSkipped,
  failed: report.failed,
  catalogTotal: report.catalogTotalBefore,
  perSheet: report.perSheet,
  startedAt: report.startedAt,
  finishedAt: report.finishedAt,
};

console.log(JSON.stringify(output));
