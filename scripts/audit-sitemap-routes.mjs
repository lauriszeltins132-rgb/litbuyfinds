#!/usr/bin/env node
/**
 * Audit sitemap URLs against a running Next.js server.
 * Usage: node scripts/audit-sitemap-routes.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const SITE_HOST = new URL(BASE).origin;

async function fetchSitemapUrls() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
    const parsed = new URL(m[1]);
    return `${SITE_HOST}${parsed.pathname}`;
  });
  return urls;
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { redirect: "manual" });
    return { url, status: res.status };
  } catch (err) {
    return { url, status: 0, error: String(err) };
  }
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`Checking ${urls.length} sitemap URLs against ${BASE}...\n`);

  const results = [];
  const batchSize = 20;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
  }

  const byStatus = new Map();
  for (const r of results) {
    const key = r.status;
    if (!byStatus.has(key)) byStatus.set(key, []);
    byStatus.get(key).push(r.url);
  }

  for (const [status, list] of [...byStatus.entries()].sort((a, b) => a[0] - b[0])) {
    console.log(`\n=== HTTP ${status} (${list.length}) ===`);
    for (const u of list.slice(0, 30)) console.log(u);
    if (list.length > 30) console.log(`... and ${list.length - 30} more`);
  }

  const bad = results.filter((r) => r.status !== 200 && r.status !== 301 && r.status !== 308);
  if (bad.length > 0) {
    console.log(`\nFAIL: ${bad.length} non-200/301/308 URLs`);
    process.exit(1);
  }
  console.log(`\nOK: all ${results.length} URLs return 200, 301, or 308`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
