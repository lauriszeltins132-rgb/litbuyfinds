export function getCollectionFaqs(
  slug: string,
  title: string
): { question: string; answer: string }[] {
  const name = title.replace(/^Best\s+/i, "").replace(/\s+LitBuy finds$/i, "");

  const base = [
    {
      question: `What are the best ${name || title} on LitBuy?`,
      answer:
        "This collection ranks catalog picks by photos, QC availability, engagement, and verified LitBuy links. Products rotate with daily catalog sync.",
    },
    {
      question: "How often is this collection updated?",
      answer:
        "The product grid refreshes when the LitBuy Finds catalog syncs — typically daily. Open product pages to confirm live LitBuy prices before checkout.",
    },
    {
      question: "Are these QC approved?",
      answer:
        "Many listings include QC reference links. Request warehouse QC on LitBuy after purchase for photos of your exact item before shipping.",
    },
  ];

  if (slug.includes("under-")) {
    base.push({
      question: "Do prices include shipping?",
      answer:
        "Listed prices are item cost before agent fees and international freight. Bundle budget items in one haul to lower per-piece shipping cost.",
    });
  }

  if (slug.includes("qc")) {
    base.push({
      question: "How do I use QC finds?",
      answer:
        "Compare reference QC on product pages, then request warehouse QC on LitBuy for your paid order before approving international shipment.",
    });
  }

  return base;
}
