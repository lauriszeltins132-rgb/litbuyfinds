import type { Product } from "./types";
import { extractBrand } from "./brands";
import { formatPrice } from "./currency";
import { hasExactPrice } from "./pricing";
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

function nameHook(product: Product): string | null {
  const name = product.product_name.toLowerCase();

  const hooks: [RegExp, string[]][] = [
    [/dunk/i, ["Dunk-style silhouette", "A Dunk listing", "This Dunk pair"]],
    [/jordan/i, ["Jordan-style build", "A Jordan listing", "This Jordan pair"]],
    [/yeezy/i, ["Yeezy-style runner", "A Yeezy listing", "This Yeezy pair"]],
    [/moncler/i, ["Moncler-style piece", "A Moncler listing", "This Moncler item"]],
    [/gallery dept/i, ["Gallery Dept-style wash", "A Gallery Dept listing", "This Gallery Dept piece"]],
    [/jeans|denim/i, ["Denim listing", "A jeans pick", "This denim piece"]],
    [/hoodie|crewneck/i, ["Hoodie/crew listing", "A top-layer pick", "This sweat piece"]],
    [/beanie|hat|cap/i, ["Headwear listing", "A hat/beanie pick", "This small accessory"]],
    [/bag|backpack/i, ["Bag listing", "A carry piece", "This bag pick"]],
  ];

  for (const [pattern, variants] of hooks) {
    if (pattern.test(name)) {
      return pickVariant(product.id + name, variants);
    }
  }

  return null;
}

function qcSentence(product: Product, seed: string): string {
  if (!product.qc_link) {
    return pickVariant(seed, [
      "No QC is linked here — open the LitBuy page and check seller photos before you order.",
      "QC is not attached to this listing, so review the seller page carefully first.",
      "There is no QC reference on this one. Worth a closer look on LitBuy before buying.",
    ]);
  }

  return pickVariant(seed, [
    "QC photos are linked — compare stitching, logos, and shape before you ship.",
    "There is a QC link, which makes it easier to vet the item before checkout.",
    "Check the QC set first if you want a closer look before placing the order.",
  ]);
}

function priceSentence(product: Product, seed: string): string | null {
  if (!hasExactPrice(product.price) || product.price === null) return null;
  const usd = product.price;
  const price = formatPrice(usd, "USD");

  if (usd <= 20) {
    return pickVariant(seed, [
      `Listed around ${price}, so it is an easy low-risk add to a haul.`,
      `At ${price}, this is squarely in budget territory.`,
      `Priced near ${price} — good if you want something cheap without thinking too hard.`,
    ]);
  }

  if (usd <= 45) {
    return pickVariant(seed, [
      `Listed around ${price}, which is reasonable for this category.`,
      `Sits near ${price} — compare a few similar listings before you pick one.`,
      `At ${price}, it is mid-range for the catalog: not the cheapest, not the craziest.`,
    ]);
  }

  return pickVariant(seed, [
    `Listed around ${price}, so take your time with QC on this one.`,
    `Higher ticket at ${price} — QC and seller reputation matter more here.`,
    `Priced near ${price}. Worth comparing against a couple of alternatives first.`,
  ]);
}

function sellerSentence(product: Product, seed: string): string {
  const source = getProductSource(product.affiliate_link);

  if (source === "weidian") {
    return pickVariant(seed, [
      "Pulled from Weidian through LitBuy — usual agent flow applies.",
      "Weidian listing via LitBuy. Standard buy → warehouse → ship steps.",
      "This one routes through Weidian on LitBuy.",
    ]);
  }

  if (source === "taobao") {
    return pickVariant(seed, [
      "Taobao listing through LitBuy.",
      "Sourced from Taobao via LitBuy — same agent checkout flow.",
      "This routes through Taobao on LitBuy.",
    ]);
  }

  if (source === "1688") {
    return pickVariant(seed, [
      "1688 listing through LitBuy — often solid for basics and accessories.",
      "Pulled from 1688 via LitBuy.",
      "This one comes from 1688 through LitBuy.",
    ]);
  }

  return pickVariant(seed, [
    "Buy through LitBuy with the usual agent checkout flow.",
    "Outbound link goes to LitBuy for purchase.",
    "Checkout happens on LitBuy like any other find here.",
  ]);
}

function buildToneDescription(
  product: Product,
  tone: CategoryTone,
  brand: string | null
): string {
  const seed = product.id + product.product_name;
  const hook = nameHook(product);
  const brandBit = brand ? `${brand} ` : "";
  const qc = qcSentence(product, seed + "qc");
  const price = priceSentence(product, seed + "price");
  const seller = sellerSentence(product, seed + "seller");

  const openers: Record<CategoryTone, string[]> = {
    shoes: [
      `${hook ?? `A ${brandBit}footwear listing`} from the ${product.category.toLowerCase()} sheet.`,
      `${hook ?? `This ${brandBit}shoe find`} is worth comparing if you are building a rotation.`,
      `${hook ?? `Listed under ${product.category.toLowerCase()}`} — ${brandBit}footwear with agent pricing.`,
    ],
    outerwear: [
      `${hook ?? `A ${brandBit}outerwear listing`} for colder months.`,
      `${hook ?? `This ${brandBit}jacket-style find`} sits in ${product.category.toLowerCase()}.`,
      `${hook ?? `Outerwear pick`} — ${brandBit}layer listed on LitBuy.`,
    ],
    streetwear: [
      `${hook ?? `A ${brandBit}streetwear listing`} for everyday fits.`,
      `${hook ?? `This ${brandBit}casual find`} is in ${product.category.toLowerCase()}.`,
      `${hook ?? `Everyday ${brandBit}piece`} from the ${product.category.toLowerCase()} section.`,
    ],
    accessories: [
      `${hook ?? `A ${brandBit}accessory listing`} that can finish an outfit.`,
      `${hook ?? `Small ${brandBit}add-on`} from ${product.category.toLowerCase()}.`,
      `${hook ?? `Accessory find`} — ${brandBit}listed with a LitBuy link.`,
    ],
    electronics: [
      `${hook ?? `A ${brandBit}tech listing`} if you are hunting gadgets at agent prices.`,
      `${hook ?? `This ${brandBit}electronics find`} is in ${product.category.toLowerCase()}.`,
      `${hook ?? `Gadget pick`} — check specs and QC before ordering.`,
    ],
    default: [
      `${hook ?? `A ${brandBit}find`} listed under ${product.category.toLowerCase()}.`,
      `${hook ?? `This ${brandBit}listing`} is in the ${product.category.toLowerCase()} section.`,
      `${hook ?? `Catalog pick`} from ${product.category.toLowerCase()} with a direct LitBuy link.`,
    ],
  };

  const closers = [
    "If the photos look right, it is a straightforward add to cart.",
    "Compare it against a couple of similar listings before you commit.",
    "Save it if you are building a haul and come back when you are ready to ship.",
    "Fine everyday pickup if the QC checks out on your end.",
  ];

  const parts = [
    pickVariant(seed, openers[tone]),
    price,
    qc,
    seller,
    pickVariant(seed + "close", closers),
  ].filter(Boolean) as string[];

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
  highlights.push(`${product.category}`);
  if (hasExactPrice(product.price) && product.price !== null) {
    highlights.push(`About ${formatPrice(product.price, "USD")}`);
  }
  highlights.push(`Seller: ${source.toUpperCase()}`);
  highlights.push(
    product.qc_link ? "QC photos linked" : "No QC on this listing"
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
    hasExactPrice(product.price) && product.price !== null
      ? ` from ${formatPrice(product.price, "USD")}`
      : "";
  const qcBit = product.qc_link ? " with QC photos" : "";
  const source = getProductSource(product.affiliate_link);

  return `${product.product_name} — ${brandLabel}${product.category} find${priceBit}${qcBit}. Listed via ${source.toUpperCase()} on LitBuy Finds.`;
}
