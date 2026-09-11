#!/usr/bin/env node
/**
 * Dev-only sample audit of catalog image hosts.
 * Usage: node scripts/audit-image-hosts.mjs
 * Does NOT run in production builds. Keep sample small to avoid hammering hosts.
 */

import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "../src/data/products.json");
const PER_HOST = 20;
const TIMEOUT_MS = 10_000;
const CONCURRENCY = 4;

const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const byHost = new Map();

for (const product of products) {
  const raw = typeof product.image === "string" ? product.image.trim() : "";
  if (!raw) continue;
  let host;
  try {
    host = new URL(raw).hostname;
  } catch {
    continue;
  }
  if (!byHost.has(host)) byHost.set(host, []);
  const list = byHost.get(host);
  if (list.length < PER_HOST) list.push(raw);
}

function probe(url) {
  return new Promise((resolve) => {
    const started = Date.now();
    let done = false;
    const finish = (result) => {
      if (done) return;
      done = true;
      resolve({ ...result, ms: Date.now() - started });
    };

    try {
      const lib = url.startsWith("http:") ? http : https;
      const req = lib.request(
        url,
        {
          method: "GET",
          timeout: TIMEOUT_MS,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; LitBuyFindsImageAudit/1.0; +https://litbuyfinds.io)",
            Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
            Referer: "https://litbuyfinds.io/",
          },
        },
        (res) => {
          res.resume();
          const status = res.statusCode || 0;
          finish({
            status,
            ok: status >= 200 && status < 400,
            err: null,
          });
        }
      );
      req.on("timeout", () => {
        req.destroy();
        finish({ status: 0, ok: false, err: "timeout" });
      });
      req.on("error", (error) => {
        finish({ status: 0, ok: false, err: error.code || error.message });
      });
      req.end();
    } catch (error) {
      finish({ status: 0, ok: false, err: String(error.message || error) });
    }
  });
}

const samples = [];
for (const [host, urls] of byHost.entries()) {
  for (const url of urls) samples.push({ host, url });
}

const results = [];
let index = 0;

async function worker() {
  while (index < samples.length) {
    const current = samples[index++];
    const result = await probe(current.url);
    results.push({ ...current, ...result });
    process.stdout.write(".");
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
process.stdout.write("\n\n");

const report = {};
for (const row of results) {
  if (!report[row.host]) {
    report[row.host] = {
      total: 0,
      success: 0,
      timeout: 0,
      status403: 0,
      status404: 0,
      status429: 0,
      status5xx: 0,
      otherFail: 0,
      avgMs: 0,
    };
  }
  const bucket = report[row.host];
  bucket.total += 1;
  bucket.avgMs += row.ms;
  if (row.ok) bucket.success += 1;
  else if (row.err === "timeout") bucket.timeout += 1;
  else if (row.status === 403) bucket.status403 += 1;
  else if (row.status === 404) bucket.status404 += 1;
  else if (row.status === 429) bucket.status429 += 1;
  else if (row.status >= 500) bucket.status5xx += 1;
  else bucket.otherFail += 1;
}

for (const bucket of Object.values(report)) {
  bucket.avgMs = Math.round(bucket.avgMs / Math.max(1, bucket.total));
}

console.log(JSON.stringify(report, null, 2));
