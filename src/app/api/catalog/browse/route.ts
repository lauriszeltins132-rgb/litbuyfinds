import { NextResponse } from "next/server";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";

export const revalidate = 3600;

export async function GET() {
  const products = getAllProducts();
  const categories = getCategories();
  const brands = getBrandsFromProducts(products);

  return NextResponse.json(
    { products, categories, brands },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
