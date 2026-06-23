import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  staticPageGenerationTimeout: 300,
  async redirects() {
    return [
      {
        source: "/guides/why-use-an-agent",
        destination: "/guides/why-use-a-shopping-agent",
        permanent: true,
      },
      {
        source: "/guides/how-to-order",
        destination: "/guides/how-to-order-from-litbuy",
        permanent: true,
      },
      {
        source: "/guides/how-to-find-products",
        destination: "/guides/how-to-use-litbuy-finds",
        permanent: true,
      },
      {
        source: "/guides/shipping-and-hauls",
        destination: "/guides/how-shipping-works-with-agents",
        permanent: true,
      },
      {
        source: "/guides/litbuy-spreadsheet-guide",
        destination: "/guides/litbuy-spreadsheet",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      { source: "/category/:slug", destination: "/categories/:slug", permanent: true },
      { source: "/best-litbuy-sneakers", destination: "/litbuy-sneakers", permanent: true },
      { source: "/best-litbuy-jackets", destination: "/litbuy-jackets", permanent: true },
      {
        source: "/best-litbuy-accessories",
        destination: "/best-litbuy-accessories-2026",
        permanent: true,
      },
      { source: "/best-litbuy-bags", destination: "/best-litbuy-bags-2026", permanent: true },
      { source: "/best-litbuy-under-50", destination: "/best-under-50", permanent: true },
      { source: "/best-qc-finds", destination: "/top-qc-finds", permanent: true },
      { source: "/guides/how-to-use-litbuy", destination: "/guides/how-to-use-litbuy-finds", permanent: true },
      { source: "/guides/beginner-guide", destination: "/guides/beginner-guide-to-litbuy", permanent: true },
      { source: "/guides/qc-guide", destination: "/guides/how-to-check-qc-photos", permanent: true },
      {
        source: "/guides/shipping-guide",
        destination: "/guides/how-shipping-works-with-agents",
        permanent: true,
      },
      { source: "/guides/weidian-guide", destination: "/guides/how-to-buy-from-weidian", permanent: true },
      { source: "/guides/litbuy-spreadsheet", destination: "/litbuy-spreadsheet", permanent: true },
    ];
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
