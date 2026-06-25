/** Brand logo paths — add assets to /public/brands/ as they become available */
export const BRAND_LOGO_PATHS: Record<string, string> = {
  // Reserved for future official brand marks; text fallback when absent
};

export function getBrandLogoPath(brandSlug: string): string | null {
  return BRAND_LOGO_PATHS[brandSlug] ?? null;
}
