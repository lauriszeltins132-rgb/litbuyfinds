#!/usr/bin/env node
/**
 * One-time / resumable batch reprocessing for LitBuy catalog images.
 *
 * Usage:
 *   node scripts/reprocess-product-images.mjs
 *   node scripts/reprocess-product-images.mjs --batch-size=40 --concurrency=3
 *   node scripts/reprocess-product-images.mjs --resume
 *
 * Pipeline:
 * 1. Regenerate bright-bg + image-quality manifests
 * 2. Process catalog images (trim + optional background removal)
 * 3. Regenerate damaged-processed manifest
 * 4. Regenerate card display props
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const statePath = path.join(root, "src/data/image-reprocess-state.json");

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    batchSize: 40,
    concurrency: 3,
    resume: false,
  };
  for (const arg of args) {
    if (arg === "--resume") options.resume = true;
    if (arg.startsWith("--batch-size=")) {
      options.batchSize = Number(arg.split("=")[1]) || options.batchSize;
    }
    if (arg.startsWith("--concurrency=")) {
      options.concurrency = Number(arg.split("=")[1]) || options.concurrency;
    }
  }
  return options;
}

function runStep(label, command, extraEnv = {}) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(command, {
    cwd: root,
    shell: true,
    stdio: "inherit",
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    throw new Error(`Step failed: ${label}`);
  }
}

function loadState() {
  if (!fs.existsSync(statePath)) {
    return { completedSteps: [], startedAt: new Date().toISOString() };
  }
  return JSON.parse(fs.readFileSync(statePath, "utf8"));
}

function saveState(state) {
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function main() {
  const options = parseArgs();
  const state = options.resume ? loadState() : { completedSteps: [], startedAt: new Date().toISOString() };
  const steps = [
    ["bright-bg", "node scripts/generate-bright-bg-manifest.mjs"],
    ["image-quality", "node scripts/generate-image-quality-manifest.mjs"],
    [
      "process-catalog",
      "node scripts/process-catalog-images.mjs",
    ],
    ["damaged-manifest", "node scripts/generate-damaged-processed-manifest.mjs"],
    ["card-props", "node scripts/generate-card-props.mjs"],
  ];

  const report = {
    startedAt: state.startedAt,
    finishedAt: null,
    steps: [],
    options,
  };

  for (const [id, command] of steps) {
    if (state.completedSteps.includes(id)) {
      console.log(`⏭ Skipping ${id} (already completed)`);
      report.steps.push({ id, status: "skipped" });
      continue;
    }
    try {
      runStep(id, command, {
        IMAGE_BATCH_SIZE: String(options.batchSize),
        IMAGE_CONCURRENCY: String(options.concurrency),
      });
      state.completedSteps.push(id);
      saveState(state);
      report.steps.push({ id, status: "ok" });
    } catch (error) {
      report.steps.push({ id, status: "failed", error: String(error) });
      report.finishedAt = new Date().toISOString();
      fs.writeFileSync(
        path.join(root, "src/data/image-reprocess-report.json"),
        JSON.stringify(report, null, 2)
      );
      process.exit(1);
    }
  }

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(
    path.join(root, "src/data/image-reprocess-report.json"),
    JSON.stringify(report, null, 2)
  );
  fs.unlinkSync(statePath);
  console.log("\n✓ Image reprocessing complete. Report → src/data/image-reprocess-report.json");
}

main();
