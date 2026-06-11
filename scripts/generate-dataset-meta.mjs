#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const datasetPath = path.join(root, "src/data/products.json");
const outDir = path.join(root, "src/generated");
const outFile = path.join(outDir, "dataset-meta.ts");

const iso = fs.statSync(datasetPath).mtime.toISOString();
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  outFile,
  `// Auto-generated — do not edit manually\nexport const DATASET_SYNCED_ISO = "${iso}";\n`
);
console.log("Dataset meta:", iso);
