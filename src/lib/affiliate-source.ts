export function getProductSource(affiliateLink: string): string {
  if (affiliateLink.includes("/weidian/")) return "weidian";
  if (affiliateLink.includes("/taobao/")) return "taobao";
  if (affiliateLink.includes("/1688/")) return "1688";
  return "litbuy";
}
