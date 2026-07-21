#!/usr/bin/env node
const BASE = "http://127.0.0.1:3000";
const res = await fetch(`${BASE}/sitemap.xml`);
const xml = await res.text();
const paths = [...xml.matchAll(/<loc>https:\/\/litbuyfinds\.io([^<]*)<\/loc>/g)].map(
  (m) => m[1] || "/"
);

const nonProduct = paths.filter((p) => !p.startsWith("/find/"));
const bad = [];

for (const path of nonProduct) {
  try {
    const r = await fetch(`${BASE}${path}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
    });
    if (r.status !== 200 && r.status !== 301 && r.status !== 308) {
      bad.push({ path, status: r.status });
      console.log(`${r.status} ${path}`);
    }
  } catch (e) {
    bad.push({ path, status: "ERR" });
    console.log(`ERR ${path}`);
  }
}

console.log(`\nChecked ${nonProduct.length} paths. Bad: ${bad.length}`);
if (bad.length) process.exit(1);
