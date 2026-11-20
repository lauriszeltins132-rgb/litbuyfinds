import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getHomepageRails } from "@/lib/homepage-rails";
import { prioritizeHomepageMobileRails } from "@/lib/homepage-mobile-priority";
import {
  orderSpreadsheetMobileFirst,
  spreadsheetMobileProductsNewestFirst,
} from "@/lib/spreadsheet-mobile-order";
import mobilePriority from "@/data/spreadsheet-mobile-priority.json";
import type { Product } from "@/lib/types";

const orderedIds = mobilePriority.orderedIds as string[];
const newestId = orderedIds[orderedIds.length - 1];
const oldestId = orderedIds[0];

describe("mobile priority order", () => {
  it("leads with the last imported Mobile row", () => {
    const newest = spreadsheetMobileProductsNewestFirst();
    assert.equal(newest[0]?.id, newestId);
    assert.equal(newest.at(-1)?.id, oldestId);
    assert.equal(newest.length, orderedIds.length);
  });

  it("keeps historical products after every Mobile product", () => {
    const historical = {
      id: "not-mobile",
      product_name: "Historical",
      category: "Shoes",
      category_slug: "shoes",
      sheet: "old",
      group: "category",
      price: 40,
      affiliate_link: "https://litbuy.com/product/weidian/1?inviteCode=SMKS",
      qc_link: "",
      image: "https://i.postimg.cc/example.png",
    } as Product;
    const ordered = orderSpreadsheetMobileFirst([
      historical,
      ...spreadsheetMobileProductsNewestFirst(),
    ]);
    assert.equal(ordered[0]?.id, newestId);
    assert.equal(ordered.at(-1)?.id, "not-mobile");
    assert.ok(ordered.findIndex((product) => product.id === oldestId) < ordered.length - 1);
  });

  it("refreshes homepage rails without touching analytics or QC picks", () => {
    const base = getHomepageRails(12);
    const rails = prioritizeHomepageMobileRails(base, 12);
    const ids = (products: { id: string }[]) => products.map((product) => product.id);

    assert.deepEqual(ids(rails.popularToday), ids(base.popularToday));
    assert.deepEqual(ids(rails.popularWeek), ids(base.popularWeek));
    assert.deepEqual(ids(rails.editorsPicks), ids(base.editorsPicks));

    assert.equal(rails.latestFinds[0]?.id, newestId);
    assert.equal(rails.latestFinds.length, 12);
    assert.ok(rails.bestUnder20.slice(0, 8).every((product) => orderedIds.includes(product.id)));
    assert.ok(
      rails.bestUnder20.slice(0, 8).every((product) => (product.price ?? 0) <= 20)
    );

    const seen = new Set<string>();
    for (const product of [
      ...rails.latestFinds,
      ...rails.bestUnder20,
      ...rails.latestLitBuyFinds,
      ...rails.trendingSneakers,
      ...rails.jacketsOuterwear,
      ...rails.hoodiesPants,
      ...rails.accessories,
    ]) {
      assert.equal(seen.has(product.id), false, product.id);
      seen.add(product.id);
    }

    assert.ok(rails.trendingSneakers.some((product) => product.category_slug === "shoes" && orderedIds.includes(product.id)));
    assert.ok(rails.accessories.some((product) => orderedIds.includes(product.id)));
    assert.ok(rails.jacketsOuterwear.some((product) => orderedIds.includes(product.id)));
    assert.ok(rails.hoodiesPants.some((product) => orderedIds.includes(product.id)));
  });
});
