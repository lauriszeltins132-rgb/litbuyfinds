import { buildGuide } from "./build";
import { CORE_LINKS } from "./shared";
import type { GuidePage } from "./types";

export const BUDGET_GUIDES: Record<string, GuidePage> = {
  "best-budget-finds": buildGuide("best-budget-finds", "budget", {
    title: "How to Browse Budget Finds",
    metaDescription:
      "How to browse budget finds on LitBuy Finds — price caps, deals pages, top budget lists, and building a cart without sticker shock.",
    badge: "Budget guide",
    h1: "How to browse budget finds",
    intro:
      "Budget browsing is not about finding the single cheapest row — it is about staying inside a price lane while still getting pieces you will wear. Use dedicated budget pages instead of scrolling the full catalog.",
    cardDescription:
      "Price caps, deals lanes, and smart budget browsing.",
    sections: [
      {
        heading: "Start with budget collections",
        paragraphs: [
          "Top budget lists curate lower-priced rows from spreadsheet imports. They save time compared to mentally filtering a 3,000-item catalog.",
          "Treat these pages as entry points — when something catches your eye, open the product page and confirm price and size before buying through LitBuy.",
        ],
        links: [{ href: "/top-budget-finds", label: "Top budget finds" }],
      },
      {
        heading: "Use the under-$30 deals lane",
        paragraphs: [
          "The deals page focuses on sub-$30 listings — strong for test pieces, basics, and accessories. Pair one deal item with a mid-tier main piece rather than filling a haul with only the lowest rows.",
        ],
        links: [{ href: "/deals", label: "Deals under $30" }],
      },
      {
        heading: "Remember shipping is not the listing price",
        paragraphs: [
          "A $20 tee plus agent fees plus international freight changes the real total. Budget browsing works best when you plan a small multi-item haul to spread shipping cost.",
        ],
        links: [{ href: "/guides/how-shipping-works-with-agents", label: "Shipping and hauls" }],
      },
      {
        heading: "Cross-browse categories for hidden value",
        paragraphs: [
          "Not every affordable row lands on budget collections immediately. Recently added and category pages sometimes surface cheap basics before they hit editorial lists.",
        ],
        links: [
          { href: "/recently-added", label: "Recently added" },
          { href: "/categories", label: "All categories" },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I only buy from budget collections?",
        answer:
          "No — use them as a filter. Category pages and brand pages still have lower-priced rows that have not been added to a collection yet.",
      },
      {
        question: "How many budget items make sense per haul?",
        answer:
          "Many buyers mix two or three budget pieces with one main item they care more about. That balances shipping cost against QC attention.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-finds-under-30": buildGuide("best-finds-under-30", "budget", {
    title: "How to Browse Finds Under $30",
    metaDescription:
      "How to browse finds under $30 on LitBuy Finds — deals page tips, budget collections, and what to expect at this price point.",
    badge: "Budget guide",
    h1: "How to browse finds under $30",
    intro:
      "The under-$30 lane is where most buyers experiment — first hoodies, casual tees, simple accessories. Browse with realistic expectations about materials and batch variation at this tier.",
    cardDescription:
      "Sub-$30 browsing — deals, lists, and smart expectations.",
    sections: [
      {
        heading: "Open the deals page first",
        paragraphs: [
          "The deals page is built around the under-$30 band. Start here for a tight scroll instead of filtering the entire site manually.",
        ],
        links: [{ href: "/deals", label: "Deals under $30" }],
      },
      {
        heading: "Cross-check the budget top list",
        paragraphs: [
          "The top budget list overlaps with deals but may include slightly different rows depending on import timing. Browse both when you want maximum coverage under $30.",
        ],
        links: [{ href: "/top-budget-finds", label: "Top budget finds" }],
      },
      {
        heading: "Prioritize item types that work at $30",
        paragraphs: [
          "Tees, basic hoodies, socks, caps, and simple accessories tend to make sense in this band. Complex outerwear and leather goods rarely sit here — if they do, read listings carefully.",
        ],
        links: [
          { href: "/categories/tshirts", label: "T-shirts" },
          { href: "/categories/accessories", label: "Accessories" },
        ],
      },
      {
        heading: "Use QC when the price looks too good",
        paragraphs: [
          "Very low prices can mean older batches or simplified construction. When QC links exist, use them before adding multiple cheap rows to one haul.",
        ],
        links: [{ href: "/guides/how-to-check-qc-photos", label: "QC photo guide" }],
      },
    ],
    faqs: [
      {
        question: "Is under $30 the same as the deals page?",
        answer:
          "Mostly — deals centers on that band. Budget top lists may include nearby price points. Always confirm the price on the product page.",
      },
      {
        question: "What is a good first under-$30 purchase?",
        answer:
          "A basic tee or simple accessory is a low-risk way to learn the agent workflow before spending more on shoes or jackets.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-finds-under-50": buildGuide("best-finds-under-50", "budget", {
    title: "How to Browse Finds Under $50",
    metaDescription:
      "How to browse finds under $50 on LitBuy Finds — mid-budget lane, top under-50 list, and how to stretch fifty dollars across a haul.",
    badge: "Budget guide",
    h1: "How to browse finds under $50",
    intro:
      "Fifty dollars opens mid-tier options — better hoodies, entry sneakers, and small leather goods. Browse the dedicated under-$50 collection, then drill into categories for pieces that justify the extra spend.",
    cardDescription:
      "Mid-budget browsing — more room for hoodies, shoes, and layers.",
    sections: [
      {
        heading: "Start with the under-$50 top list",
        paragraphs: [
          "The top products under $50 page groups catalog rows in a mid-budget band. Use it when $30 deals feel too basic but you are not ready for premium price tiers.",
        ],
        links: [{ href: "/top-products-under-50", label: "Top finds under $50" }],
      },
      {
        heading: "Compare $30 vs $50 tiers consciously",
        paragraphs: [
          "The jump from deals to under-$50 often buys better fabric, stitching, or branding detail — but not always. Open parallel listings in both lanes when deciding if the extra $15–$20 matters.",
        ],
        links: [{ href: "/deals", label: "Deals under $30" }],
      },
      {
        heading: "Stretch $50 across one anchor plus extras",
        paragraphs: [
          "One $35 hoodie plus a $15 accessory beats two mediocre $25 pieces for many buyers. Browse with one anchor item in mind, then fill gaps from categories.",
        ],
        links: [{ href: "/categories/hoodies", label: "Hoodies" }],
      },
      {
        heading: "Check shoes and streetwear at this price",
        paragraphs: [
          "Entry footwear and coordinated sweats often land near $50. Browse shoes and streetwear categories when your budget cap is firm but flexible on product type.",
        ],
        links: [
          { href: "/categories/shoes", label: "Shoes" },
          { href: "/categories/hoodies-and-pants", label: "Streetwear" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is under $50 better quality than under $30?",
        answer:
          "Often, but not automatically. Price suggests batch tier — still compare photos, QC, and listing notes rather than assuming every $45 row beats every $28 row.",
      },
      {
        question: "Can I build a full outfit under $50?",
        answer:
          "Possible with a tee and accessory, harder with shoes and outerwear included. Most buyers use $50 for one or two meaningful pieces per haul.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-summer-finds": buildGuide("best-summer-finds", "budget", {
    title: "How to Browse Summer Finds",
    metaDescription:
      "How to browse summer finds on LitBuy Finds — tees, shorts, warm-weather categories, and trending drops for hot-season rotation.",
    badge: "Budget guide",
    h1: "How to browse summer finds",
    intro:
      "Summer browsing is about breathable layers and lighter haul weight. Focus on tees, shorts, and thin outerwear — bulky winter pieces ship expensive and sit in storage.",
    cardDescription:
      "Tees, shorts, and warm-weather rotation — browse summer finds.",
    sections: [
      {
        heading: "Use the warm-weather category",
        paragraphs: [
          "T-shirts and shorts share a combined category because curators group summer fits together. Start here instead of browsing hoodies and coats by mistake.",
        ],
        links: [{ href: "/categories/tshirts-and-shorts", label: "T-shirts and shorts" }],
      },
      {
        heading: "Check trending for seasonal drops",
        paragraphs: [
          "New summer graphics and mesh pieces spike on trending when sheet imports refresh. Pair category browsing with trending when you want current styles.",
        ],
        links: [{ href: "/trending", label: "Trending finds" }],
      },
      {
        heading: "Keep haul weight low",
        paragraphs: [
          "Summer carts should stay light — multiple tees and shorts ship cheaper than a puffer you will not wear for months. Browse with parcel weight in mind.",
        ],
        links: [{ href: "/guides/how-shipping-works-with-agents", label: "Shipping and hauls" }],
      },
      {
        heading: "Add one light accessory",
        paragraphs: [
          "Caps, sunglasses, and light crossbody bags complete summer fits without heavy freight. Browse accessories after core tops and shorts are picked.",
        ],
        links: [{ href: "/categories/accessories", label: "Accessories" }],
      },
    ],
    faqs: [
      {
        question: "When should I start browsing summer finds?",
        answer:
          "Six to eight weeks before your local warm season gives time for warehouse arrival, QC, and shipping. Trending refreshes often lead retail seasons slightly.",
      },
      {
        question: "Are summer finds only budget items?",
        answer:
          "No — summer is a season lane, not a price lane. You will find budget tees and mid-tier branded shorts in the same warm-weather category.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-winter-finds": buildGuide("best-winter-finds", "budget", {
    title: "How to Browse Winter Finds",
    metaDescription:
      "How to browse winter finds on LitBuy Finds — coats, puffers, layering, and the outerwear category for cold-season shopping.",
    badge: "Budget guide",
    h1: "How to browse winter finds",
    intro:
      "Winter browsing means insulation, layering, and heavier haul weight. Start in outerwear categories, then add mid-layers — not the other way around.",
    cardDescription:
      "Coats, puffers, and layering — browse winter outerwear.",
    sections: [
      {
        heading: "Open coats and jackets first",
        paragraphs: [
          "The coats and jackets category collects puffers, parkas, and insulated shells. Anchor your winter cart here before adding hoodies underneath.",
        ],
        links: [{ href: "/categories/coats-and-jackets", label: "Coats and jackets" }],
      },
      {
        heading: "Layer with hoodies and knits",
        paragraphs: [
          "A winter outfit is outer plus mid plus base. After picking a coat, browse hoodies for mid-layers that fit under the shell without bulk.",
        ],
        links: [{ href: "/categories/hoodies", label: "Hoodies" }],
      },
      {
        heading: "Browse brand pages for down and badges",
        paragraphs: [
          "Moncler and similar labels cluster in outerwear searches. Brand pages help compare quilting and length when thumbnails look alike.",
        ],
        links: [{ href: "/brands/moncler", label: "Moncler finds" }],
      },
      {
        heading: "Plan haul weight early",
        paragraphs: [
          "Winter items are heavy — multiple coats in one parcel get expensive fast. Browse with one outerwear anchor per haul unless you are consolidating deliberately.",
        ],
        links: [{ href: "/guides/how-shipping-works-with-agents", label: "Shipping guide" }],
      },
    ],
    faqs: [
      {
        question: "How early should I order winter finds?",
        answer:
          "Order before your first cold snap — international shipping and warehouse QC can take weeks. Browse outerwear categories in late summer or early fall.",
      },
      {
        question: "Are winter finds more expensive to ship?",
        answer:
          "Usually yes — insulation and heavy fabrics add weight. Factor freight into your budget alongside listing price.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-back-to-school-finds": buildGuide("best-back-to-school-finds", "budget", {
    title: "How to Browse Back-to-School Finds",
    metaDescription:
      "How to browse back-to-school finds on LitBuy Finds — backpacks, basics, budget deals, and category browsing for a campus rotation.",
    badge: "Budget guide",
    h1: "How to browse back-to-school finds",
    intro:
      "Back-to-school browsing is practical — backpacks, everyday tees, hoodies, and affordable shoes. Build a rotation cart across categories and deals instead of one expensive statement piece.",
    cardDescription:
      "Backpacks, basics, and campus rotation — browse smart.",
    sections: [
      {
        heading: "Map categories to your weekly rotation",
        paragraphs: [
          "Think Mon–Fri outfits: tees, hoodies, pants, one bag, one shoe pair. Browse each category separately so you do not end up with five hoodies and no bottoms.",
        ],
        links: [{ href: "/categories", label: "All categories" }],
      },
      {
        heading: "Pull budget pieces from deals",
        paragraphs: [
          "Basics and accessories fit the deals lane well. Stack affordable tees and socks, then allocate more budget to shoes or a backpack.",
        ],
        links: [{ href: "/deals", label: "Deals under $30" }],
      },
      {
        heading: "Browse bags for campus carry",
        paragraphs: [
          "Backpacks and totes live in the bag category. Compare strap padding and compartment layout in photos — you will use this daily.",
        ],
        links: [{ href: "/categories/bags", label: "Bags" }],
      },
      {
        heading: "Order early for QC buffer",
        paragraphs: [
          "School start dates do not wait for slow shipping lines. Browse and buy with enough lead time for warehouse QC and freight.",
        ],
        links: [{ href: "/guides/how-to-order-from-litbuy", label: "How to order" }],
      },
    ],
    faqs: [
      {
        question: "What should I buy first for back-to-school?",
        answer:
          "Backpack or daily shoes first — hardest to substitute last minute. Then fill tees and hoodies from deals and category pages.",
      },
      {
        question: "Can I outfit a week on a tight budget?",
        answer:
          "Yes if you lean on deals for tops and one mid-tier shoe or bag anchor. Browse categories systematically instead of impulse-adding trending pieces.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),

  "best-gym-finds": buildGuide("best-gym-finds", "budget", {
    title: "How to Browse Gym Finds",
    metaDescription:
      "How to browse gym finds on LitBuy Finds — joggers, trainers, athletic layers, and categories for workout rotation.",
    badge: "Budget guide",
    h1: "How to browse gym finds",
    intro:
      "Gym browsing splits across bottoms, shoes, and light tops. Performance matters less in catalog photos than fit and fabric — browse categories with movement and wash frequency in mind.",
    cardDescription:
      "Joggers, trainers, and gym layers — browse by category.",
    sections: [
      {
        heading: "Start with streetwear for joggers and hoodies",
        paragraphs: [
          "Training joggers and zip hoodies often tag into the streetwear category alongside lifestyle pieces. Search sweatpant, jogger, or zip on that page for athletic cuts.",
        ],
        links: [{ href: "/categories/hoodies-and-pants", label: "Streetwear category" }],
      },
      {
        heading: "Browse shoes separately",
        paragraphs: [
          "Gym shoes need stable fit — browse the shoes category with your training type in mind. Running, lifting, and casual trainers list under different keywords.",
        ],
        links: [{ href: "/categories/shoes", label: "Shoe category" }],
      },
      {
        heading: "Keep tops simple and washable",
        paragraphs: [
          "Basic tees and tanks from the t-shirt category work for gym rotation. Budget deals lanes are useful when you want multiple identical tops for the week.",
        ],
        links: [
          { href: "/categories/tshirts", label: "T-shirts" },
          { href: "/deals", label: "Budget deals" },
        ],
      },
      {
        heading: "Add one gym bag if needed",
        paragraphs: [
          "Duffles and small backpacks from the bag category complete a gym setup. Lightweight options keep shipping reasonable alongside shoes.",
        ],
        links: [{ href: "/categories/bags", label: "Bags" }],
      },
    ],
    faqs: [
      {
        question: "Is there a dedicated gym category?",
        answer:
          "No — gym pieces spread across streetwear, shoes, and tees. Browse those three lanes with athletic keywords.",
      },
      {
        question: "Should gym shoes be my biggest spend?",
        answer:
          "Many buyers prioritize shoe fit and spend less on rotation tees. Browse shoes carefully for sizing notes before loading up on cheap tops.",
      },
    ],
    relatedLinks: [...CORE_LINKS],
  }),
};
