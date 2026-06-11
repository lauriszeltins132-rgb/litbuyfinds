import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const QC_GUIDES: Record<string, GuidePage> = {
  "what-are-qc-photos": buildGuide("what-are-qc-photos", "qc", {
    title: "What Are QC Photos?",
    metaDescription:
      "QC photos explained in plain language — what warehouse quality-check pictures are, when you get them, and why they matter before international shipping.",
    badge: "QC basics",
    h1: "What are QC photos?",
    intro:
      "QC photos are pictures of your actual item taken at the agent warehouse after the seller delivers. They are not marketing shots from the listing — they show what you are about to ship.",
    cardDescription:
      "Warehouse quality-check photos — what they are and when you see them.",
    sections: [
      {
        heading: "QC means quality check",
        paragraphs: [
          "When buyers say QC, they usually mean photos taken by warehouse staff so you can review the product before it leaves China. The goal is simple: confirm you received the right color, size, and batch, and spot obvious flaws while returns are still practical.",
        ],
      },
      {
        heading: "How QC fits into the order flow",
        paragraphs: [
          "You buy through an agent. The seller ships domestically to the warehouse. Staff unpacks the parcel, photographs the item from several angles, and uploads the images to your order panel. You approve, request a closer shot, or open a support ticket if something looks wrong.",
        ],
        links: [
          { href: "/guides/how-litbuy-works", label: "How LitBuy works" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" },
        ],
      },
      {
        heading: "QC photos vs listing photos",
        paragraphs: [
          "Listing photos are often pulled from the seller page and may show a sample batch. Warehouse QC shows your specific unit. Community QC albums linked on some finds can help you know what to expect, but your warehouse photos are the final look before freight.",
        ],
        links: [{ href: "/qc", label: "QC-ready finds" }],
      },
      {
        heading: "When QC might not be available",
        paragraphs: [
          "Some low-cost items or rush orders skip detailed photography unless you request it. Policies vary by agent and product type. If QC matters to you, enable photo service at checkout or ask support before the item gets packed into a haul.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I pay extra for QC photos?",
        answer:
          "Many agents include basic photos; detailed angles or video may cost a small add-on fee. Check LitBuy's photo options when you place the order.",
      },
      {
        question: "How many photos should I expect?",
        answer:
          "Shoes often get top, side, heel, sole, and tag shots. Clothing may include front, back, label, and zipper details. More complex items can get extra angles on request.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-to-check-qc-photos": buildGuide("how-to-check-qc-photos", "qc", {
    title: "How to Check QC Photos",
    metaDescription:
      "A practical walkthrough for reviewing QC photos — lighting, angles, common flaws, and when to approve, exchange, or ask for more pictures.",
    badge: "QC guide",
    h1: "How to check QC photos",
    intro:
      "QC review is your last low-friction checkpoint. Once the parcel ships internationally, fixing a wrong size or major flaw gets expensive. Take five minutes with the photos while the item is still at the warehouse.",
    cardDescription:
      "Review warehouse photos like a buyer — not a perfectionist microscope.",
    sections: [
      {
        heading: "Start with the basics",
        paragraphs: [
          "Confirm colorway, size label, and quantity match what you ordered. Check that the box or bag style matches the listing if that matters to you. Wrong item shipped is the fastest reason to stop before shipping.",
        ],
      },
      {
        heading: "Zoom in on details that matter",
        paragraphs: [
          "For shoes, compare toe shape, midsole curve, heel tab, and stitching lines. For apparel, check print alignment, zipper pull, and wash tags. For bags, look at hardware engraving, strap attachments, and interior lining.",
        ],
        links: [
          { href: "/guides/qc-checklist-for-shoes", label: "Shoe QC checklist" },
          { href: "/guides/qc-checklist-for-clothing", label: "Clothing QC checklist" },
        ],
      },
      {
        heading: "Use reference without obsessing",
        paragraphs: [
          "Compare QC to listing photos, community albums, or review posts if you have them. You are checking for obvious mismatches and defects — not hunting sub-millimeter differences unless you paid for that tier of product.",
        ],
        links: [{ href: "/qc", label: "Browse QC references" }],
      },
      {
        heading: "Decide: approve, re-shoot, or exchange",
        paragraphs: [
          "Minor glue or loose thread might be acceptable at budget price points. Wrong size, wrong model, heavy scuffs, or broken hardware usually are not. Ask for another photo angle if lighting hides something important. Open a ticket before you submit the haul.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I GL or RL everything?",
        answer:
          "GL (green light) when the item matches what you expected for the price. RL (red light) when there is a clear functional or cosmetic issue you cannot accept. You set your own bar — just decide before paying international shipping.",
      },
      {
        question: "What if photos look blurry?",
        answer:
          "Request a re-shoot. Agents can usually retake pictures in better light. Do not approve based on unusable images.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "qc-checklist-for-shoes": buildGuide("qc-checklist-for-shoes", "qc", {
    title: "QC Checklist for Shoes",
    metaDescription:
      "Shoe QC checklist for agent warehouse photos — sizing, shape, soles, stitching, and box checks before you ship sneakers or boots.",
    badge: "Shoe QC",
    h1: "QC checklist for shoes",
    intro:
      "Shoes are the most QC-heavy category for a reason: small shape differences show on feet and in photos. Use this checklist when your warehouse pictures land.",
    cardDescription:
      "What to inspect on sneaker and boot QC photos before you ship.",
    sections: [
      {
        heading: "Order match",
        paragraphs: [
          "Verify the colorway, size label, and model name on the box or tongue tag match your order. Confirm left and right are the same batch — mixed batches happen rarely but are worth a glance.",
        ],
      },
      {
        heading: "Shape and symmetry",
        level: 3,
        paragraphs: [
          "Compare toe box height, heel curve, and ankle collar on both shoes. Look head-on and from the back. Noticeable asymmetry can mean a bad pair or a rushed batch.",
        ],
      },
      {
        heading: "Midsole and outsole",
        level: 3,
        paragraphs: [
          "Check midsole stitching, paint lines, and glue residue. Flip to the sole for tread pattern and any factory defects. Press photos should show embossing depth if the style uses it.",
        ],
      },
      {
        heading: "Upper materials and stitching",
        level: 3,
        paragraphs: [
          "Scan panel alignment, swoosh or stripe placement, and perforation spacing. Loose threads and minor glue are common at lower price points — decide what you can live with before approving.",
        ],
      },
      {
        heading: "Tags, insoles, and extras",
        level: 3,
        paragraphs: [
          "Read size tags, insole print, and extra laces if included. Missing accessories are easier to fix at the warehouse than after customs.",
        ],
        links: [
          { href: "/categories/shoes", label: "Browse shoe finds" },
          { href: "/guides/how-to-check-qc-photos", label: "How to check QC photos" },
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need QC for cheap slides or sandals?",
        answer:
          "Still worth a quick check for correct size and obvious damage. Full angle-by-angle review matters less than on structured sneakers.",
      },
      {
        question: "What is the most common shoe QC fail?",
        answer:
          "Wrong size shipped or color shade noticeably off from the listing. Shape issues rank next — especially on popular silhouettes where batches vary.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "qc-checklist-for-clothing": buildGuide("qc-checklist-for-clothing", "qc", {
    title: "QC Checklist for Clothing",
    metaDescription:
      "Clothing QC checklist for hoodies, jackets, tees, and pants — prints, tags, zippers, and fit checks on warehouse photos.",
    badge: "Clothing QC",
    h1: "QC checklist for clothing",
    intro:
      "Apparel flaws are often fixable or acceptable — until they are not. Prints crooked by an inch, wrong size tag, or a broken zipper are things you want to catch in the warehouse, not on your doorstep.",
    cardDescription:
      "Hoodies, tees, jackets — what to verify on clothing QC.",
    sections: [
      {
        heading: "Confirm what you ordered",
        paragraphs: [
          "Match color, size on the wash tag, and style details like hood drawstrings or cuff ribbing. Compare against the listing screenshot you saved at purchase time.",
        ],
      },
      {
        heading: "Print and embroidery",
        level: 3,
        paragraphs: [
          "Check front and back graphics for centering, cracking, or misaligned layers. Embroidery should sit flat without loose threads pulling the fabric.",
        ],
      },
      {
        heading: "Zippers, buttons, and hardware",
        level: 3,
        paragraphs: [
          "Run the zipper in photos if staff provide a video or multiple angles. Confirm button count, snap alignment, and pocket bags are intact.",
        ],
      },
      {
        heading: "Fabric, stitching, and smell",
        level: 3,
        paragraphs: [
          "Look for holes, uneven dye, or loose hems. Strong chemical smell sometimes fades with air — heavy staining usually does not.",
        ],
        links: [
          { href: "/categories/hoodies", label: "Hoodie finds" },
          { href: "/categories/jackets", label: "Jacket finds" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can I judge fit from QC photos?",
        answer:
          "Only roughly. Lay-flat shots help compare length and chest width to size charts. When in doubt, size up on Chinese listings and read buyer notes.",
      },
      {
        question: "Are wash tags important?",
        answer:
          "They confirm size and sometimes batch. Wrong tag often means wrong size was picked from shelf — flag it before shipping.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "qc-checklist-for-bags": buildGuide("qc-checklist-for-bags", "qc", {
    title: "QC Checklist for Bags",
    metaDescription:
      "Bag QC checklist — leather grain, hardware, stitching, logos, and interior checks on warehouse photos before you ship.",
    badge: "Bag QC",
    h1: "QC checklist for bags",
    intro:
      "Bags combine materials, hardware, and structure. QC photos help you catch bent clasps, sloppy stitching, or a lining tear before the parcel crosses borders.",
    cardDescription:
      "Totes, crossbodies, backpacks — bag QC in plain steps.",
    sections: [
      {
        heading: "Silhouette and structure",
        paragraphs: [
          "Check overall shape when stuffed lightly — slouching is normal on soft leather styles, but collapsed corners or twisted handles can signal poor construction.",
        ],
      },
      {
        heading: "Exterior materials",
        level: 3,
        paragraphs: [
          "Scan panels for scratches, uneven grain, or color bleeding at seams. Pebbled and smooth leathers show flaws differently — zoom where stress points meet stitching.",
        ],
      },
      {
        heading: "Hardware and straps",
        level: 3,
        paragraphs: [
          "Inspect clasps, zippers, D-rings, and logo plates for scratches or loose rivets. Confirm strap length adjustments work and edge paint is clean.",
        ],
      },
      {
        heading: "Interior and extras",
        level: 3,
        paragraphs: [
          "Open compartments in photos if provided. Check lining seams, pockets, and included dust bags or cards. Missing small accessories are worth a ticket while domestic return is still possible.",
        ],
        links: [
          { href: "/categories/bags", label: "Browse bag finds" },
          { href: "/guides/how-to-check-qc-photos", label: "QC photo guide" },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I request video for expensive bags?",
        answer:
          "Yes, if the agent offers it. A short clip showing zipper pull and strap drop can reveal issues still photos miss.",
      },
      {
        question: "What if hardware color looks slightly off?",
        answer:
          "Lighting skews metal tones. Ask for outdoor or neutral light re-shots if gold vs silver or brushed vs shiny matters to you.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "how-shipping-works-with-agents": buildGuide(
    "how-shipping-works-with-agents",
    "qc",
    {
      title: "How Shipping Works With Agents",
      metaDescription:
        "How agent shipping works — warehouse storage, shipping lines, declared value, tracking, and why most buyers ship items together in a haul.",
      badge: "Shipping guide",
      h1: "How shipping works with agents",
      intro:
        "Buying is only half the journey. After QC, you choose when and how items leave the warehouse. Understanding shipping lines and haul timing saves money and avoids storage surprises.",
      cardDescription:
        "Warehouse to your door — lines, hauls, and tracking explained.",
      sections: [
        {
          heading: "Warehouse storage comes first",
          paragraphs: [
            "Items sit in your agent account after QC approval. Free storage has a time limit — check LitBuy's policy so approved pairs do not accumulate fees while you hunt for more pieces.",
          ],
        },
        {
          heading: "Building a haul",
          paragraphs: [
            "A haul is multiple warehouse items packed into one international parcel. Shipping three pieces together usually lowers cost per item than three separate shipments because you pay base freight once.",
          ],
          links: [
            { href: "/guides/how-shipping-works-with-agents", label: "Shipping and hauls" },
            {
              href: "/guides/what-to-check-before-shipping-your-haul",
              label: "Pre-ship checklist",
            },
          ],
        },
        {
          heading: "Picking a shipping line",
          paragraphs: [
            "Lines trade off speed, price, and tracking detail. What works for Western Europe may differ from the US or Australia. Read recent buyer notes for your country before you commit to the cheapest option.",
          ],
        },
        {
          heading: "Declaration, insurance, and delivery",
          paragraphs: [
            "You will choose declared value and optional insurance. Tracking updates through customs and local carrier handoff. Keep your phone reachable — some carriers require signature on delivery.",
          ],
        },
      ],
      faqs: [
        {
          question: "Can I ship one item immediately?",
          answer:
            "Yes. Single-item shipping is fine for a first test order. Just expect higher per-item freight than a bundled haul.",
        },
        {
          question: "Does removing shoe boxes save weight?",
          answer:
            "Often yes. Many agents offer box removal or vacuum packing. It lowers weight but increases crease risk — decide per pair.",
        },
      ],
      relatedLinks: [...CORE_LINKS],
    }
  ),

  "what-to-check-before-shipping-your-haul": buildGuide(
    "what-to-check-before-shipping-your-haul",
    "qc",
    {
      title: "What to Check Before Shipping Your Haul",
      metaDescription:
        "Pre-ship haul checklist — QC approvals, address, shipping line, declared value, and last-minute warehouse options before you pay freight.",
      badge: "Pre-ship checklist",
      h1: "What to check before shipping your haul",
      intro:
        "Submitting a haul is the point of no return for easy fixes. Run through this list when every item is in the warehouse and you are ready to pay international shipping.",
      cardDescription:
        "Last checks before you pay freight and seal the box.",
      sections: [
        {
          heading: "Every item is QC-approved",
          paragraphs: [
            "Open each order and confirm you GL'd the photos. Unapproved or pending QC items should not be in the parcel unless you accept shipping blind.",
          ],
          links: [
            { href: "/guides/how-to-check-qc-photos", label: "How to check QC" },
            { href: "/guides/qc-checklist-for-shoes", label: "Shoe checklist" },
          ],
        },
        {
          heading: "Address and contact details",
          paragraphs: [
            "Double-check recipient name, street, unit number, postal code, and phone. Typos cause returns at local carriers and delay customs.",
          ],
        },
        {
          heading: "Shipping line and timing",
          paragraphs: [
            "Re-read estimated delivery and weight charge rules. If you added items last minute, refresh the weight estimate before checkout.",
          ],
          links: [
            {
              href: "/guides/how-shipping-works-with-agents",
              label: "How agent shipping works",
            },
          ],
        },
        {
          heading: "Optional warehouse services",
          paragraphs: [
            "Decide on box removal, vacuum seal, stretch wrap, or insurance while you still can. Removing packaging saves grams; extra protection helps fragile pieces.",
          ],
        },
      ],
      faqs: [
        {
          question: "Can I split one haul into two parcels?",
          answer:
            "Most agents let you create multiple outbound shipments from the same warehouse inventory. Useful if you want faster shoes while heavier coats go economy.",
        },
        {
          question: "What if I ship and then spot a QC issue?",
          answer:
            "Contact support immediately, but fixes are harder once freight is paid. That is why pre-ship review matters more than post-ship panic.",
        },
      ],
      relatedLinks: [...CORE_LINKS],
    }
  ),
};
