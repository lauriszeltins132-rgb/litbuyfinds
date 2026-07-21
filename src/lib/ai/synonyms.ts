/**
 * Central synonym / alias map for query expansion.
 * Keep shopping synonyms here — not in UI components.
 */

export const COLOR_ALIASES: Record<string, string[]> = {
  black: ["black", "noir", "onyx", "charcoal"],
  white: ["white", "ivory", "cream", "offwhite", "off-white"],
  red: ["red", "burgundy", "maroon", "crimson"],
  blue: ["blue", "navy", "cobalt", "azure"],
  green: ["green", "olive", "forest", "mint"],
  brown: ["brown", "tan", "beige", "khaki", "camel"],
  grey: ["grey", "gray", "silver", "slate"],
  pink: ["pink", "rose", "magenta"],
  purple: ["purple", "violet", "lavender"],
  yellow: ["yellow", "gold", "mustard"],
  orange: ["orange", "coral"],
};

export const CATEGORY_ALIASES: Record<string, string[]> = {
  shoes: ["shoes", "sneakers", "kicks", "trainers", "footwear", "jordan", "dunk"],
  sneakers: ["sneakers", "shoes", "kicks", "trainers", "jordan"],
  hoodies: ["hoodie", "hoodies", "sweatshirt", "crewneck"],
  jackets: ["jacket", "jackets", "coat", "coats", "puffer", "windbreaker", "parka"],
  pants: ["pants", "trousers", "cargos", "joggers", "jeans"],
  shorts: ["shorts", "short"],
  "t-shirts": ["tee", "tees", "t-shirt", "tshirt", "shirt", "shirts"],
  bags: ["bag", "bags", "backpack", "tote", "crossbody", "handbag"],
  accessories: ["accessories", "cap", "hat", "belt", "socks", "watch", "jersey"],
  jerseys: ["jersey", "jerseys", "football jersey", "soccer jersey"],
};

export const QUERY_SYNONYMS: Record<string, string> = {
  trainers: "sneakers",
  kicks: "sneakers",
  tee: "t-shirt",
  tees: "t-shirts",
  puffer: "puffer jacket",
  jersey: "football jersey",
  "gym set": "sportswear",
  "school bag": "backpack",
  kicks_alt: "shoes",
  dunks: "dunk",
  jordans: "jordan",
};

export const BRAND_HINTS = [
  "nike",
  "jordan",
  "adidas",
  "yeezy",
  "new balance",
  "asics",
  "stussy",
  "supreme",
  "moncler",
  "canada goose",
  "stone island",
  "gucci",
  "louis vuitton",
  "lv",
  "dior",
  "balenciaga",
  "chrome hearts",
  "bape",
  "corteiz",
  "trapstar",
] as const;

export function expandSynonyms(query: string): string {
  let out = query.toLowerCase();
  for (const [from, to] of Object.entries(QUERY_SYNONYMS)) {
    const re = new RegExp(`\\b${from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    out = out.replace(re, to);
  }
  return out;
}

export function detectColors(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [canonical, aliases] of Object.entries(COLOR_ALIASES)) {
    if (aliases.some((a) => lower.includes(a))) found.push(canonical);
  }
  return found;
}

export function detectCategorySlugs(text: string): string[] {
  const lower = text.toLowerCase();
  const slugs: string[] = [];

  const map: Record<string, string> = {
    shoes: "shoes",
    sneakers: "shoes",
    kicks: "shoes",
    trainers: "shoes",
    hoodie: "hoodies-and-pants",
    hoodies: "hoodies-and-pants",
    pants: "hoodies-and-pants",
    cargos: "hoodies-and-pants",
    jacket: "coats-and-jackets",
    jackets: "coats-and-jackets",
    coat: "coats-and-jackets",
    puffer: "coats-and-jackets",
    tee: "tshirts-and-shorts",
    "t-shirt": "tshirts-and-shorts",
    shorts: "tshirts-and-shorts",
    jersey: "tshirts-and-shorts",
    bag: "accessories",
    backpack: "accessories",
    accessory: "accessories",
    watch: "accessories",
    cap: "accessories",
  };

  for (const [token, slug] of Object.entries(map)) {
    if (lower.includes(token) && !slugs.includes(slug)) slugs.push(slug);
  }
  return slugs;
}
