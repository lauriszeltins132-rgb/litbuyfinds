import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAllowedAffiliateUrl,
  isAllowedQcUrl,
  safeHref,
  validateCatalogUrl,
} from "../url-policy";
import { serializeJsonLd } from "../safe-json-ld";
import { validateImageUrl } from "@/lib/image-url";

describe("catalog url policy", () => {
  it("allows current catalog image hosts", () => {
    assert.equal(
      validateImageUrl("https://i.postimg.cc/zzMm64y4/1.png").valid,
      true
    );
    assert.equal(
      validateCatalogUrl(
        "https://si.geilicdn.com/foo.jpg",
        "image"
      ).valid,
      true
    );
  });

  it("rejects javascript/data/private hosts", () => {
    assert.equal(validateCatalogUrl("javascript:alert(1)", "qc").valid, false);
    assert.equal(validateCatalogUrl("data:text/html,hi", "image").valid, false);
    assert.equal(
      validateCatalogUrl("https://127.0.0.1/x.png", "image").valid,
      false
    );
    assert.equal(
      validateCatalogUrl("https://192.168.1.1/x.png", "image").valid,
      false
    );
    assert.equal(
      validateCatalogUrl("https://evil.example/x.png", "image").valid,
      false
    );
  });

  it("allows telegram QC and litbuy affiliate product links", () => {
    assert.equal(isAllowedQcUrl("https://t.me/RNFinds"), true);
    assert.equal(
      isAllowedAffiliateUrl(
        "https://litbuy.com/product/weidian/123?inviteCode=SMKS"
      ),
      true
    );
    assert.equal(
      isAllowedAffiliateUrl("https://litbuy.com/register?inviteCode=SMKS"),
      false
    );
  });

  it("safeHref blanks unsafe QC urls", () => {
    assert.equal(safeHref("javascript:alert(1)", "qc"), "");
    assert.ok(safeHref("https://t.me/foo", "qc").startsWith("https://t.me/"));
  });
});

describe("json-ld serialization", () => {
  it("escapes script breakout sequences without changing meaning", () => {
    const html = serializeJsonLd({
      name: "</script><script>alert(1)</script>",
    });
    assert.equal(html.includes("</script>"), false);
    assert.ok(html.includes("\\u003c"));
    assert.deepEqual(JSON.parse(html), {
      name: "</script><script>alert(1)</script>",
    });
  });
});
