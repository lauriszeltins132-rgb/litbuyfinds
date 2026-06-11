import type { NextConfig } from "next";

const SEO_LIST_SLUGS = [
  "top-rep-sneakers",
  "top-nike-finds",
  "top-designer-bags",
  "top-budget-finds",
  "top-streetwear-finds",
  "top-products-under-20",
  "top-products-under-50",
  "top-products-under-100",
  "top-louis-vuitton-finds",
  "top-gucci-finds",
  "nike-vs-adidas-finds",
  "best-bag-brands-on-litbuy",
  "best-seller-comparison",
];

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
