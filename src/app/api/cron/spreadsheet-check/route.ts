import { readFileSync } from "fs";
import path from "path";
import { assertCronAuthorized } from "@/lib/ai/rate-limit";
import { getAllProducts } from "@/lib/products";

export const runtime = "nodejs";
export const maxDuration = 120;

const LOG_PATH = path.join(process.cwd(), "data", "spreadsheet-import-log.json");

function readLastImportLog() {
  try {
    const raw = readFileSync(LOG_PATH, "utf8");
    const log = JSON.parse(raw) as { runs?: Array<Record<string, unknown>> };
    return log.runs?.[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Weekly spreadsheet health check (dry run on Latest Finds + Trending tabs).
 * Does NOT modify the catalog — full imports run via GitHub Actions.
 *
 * Auth: Authorization: Bearer $CRON_SECRET
 */
export async function GET(request: Request) {
  if (!assertCronAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date().toISOString();

  try {
    const { spawn } = await import("child_process");
    const scriptPath = path.join(process.cwd(), "scripts", "spreadsheet-check.mjs");

    const stdout = await new Promise<string>((resolve, reject) => {
      const child = spawn("node", [scriptPath], {
        cwd: process.cwd(),
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
      });

      let out = "";
      let err = "";
      child.stdout.on("data", (chunk) => {
        out += chunk.toString();
      });
      child.stderr.on("data", (chunk) => {
        err += chunk.toString();
      });
      child.on("close", (code) => {
        if (code === 0) resolve(out);
        else reject(new Error(err || `spreadsheet-check exited with code ${code}`));
      });
    });

    const check = JSON.parse(stdout.trim()) as Record<string, unknown>;
    const lastImport = readLastImportLog();

    return Response.json({
      ...check,
      checkedAt: startedAt,
      catalogProductCount: getAllProducts().length,
      lastAutomatedImport: lastImport,
      note:
        "Dry-run check only. Production imports: GitHub Actions workflow 'Spreadsheet sync' (monthly) or `npm run spreadsheet:sync` locally.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      {
        ok: false,
        job: "spreadsheet-check",
        checkedAt: startedAt,
        catalogProductCount: getAllProducts().length,
        lastAutomatedImport: readLastImportLog(),
        error: message,
      },
      { status: 500 }
    );
  }
}
