#!/usr/bin/env node
/**
 * Manual security health check (read-only). NOT a public endpoint.
 *
 * Usage: node scripts/security-health-check.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const findings = [];

function note(level, message) {
  findings.push({ level, message });
  const tag = level === "ok" ? "OK" : level.toUpperCase();
  console.log(`[${tag}] ${message}`);
}

function walk(dir, filter, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === ".git"
    ) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, filter, out);
    else if (filter(full)) out.push(full);
  }
  return out;
}

function main() {
  console.log("LitBuyFinds security health check (read-only)\n");

  // 1) Security headers present in next.config
  const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
  for (const header of [
    "Content-Security-Policy",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "frame-ancestors",
  ]) {
    if (nextConfig.includes(header)) note("ok", `Header/policy present: ${header}`);
    else note("warn", `Missing header/policy reference: ${header}`);
  }

  // 2) Public API routes inventory
  const apiRoot = path.join(ROOT, "src", "app", "api");
  const routes = walk(apiRoot, (f) => f.endsWith("route.ts")).map((f) =>
    path.relative(path.join(ROOT, "src", "app"), f).replace(/\\/g, "/")
  );
  note("ok", `API route files: ${routes.length}`);
  for (const route of routes.sort()) {
    console.log(`  - ${route}`);
  }

  // 3) Unexpected service worker / suspicious script tags in source
  const sourceFiles = walk(
    path.join(ROOT, "src"),
    (f) => /\.(ts|tsx|js|jsx|html)$/.test(f)
  );
  let swHits = 0;
  let suspiciousScript = 0;
  const externalHosts = new Map();

  for (const file of sourceFiles) {
    const text = fs.readFileSync(file, "utf8");
    if (/navigator\.serviceWorker|serviceWorker\.register/i.test(text)) {
      swHits += 1;
      note("warn", `Service worker reference: ${path.relative(ROOT, file)}`);
    }
    if (/<script[^>]+src=["']https?:\/\//i.test(text)) {
      suspiciousScript += 1;
      note("warn", `External script tag: ${path.relative(ROOT, file)}`);
    }
    for (const match of text.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)) {
      const host = match[1].toLowerCase();
      externalHosts.set(host, (externalHosts.get(host) ?? 0) + 1);
    }
  }
  if (swHits === 0) note("ok", "No service worker registration found in src/");
  if (suspiciousScript === 0) {
    note("ok", "No hard-coded external <script src> tags in src/");
  }

  // 4) Dependencies snapshot
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  note("ok", `Dependency count: ${Object.keys(deps).length}`);
  if (deps.xlsx) {
    note(
      "warn",
      "xlsx is present — known Prototype Pollution / ReDoS advisories; no safe upstream patch. Keep spreadsheet ingest server-side only."
    );
  }

  // 5) Allowlist file present
  const allowlistPath = path.join(ROOT, "src", "data", "url-allowlists.json");
  if (fs.existsSync(allowlistPath)) {
    const allow = JSON.parse(fs.readFileSync(allowlistPath, "utf8"));
    note(
      "ok",
      `URL allowlists loaded (image=${allow.imageHosts.length}, qc=${allow.qcHosts.length}, affiliate=${allow.affiliateHosts.length})`
    );
  } else {
    note("warn", "url-allowlists.json missing");
  }

  // 6) NEXT_PUBLIC_ secret smell (names only)
  const envExample = fs.readFileSync(path.join(ROOT, ".env.example"), "utf8");
  for (const line of envExample.split("\n")) {
    if (/^NEXT_PUBLIC_.*(SECRET|KEY|TOKEN|PASSWORD)/i.test(line)) {
      note("warn", `Suspicious NEXT_PUBLIC name in .env.example: ${line.split("=")[0]}`);
    }
  }
  note("ok", "Env example scanned for NEXT_PUBLIC secret names");

  // 7) Top external hosts (informational)
  const top = [...externalHosts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25);
  console.log("\nTop external hosts referenced in src/ (informational):");
  for (const [host, count] of top) {
    console.log(`  ${host}: ${count}`);
  }

  const warns = findings.filter((f) => f.level === "warn").length;
  console.log(`\nDone. warnings=${warns}`);
  process.exit(0);
}

main();
