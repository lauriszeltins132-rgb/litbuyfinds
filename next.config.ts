import type { NextConfig } from "next";
import { SEO_LIST_SLUGS } from "./src/lib/seo-list-routes";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return SEO_LIST_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/lists/${slug}`,
    }));
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.postimg.cc" },
      { protocol: "https", hostname: "si.geilicdn.com" },
      { protocol: "https", hostname: "cbu01.alicdn.com" },
      { protocol: "https", hostname: "**.alicdn.com" },
      { protocol: "https", hostname: "**.geilicdn.com" },
    ],
  },
};

export default nextConfig;
