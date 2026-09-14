import { NextResponse } from "next/server";
import { getBrandsFromProducts } from "@/lib/brands";
import { getAllProducts, getCategories } from "@/lib/products";
import {
  checkRouteRateLimit,
  getClientKeyFromRequest,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/log";

export const revalidate = 3600;

export async function GET(request: Request) {
  const limit = checkRouteRateLimit(
    "catalog-browse",
    getClientKeyFromRequest(request),
    { max: 60, windowMs: 60_000 }
  );
  if (!limit.ok) {
    logSecurityEvent("rate_limited", { route: "catalog/browse" });
    return rateLimitResponse(limit.retryAfterSec);
  }

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
