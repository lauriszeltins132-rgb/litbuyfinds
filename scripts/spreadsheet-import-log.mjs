/**
 * Append-only import log for spreadsheet sync runs.
 * Stored at data/spreadsheet-import-log.json (committed after automated sync).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LOG_PATH = path.join(__dirname, "..", "data", "spreadsheet-import-log.json");
const MAX_ENTRIES = 50;

export function loadImportLog() {
  if (!fs.existsSync(LOG_PATH)) {
    return { runs: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
  } catch {
    return { runs: [] };
  }
}

/**
 * @param {object} report - output from runSpreadsheetSync
 * @param {string} trigger - e.g. "github-actions", "manual", "vercel-cron-check"
 */
export function appendImportLog(report, trigger) {
  const log = loadImportLog();
  const entry = {
    timestamp: report.finishedAt ?? new Date().toISOString(),
    trigger,
    dryRun: Boolean(report.dryRun),
    added: report.added,
    duplicatesSkipped: report.duplicatesSkipped,
    failed: report.failed,
    failuresByReason: report.failuresByReason,
    catalogTotalBefore: report.catalogTotalBefore,
    catalogTotalAfter: report.catalogTotalAfter,
    perSheet: report.perSheet,
  };

  log.runs.unshift(entry);
  log.runs = log.runs.slice(0, MAX_ENTRIES);

  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), "utf8");

  return entry;
}
