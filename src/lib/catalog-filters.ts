import type { Product } from "./types";

/** Non-product promo rows from spreadsheet imports. */
export function isPromoProduct(product: Product): boolean {
  const name = product.product_name.toLowerCase();
  return (
    /70%\s*off/.test(name) ||
    /signing up to litbuy/.test(name) ||
    /register on litbuy/.test(name)
  );
}

export function filterBrowsableProducts(items: Product[]): Product[] {
  return items.filter((product) => !isPromoProduct(product));
}
