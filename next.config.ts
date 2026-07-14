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
      {
        source: "/guides/how-to-qc-photos-work",
        destination: "/guides/how-to-check-qc-photos",
        permanent: true,
      },
      {
        source: "/guides/how-to-reduce-shipping-cost",
        destination: "/guides/how-shipping-works-with-agents",
        permanent: true,
      },
      {
        source: "/guides/best-shipping-line",
        destination: "/guides/how-shipping-works-with-agents",
        permanent: true,
      },
      { source: "/guides/beginner-guide", destination: "/guides/beginner-guide-to-litbuy", permanent: true },
      { source: "/guides/qc-guide", destination: "/guides/how-to-check-qc-photos", permanent: true },
      {
        source: "/guides/shipping-guide",
        destination: "/guides/how-shipping-works-with-agents",
        permanent: true,
      },
      { source: "/guides/weidian-guide", destination: "/guides/how-to-buy-from-weidian", permanent: true },
      { source: "/guides/litbuy-spreadsheet", destination: "/litbuy-spreadsheet", permanent: true },
      { source: "/litbuyfids", destination: "/", permanent: true },
      { source: "/litbuyfind", destination: "/", permanent: true },
      { source: "/litbuy-find", destination: "/", permanent: true },
      {
        source: "/litbuy-finds-spreadsheet",
        destination: "/litbuy-spreadsheet",
        permanent: true,
      },
      {
        source: "/litbuyfinds-spreadsheet",
        destination: "/litbuy-spreadsheet",
        permanent: true,
      },
      { source: "/collections/best-nike-litbuy-finds", destination: "/collections/best-nike-finds", permanent: true },
      { source: "/collections/best-jordan-litbuy-finds", destination: "/collections/best-jordan-finds", permanent: true },
      { source: "/collections/best-moncler-litbuy-finds", destination: "/collections/best-moncler-finds", permanent: true },
      { source: "/collections/best-stussy-litbuy-finds", destination: "/collections/best-stussy-finds", permanent: true },
      { source: "/collections/best-sneaker-finds", destination: "/collections/best-sneakers", permanent: true },
      { source: "/collections/best-jacket-finds", destination: "/collections/best-jackets", permanent: true },
      { source: "/collections/best-hoodie-finds", destination: "/collections/best-hoodies", permanent: true },
      { source: "/collections/best-bag-finds", destination: "/collections/best-bags", permanent: true },
      { source: "/collections/best-finds-under-50", destination: "/collections/best-under-50", permanent: true },
      { source: "/litbuy-telegram", destination: "/telegram-litbuy", permanent: true },
      { source: "/mulebuy-telegram", destination: "/telegram-mulebuy", permanent: true },
      { source: "/oopbuy-telegram", destination: "/telegram-oopbuy", permanent: true },
      { source: "/kakobuy-telegram", destination: "/telegram-kakobuy", permanent: true },
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
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value:
              "<https://i.postimg.cc>; rel=preconnect, <https://si.geilicdn.com>; rel=preconnect, <https://cbu01.alicdn.com>; rel=preconnect",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
