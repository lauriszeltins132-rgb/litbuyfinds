import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
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
