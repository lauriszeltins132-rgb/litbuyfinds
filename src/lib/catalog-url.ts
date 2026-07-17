export function buildPageHref(
  basePath: string,
  searchParams: Record<string, string>,
  page: number
) {
  const params = new URLSearchParams(searchParams);
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}
