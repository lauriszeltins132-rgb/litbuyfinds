import type { MetadataRoute } from "next";
import { CATEGORY_ALIAS_SLUGS } from "@/lib/category-aliases";
import { COLLECTION_SLUGS, COLLECTIONS } from "@/lib/collections";
import { getBrandsFromProducts } from "@/lib/brands";
import { getCategories, getAllProducts } from "@/lib/products";
import { getAllProductSlugs } from "@/lib/slugs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://litbuyfinds.io";
  const categories = getCategories();
  const brands = getBrandsFromProducts(getAllProducts());
  const productSlugs = getAllProductSlugs();

  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/trending`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/latest`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/deals`, changeFrequency: "daily", priority: 0.85 },
    { url: `${baseUrl}/brands`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/categories`, changeFrequency: "weekly", priority: 0.8 },
  ];

  for (const slug of COLLECTION_SLUGS) {
    const collection = COLLECTIONS[slug];
    if (collection.href !== "/trending") {
      routes.push({
        url: `${baseUrl}${collection.href}`,
        changeFrequency: "daily",
        priority: 0.88,
      });
    }
  }

  for (const category of categories) {
    if (category.group === "category") {
      routes.push({
        url: `${baseUrl}/categories/${category.slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  for (const slug of CATEGORY_ALIAS_SLUGS) {
    routes.push({
      url: `${baseUrl}/categories/${slug}`,
      changeFrequency: "weekly",
      priority: 0.82,
    });
  }

  for (const brand of brands) {
    routes.push({
      url: `${baseUrl}/brands/${brand.slug}`,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  for (const slug of productSlugs) {
    routes.push({
      url: `${baseUrl}/find/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return routes;
}
