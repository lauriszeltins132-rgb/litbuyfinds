import { parseSearchIntent } from "../src/lib/ai/query-parser.ts";
import {
  searchCatalog,
  buildHaulFromCatalog,
  findSimilarProducts,
} from "../src/lib/ai/product-search.ts";
import { getAllProducts } from "../src/lib/products.ts";
import { rehydratePublicProducts } from "../src/lib/ai/grounding.ts";

const queries = [
  "black sneakers under $45",
  "hoodie under $30",
  "summer outfit under $100",
  "cheap football jersey",
  "black bag",
  "jordan 4",
  "xyznonexistentproduct123",
];

for (const q of queries) {
  const intent = parseSearchIntent(q, 8);
  const r = searchCatalog(intent);
  const products = rehydratePublicProducts(r.products);
  const over = products.filter(
    (p) => intent.maxPrice != null && (p.price ?? Infinity) > intent.maxPrice
  );
  console.log(
    JSON.stringify({
      q,
      total: r.total,
      shown: products.length,
      relaxed: r.relaxedFilters,
      maxPrice: intent.maxPrice,
      overBudget: over.length,
      sample: products.slice(0, 2).map((p) => ({
        id: p.id,
        price: p.price,
        name: p.name.slice(0, 40),
      })),
    })
  );
}

const seed = getAllProducts().find((p) => p.category_slug === "shoes");
if (seed) {
  const sim = findSimilarProducts({
    productId: seed.id,
    cheaperOnly: true,
    limit: 5,
  });
  console.log(
    "similar_cheaper",
    JSON.stringify({
      seed: seed.id,
      seedPrice: seed.price,
      count: sim.products.length,
      includesSeed: sim.products.some((p) => p.id === seed.id),
    })
  );
}

const haul = buildHaulFromCatalog({
  budget: 100,
  query: "summer",
  maximumItems: 5,
});
console.log(
  "haul",
  JSON.stringify({
    subtotal: haul.subtotal,
    items: haul.products.length,
    remaining: haul.remainingBudget,
  })
);
