import type { Product } from "./types";
import { extractBrand } from "./brands";
import { formatPrice } from "./currency";
import { getProductSource } from "./filters";

type CategoryTone =
  | "shoes"
  | "outerwear"
  | "streetwear"
  | "accessories"
  | "electronics"
  | "default";

function hashSeed(value: string): number {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function pickVariant(seed: string, variants: string[]): string {
  return variants[hashSeed(seed) % variants.length];
}

function getCategoryTone(product: Product): CategoryTone {
  const slug = product.category_slug;
  const name = product.product_name.toLowerCase();

  if (
    slug === "shoes" ||
    /sneaker|jordan|dunk|runner|boot|air max|yeezy|trainer/i.test(name)
  ) {
    return "shoes";
  }
  if (
    slug === "coats-and-jackets" ||
    /jacket|puffer|coat|parka|shell|vest|moncler|canada goose/i.test(name)
  ) {
    return "outerwear";
  }
  if (
    slug === "hoodies-and-pants" ||
    /hoodie|sweatpant|jogger|crewneck|sweater|cargo/i.test(name)
  ) {
    return "streetwear";
  }
  if (
    slug === "accessories" ||
    /bag|belt|hat|cap|wallet|glasses|jewelry|scarf|beanie/i.test(name)
  ) {
    return "accessories";
  }
  if (
    slug === "electronics" ||
    /headphone|earbud|watch|charger|cable|speaker|keyboard/i.test(name)
  ) {
    return "electronics";
  }

  return "default";
}

function qcSentence(product: Product, seed: string): string {
  if (!product.qc_link) {
    return pickVariant(seed, [
      "No QC link is listed for this one — check the LitBuy listing before you order.",
      "QC is not linked here, so review the seller page on LitBuy first.",
      "There is no QC reference attached. Worth a closer look on LitBuy before buying.",
    ]);
  }

  return pickVariant(seed, [
    "QC photos are linked — open them first and compare details before ordering.",
    "There is a QC link available, which makes it easier to check the item before you buy.",
    "Check the QC photos first if you want a closer look before placing the order.",
  ]);
}

function budgetSentence(product: Product, seed: string): string | null {
  if (product.price === null || product.price > 30) return null;

  return pickVariant(seed, [
    "At this price, it is an easy low-cost add if you are putting together a budget haul.",
    "A solid budget pick if you want something simple without pushing the spend too high.",
    "Good value territory — worth a look if you are shopping under $30.",
  ]);
}

function buildToneDescription(
  product: Product,
  tone: CategoryTone,
  brand: string | null
): string {
  const seed = product.id + product.product_name;
  const brandBit = brand ? `${brand} ` : "";
  const qc = qcSentence(product, seed + "qc");
  const budget = budgetSentence(product, seed + "budget");

  const openers: Record<CategoryTone, string[]> = {
    shoes: [
      `A ${brandBit}sneaker find that fits nicely into a rotation without feeling overpriced.`,
      `Clean ${brandBit}footwear if you are building out pairs and do not want to overpay.`,
      `A practical ${brandBit}shoe pick — easy to browse and compare before you commit.`,
    ],
    outerwear: [
      `A ${brandBit}outerwear find with a straightforward winter-ready look.`,
      `Useful if you want a ${brandBit}jacket-style piece without retail pricing.`,
      `A solid ${brandBit}layer for colder days — worth checking if you need outerwear.`,
    ],
    streetwear: [
      `An everyday ${brandBit}streetwear piece that works well in a casual outfit.`,
      `A relaxed ${brandBit}find if you are putting together hoodies, pants, or daily wear.`,
      `Easy ${brandBit}wardrobe add — simple styling, easy to pair with other pieces.`,
    ],
    accessories: [
      `A small ${brandBit}accessory find that can finish off an outfit.`,
      `Handy if you need a ${brandBit}extra piece without spending much.`,
      `An easy add-on ${brandBit}pick — good for bags, belts, hats, and similar items.`,
    ],
    electronics: [
      `A ${brandBit}gadget find worth comparing if you are hunting tech at agent pricing.`,
      `Practical ${brandBit}electronics pick — check specs and QC before ordering.`,
      `A simple ${brandBit}tech find if you want something useful without retail markup.`,
    ],
    default: [
      `A ${brandBit}find from the ${product.category.toLowerCase()} section worth a closer look.`,
      `Listed under ${product.category.toLowerCase()} — useful if you are browsing this category right now.`,
      `A ${brandBit}pick in ${product.category.toLowerCase()} with a direct LitBuy purchase link.`,
    ],
  };

  const parts = [pickVariant(seed, openers[tone]), qc];
  if (budget) parts.push(budget);

  const source = getProductSource(product.affiliate_link);
  if (source !== "litbuy") {
    parts.push(
      pickVariant(seed + "source", [
        `Listed via ${source.toUpperCase()} through LitBuy.`,
        `Source marketplace: ${source.toUpperCase()}.`,
      ])
    );
  }

  return parts.join(" ");
}

export function getProductDescription(product: Product): string {
  const brand = extractBrand(product.product_name);
  const tone = getCategoryTone(product);
  return buildToneDescription(product, tone, brand);
}

export function getProductHighlights(product: Product): string[] {
  const brand = extractBrand(product.product_name);
  const source = getProductSource(product.affiliate_link);
  const highlights: string[] = [];

  if (brand) highlights.push(`${brand} listing`);
  highlights.push(`${product.category} category`);
  if (product.price !== null) {
    highlights.push(`Listed around ${formatPrice(product.price, "USD")}`);
  }
  highlights.push(`Source: ${source.toUpperCase()}`);
  highlights.push(
    product.qc_link ? "QC link included" : "No QC link on this listing"
  );

  return highlights;
}

export function getProductSeoTitle(product: Product): string {
  const brand = extractBrand(product.product_name);
  const name = product.product_name.trim();

  if (brand && !name.toLowerCase().startsWith(brand.toLowerCase())) {
    return `${brand} ${name}`;
  }

  return name;
}

export function getProductSeoDescription(product: Product): string {
  const brand = extractBrand(product.product_name);
  const brandLabel = brand ? `${brand} ` : "";
  const priceBit =
    product.price !== null
      ? ` around ${formatPrice(product.price, "USD")}`
      : "";
  const qcBit = product.qc_link ? " QC references," : "";

  return `Browse this ${brandLabel}${product.category.toLowerCase()} find${priceBit} with${qcBit} related items, and a LitBuy purchase link.`;
}
