import type { Product } from "./types";
import { getDisplayBrand } from "./product-validation";

const KNOWN_BRANDS = [
  "Chrome Hearts",
  "Balenciaga",
  "Ralph Lauren",
  "Supreme",
  "Essentials",
  "Dior",
  "Rick Owens",
  "Bape",
  "Burberry",
  "Nike",
  "Goyard",
  "Stone Island",
  "New Balance",
  "Sp5der",
  "Chanel",
  "Jordan",
  "Adidas",
  "Louis Vuitton",
  "Moncler",
  "Prada",
  "Gucci",
  "Off-White",
  "Off White",
  "Ami",
  "Lacoste",
  "Hermes",
  "Versace",
  "Fendi",
  "Givenchy",
  "Valentino",
  "Asics",
  "UGG",
  "The North Face",
  "Carhartt",
  "Gallery Dept",
  "Maison Margiela",
  "MM6",
  "Salomon",
  "Alexander McQueen",
  "Golden Goose",
  "GGDB",
  "Corteiz",
  "Stussy",
  "Palace",
  "Arc'teryx",
  "Arcteryx",
  "CP Company",
  "Palm Angels",
  "Amiri",
  "Loewe",
  "Miu Miu",
  "Yeezy",
  "Travis Scott",
  "Nocta",
  "Mertra",
  "Vivienne Westwood",
  "Vetements",
  "Bottega Veneta",
  "Timberland",
  "Converse",
  "Vans",
  "Puma",
  "Reebok",
  "Under Armour",
  "Lululemon",
  "Alo",
  "Zegna",
  "Loro Piana",
  "Canada Goose",
  "Moose Knuckles",
  "Marni",
  "Mihara Yasuhiro",
  "Maison Mihara Yasuhiro",
  "Represent",
  "Fear of God",
  "Acne Studios",
  "Rimowa",
  "Tiffany",
  "Rolex",
  "Casio",
  "Apple",
  "Sony",
];

export type BrandInfo = {
  name: string;
  slug: string;
  count: number;
};

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

export function extractBrand(productName: string): string | null {
  const upper = productName.toUpperCase();
  for (const brand of KNOWN_BRANDS) {
    if (upper.includes(brand.toUpperCase())) return brand;
  }
  return null;
}

/** All distinct brands mentioned in text (longest match first). */
export function extractAllBrands(text: string): string[] {
  const upper = text.toUpperCase();
  const found: string[] = [];
  const used = new Set<string>();

  const sorted = [...KNOWN_BRANDS].sort((a, b) => b.length - a.length);
  for (const brand of sorted) {
    if (!upper.includes(brand.toUpperCase())) continue;
    const key = brand.toLowerCase();
    if (used.has(key)) continue;
    const overlaps = found.some(
      (existing) =>
        existing.toLowerCase().includes(key) || key.includes(existing.toLowerCase())
    );
    if (overlaps && found.length > 0) continue;
    found.push(brand);
    used.add(key);
  }

  return found;
}

export function getBrandsFromProducts(products: Product[]): BrandInfo[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    const brand = getDisplayBrand(product);
    if (!brand) continue;
    counts.set(brand, (counts.get(brand) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

export function productMatchesBrand(product: Product, brandSlug: string): boolean {
  const brand = getDisplayBrand(product);
  return brand ? slugify(brand) === brandSlug : false;
}

export function getBrandBySlug(
  products: Product[],
  brandSlug: string
): BrandInfo | undefined {
  return getBrandsFromProducts(products).find((brand) => brand.slug === brandSlug);
}

export function getProductsByBrandSlug(
  products: Product[],
  brandSlug: string
): Product[] {
  return products.filter((product) => productMatchesBrand(product, brandSlug));
}
