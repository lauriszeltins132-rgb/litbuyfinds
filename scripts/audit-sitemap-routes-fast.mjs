#!/usr/bin/env node
/** Fast sitemap audit — non-product routes only. */
const BASE = process.argv[2] ?? "http://127.0.0.1:3000";
const SITE_HOST = new URL(BASE).origin;

async function fetchPaths() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p) => !p.startsWith("/find/"));
}

async function check(path) {
  const res = await fetch(`${SITE_HOST}${path}`, { redirect: "manual" });
  return { path, status: res.status };
}

const paths = await fetchPaths();
console.log(`Checking ${paths.length} non-product sitemap paths...\n`);

const bad = [];
for (const path of paths) {
  const r = await check(path);
  if (r.status !== 200 && r.status !== 301 && r.status !== 308) {
    bad.push(r);
    console.log(`${r.status} ${path}`);
  }
}

if (bad.length === 0) {
  console.log(`OK: all ${paths.length} non-product paths return 200/301/308`);
} else {
  console.log(`\nFAIL: ${bad.length} bad paths`);
  process.exit(1);
}
