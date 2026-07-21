#!/usr/bin/env node
import assert from "node:assert/strict";
import { describe, it } from "node:test";

const ALLOWED_HOSTS = new Set([
  "i.postimg.cc",
  "postimg.cc",
  "si.geilicdn.com",
  "cbu01.alicdn.com",
  "img.alicdn.com",
]);

function validateImageUrl(raw) {
  const normalized = String(raw ?? "").trim();
  if (!normalized) return { valid: false, issue: "empty" };
  let parsed;
  try {
    parsed = new URL(normalized.startsWith("//") ? `https:${normalized}` : normalized);
  } catch {
    return { valid: false, issue: "malformed" };
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
    return { valid: false, issue: "invalid_host" };
  }
  return { valid: true, normalized: parsed.href };
}

function buildCandidates(preferred, source, fallbacks = []) {
  const ordered = [preferred, source, ...fallbacks].filter(Boolean);
  const seen = new Set();
  const unique = [];
  for (const url of ordered) {
    if (seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }
  return unique;
}

function classifySurface(showingProcessed, whiteBlank = 0) {
  if (showingProcessed) return "t";
  if (whiteBlank >= 0.18) return "l";
  return "n";
}

function categoryFill(slug) {
  if (slug.includes("sneaker") || slug === "shoes") return "product-float-asset--fill-shoes";
  if (slug.includes("bag")) return "product-float-asset--fill-bags";
  return "product-float-asset--fill-balanced";
}

describe("product image pipeline", () => {
  it("rejects localhost URLs (SSRF protection)", () => {
    const result = validateImageUrl("https://localhost/evil.png");
    assert.equal(result.valid, false);
    assert.equal(result.issue, "invalid_host");
  });

  it("rejects private IP ranges", () => {
    const result = validateImageUrl("http://192.168.1.1/img.png");
    assert.equal(result.valid, false);
  });

  it("deduplicates candidate URLs", () => {
    const candidates = buildCandidates(
      "/processed/a.png",
      "https://i.postimg.cc/x.png",
      ["https://i.postimg.cc/x.png", "/processed/b.png"]
    );
    assert.deepEqual(candidates, [
      "/processed/a.png",
      "https://i.postimg.cc/x.png",
      "/processed/b.png",
    ]);
  });

  it("prefers processed cutout as first candidate", () => {
    const candidates = buildCandidates(
      "/processed/a.png",
      "https://i.postimg.cc/x.png"
    );
    assert.equal(candidates[0], "/processed/a.png");
  });

  it("classifies white-background surfaces", () => {
    assert.equal(classifySurface(false, 0.25), "l");
    assert.equal(classifySurface(true), "t");
  });

  it("applies category fill presets", () => {
    assert.equal(categoryFill("sneakers"), "product-float-asset--fill-shoes");
    assert.equal(categoryFill("bags"), "product-float-asset--fill-bags");
  });

  it("rejects tiny dimensions", () => {
    const ok = (w, h) => w >= 24 && h >= 24;
    assert.equal(ok(400, 400), true);
    assert.equal(ok(12, 12), false);
  });
});
