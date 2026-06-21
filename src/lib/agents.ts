import type { Product } from "./types";

export const agents = [
  "LitBuy",
  "OopBuy",
  "KakoBuy",
  "HipoBuy",
  "MuleBuy",
  "ACBuy",
  "USFans",
] as const;

export type AgentName = (typeof agents)[number];

export type AgentConfig = {
  id: string;
  name: AgentName;
  homepageUrl: string;
  description: string;
  directLink: boolean;
};

export const AGENT_CONFIG: AgentConfig[] = [
  {
    id: "litbuy",
    name: "LitBuy",
    homepageUrl: "https://litbuy.com",
    description: "Open the verified LitBuy product link.",
    directLink: true,
  },
  {
    id: "oopbuy",
    name: "OopBuy",
    homepageUrl: "https://oopbuy.com",
    description: "Copy the source URL, then paste it into OopBuy.",
    directLink: false,
  },
  {
    id: "kakobuy",
    name: "KakoBuy",
    homepageUrl: "https://www.kakobuy.com",
    description: "Copy the source URL, then paste it into KakoBuy.",
    directLink: false,
  },
  {
    id: "hipobuy",
    name: "HipoBuy",
    homepageUrl: "https://www.hipobuy.com",
    description: "Copy the source URL, then paste it into HipoBuy.",
    directLink: false,
  },
  {
    id: "mulebuy",
    name: "MuleBuy",
    homepageUrl: "https://mulebuy.com",
    description: "Copy the source URL, then paste it into MuleBuy.",
    directLink: false,
  },
  {
    id: "acbuy",
    name: "ACBuy",
    homepageUrl: "https://www.acbuy.com",
    description: "Copy the source URL, then paste it into ACBuy.",
    directLink: false,
  },
  {
    id: "usfans",
    name: "USFans",
    homepageUrl: "https://www.usfans.com",
    description: "Copy the source URL, then paste it into USFans.",
    directLink: false,
  },
];

export const DEFAULT_AGENT_ID = "litbuy";

export type AgentId = (typeof AGENT_CONFIG)[number]["id"];

export function getAgentById(id: string): AgentConfig {
  return AGENT_CONFIG.find((agent) => agent.id === id) ?? AGENT_CONFIG[0];
}

export type MarketplaceSource = "weidian" | "taobao" | "1688" | "litbuy";

export function getMarketplaceSource(url: string): MarketplaceSource {
  if (url.includes("/weidian/") || url.includes("weidian.com")) return "weidian";
  if (url.includes("/taobao/") || url.includes("taobao.com")) return "taobao";
  if (url.includes("/1688/") || url.includes("1688.com")) return "1688";
  return "litbuy";
}

function extractMarketplaceId(url: string, source: MarketplaceSource): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const sourceIndex = pathParts.findIndex((part) => part === source);
    if (sourceIndex >= 0 && pathParts[sourceIndex + 1]) {
      return pathParts[sourceIndex + 1];
    }

    return (
      parsed.searchParams.get("itemID") ??
      parsed.searchParams.get("itemId") ??
      parsed.searchParams.get("id") ??
      parsed.searchParams.get("offerId")
    );
  } catch {
    const match = url.match(/(?:weidian|taobao|1688)\/(\d+)/i);
    return match?.[1] ?? null;
  }
}

export function getOriginalSourceUrl(product: Product): string {
  if (product.source_url) return product.source_url;

  const source = getMarketplaceSource(product.affiliate_link);
  const id = extractMarketplaceId(product.affiliate_link, source);
  if (!id) return product.affiliate_link;

  switch (source) {
    case "weidian":
      return `https://weidian.com/item.html?itemID=${id}`;
    case "taobao":
      return `https://item.taobao.com/item.htm?id=${id}`;
    case "1688":
      return `https://detail.1688.com/offer/${id}.html`;
    default:
      return product.affiliate_link;
  }
}

export function getAgentDestination(product: Product, agentId: string): string {
  const agent = getAgentById(agentId);
  if (agent.directLink && product.affiliate_link) return product.affiliate_link;
  return agent.homepageUrl;
}
