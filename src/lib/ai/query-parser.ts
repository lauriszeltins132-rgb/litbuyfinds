import { searchIntentSchema, type SearchIntent } from "@/lib/ai/schemas";
import {
  BRAND_HINTS,
  detectCategorySlugs,
  detectColors,
  expandSynonyms,
} from "@/lib/ai/synonyms";
import { slugify } from "@/lib/slugs";

const PRICE_PATTERNS = [
  /under\s*(?:\$|€|eur(?:os?)?\s*)?\s*(\d+(?:\.\d+)?)/i,
  /below\s*(?:\$|€|eur(?:os?)?\s*)?\s*(\d+(?:\.\d+)?)/i,
  /less\s+than\s*(?:\$|€|eur(?:os?)?\s*)?\s*(\d+(?:\.\d+)?)/i,
  /max(?:imum)?\s*(?:\$|€|eur(?:os?)?\s*)?\s*(\d+(?:\.\d+)?)/i,
  /budget\s*(?:of\s*)?(?:\$|€|eur(?:os?)?\s*)?\s*(\d+(?:\.\d+)?)/i,
  /(?:\$|€)\s*(\d+(?:\.\d+)?)\s*(?:or\s+less|max)/i,
  /(\d+(?:\.\d+)?)\s*€/i,
];

const MIN_PRICE_PATTERNS = [
  /over\s*\$?\s*(\d+(?:\.\d+)?)/i,
  /above\s*\$?\s*(\d+(?:\.\d+)?)/i,
  /at\s+least\s*\$?\s*(\d+(?:\.\d+)?)/i,
  /from\s*\$?\s*(\d+(?:\.\d+)?)/i,
];

const RANGE_PATTERN =
  /\$?\s*(\d+(?:\.\d+)?)\s*[-–to]+\s*\$?\s*(\d+(?:\.\d+)?)/i;

/**
 * Rule-based NL → structured search intent.
 * Used for deterministic fallback and as a first-pass before model parsing.
 */
export function parseSearchIntent(raw: string, limit = 8): SearchIntent {
  const original = raw.trim();
  const expanded = expandSynonyms(original);
  let working = expanded;

  let minPrice: number | null = null;
  let maxPrice: number | null = null;

  const range = working.match(RANGE_PATTERN);
  if (range) {
    minPrice = Number(range[1]);
    maxPrice = Number(range[2]);
    working = working.replace(range[0], " ");
  } else {
    for (const pattern of PRICE_PATTERNS) {
      const m = working.match(pattern);
      if (m) {
        maxPrice = Number(m[1]);
        working = working.replace(m[0], " ");
        break;
      }
    }
    for (const pattern of MIN_PRICE_PATTERNS) {
      const m = working.match(pattern);
      if (m) {
        minPrice = Number(m[1]);
        working = working.replace(m[0], " ");
        break;
      }
    }
  }

  const colors = detectColors(expanded);
  for (const color of colors) {
    working = working.replace(new RegExp(`\\b${color}\\b`, "gi"), " ");
  }

  const categories = detectCategorySlugs(expanded);

  const brands: string[] = [];
  for (const brand of BRAND_HINTS) {
    const re = new RegExp(`\\b${brand.replace(/\s+/g, "\\s+")}\\b`, "i");
    if (re.test(expanded)) {
      brands.push(slugify(brand));
      working = working.replace(re, " ");
    }
  }

  const requireQc = /\bqc\b/i.test(expanded);

  let sort: SearchIntent["sort"] = "relevance";
  if (/\bcheapest\b|\blowest\s+price\b|\bbudget\b/i.test(expanded)) {
    sort = "price-asc";
  } else if (/\btrending\b|\bpopular\b|\bbest\b/i.test(expanded)) {
    sort = "popular";
  } else if (/\bnewest\b|\blatest\b/i.test(expanded)) {
    sort = "newest";
  }

  const noise =
    /\b(find|show|me|the|a|an|some|please|looking|for|with|that|are|is|get|want|need|options|products|items|complete|outfit|haul|build|make|something|like|this|good|quality|affordable|cheap)\b/gi;
  const query = working
    .replace(noise, " ")
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  let useCase: string | undefined;
  if (/\bgym\b/i.test(expanded)) useCase = "gym";
  else if (/\bschool\b/i.test(expanded)) useCase = "school";
  else if (/\bwinter\b/i.test(expanded)) useCase = "winter";
  else if (/\bsummer\b/i.test(expanded)) useCase = "summer";
  else if (/\bfootball\b|\bsoccer\b/i.test(expanded)) useCase = "football";

  let season: string | undefined;
  if (/\bwinter\b/i.test(expanded)) season = "winter";
  if (/\bsummer\b/i.test(expanded)) season = "summer";

  return searchIntentSchema.parse({
    query,
    categories,
    brands,
    colors,
    minPrice,
    maxPrice,
    requireQc,
    sort,
    limit,
    useCase,
    season,
  });
}

export function isHaulRequest(text: string): boolean {
  return /\b(haul|outfit|bundle|wardrobe|fit check|full fit)\b/i.test(text);
}

export function extractBudget(text: string): number | null {
  const intent = parseSearchIntent(text);
  return intent.maxPrice;
}
