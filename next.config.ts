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
      {
        source: "/guides/how-to-use-litbuy",
        destination: "/how-to-use-litbuy",
        permanent: true,
      },
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
      { source: "/litbuy-ai", destination: "/ai", permanent: true },
      { source: "/litbuy-coupon", destination: "/litbuy-coupons", permanent: true },
      { source: "/litbuy-promo-code", destination: "/litbuy-coupons", permanent: true },
      { source: "/litbuy-referral-code", destination: "/litbuy-coupons", permanent: true },
      { source: "/litbuy-referral-bonus", destination: "/litbuy-coupons", permanent: true },
      { source: "/litbuy-discount", destination: "/litbuy-coupons", permanent: true },
      { source: "/litbuy-promo", destination: "/litbuy-coupons", permanent: true },
      { source: "/best-litbuy-coupon", destination: "/litbuy-coupons", permanent: true },
      {
        source: "/guides/what-is-litbuy",
        destination: "/what-is-litbuy",
        permanent: true,
      },
      {
        source: "/guides/litbuy-finds",
        destination: "/what-is-litbuy-finds",
        permanent: true,
      },
      {
        source: "/guides/litbuy-qc-photos",
        destination: "/litbuy-qc-photos",
        permanent: true,
      },
      {
        source: "/guides/what-are-qc-photos",
        destination: "/what-are-qc-photos",
        permanent: true,
      },
      {
        source: "/guides/how-to-save-money-on-shipping",
        destination: "/how-to-save-on-shipping",
        permanent: true,
      },
      { source: "/mulebuy-telegram", destination: "/telegram-mulebuy", permanent: true },
      { source: "/oopbuy-telegram", destination: "/telegram-oopbuy", permanent: true },
      { source: "/kakobuy-telegram", destination: "/telegram-kakobuy", permanent: true },
      { source: "/hipobuy-telegram", destination: "/telegram-hipobuy", permanent: true },
      { source: "/usfans-telegram", destination: "/telegram-usfans", permanent: true },
      { source: "/gtbuy-telegram", destination: "/telegram-gtbuy", permanent: true },
      { source: "/boonbuy-telegram", destination: "/telegram-boonbuy", permanent: true },
      { source: "/oopbuy-discord", destination: "/discord-oopbuy", permanent: true },
      { source: "/kakobuy-discord", destination: "/discord-kakobuy", permanent: true },
      { source: "/hipobuy-discord", destination: "/discord-hipobuy", permanent: true },
      { source: "/usfans-discord", destination: "/discord-usfans", permanent: true },
      { source: "/gtbuy-discord", destination: "/discord-gtbuy", permanent: true },
      { source: "/boonbuy-discord", destination: "/discord-boonbuy", permanent: true },
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
    /** Cache optimized next/image responses longer (logos/promo only — catalog uses raw <img>). */
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Link",
            value: [
              "<https://i.postimg.cc>; rel=preconnect; crossorigin",
              "<https://si.geilicdn.com>; rel=preconnect; crossorigin",
              "<https://cbu01.alicdn.com>; rel=preconnect; crossorigin",
              "<https://img.alicdn.com>; rel=preconnect; crossorigin",
              "<https://ae01.alicdn.com>; rel=preconnect; crossorigin",
            ].join(", "),
          },
        ],
      },
      {
        source: "/logo.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
