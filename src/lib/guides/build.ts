import type { GuideCategory, GuidePage } from "./types";
import { guidePath } from "./shared";

export function buildGuide(
  slug: string,
  category: GuideCategory,
  config: Omit<GuidePage, "slug" | "path" | "category">
): GuidePage {
  return {
    slug,
    category,
    path: guidePath(slug),
    ...config,
  };
}
