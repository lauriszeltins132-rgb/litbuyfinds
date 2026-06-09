import Link from "next/link";

const tiles = [
  { href: "/trending", title: "Trending", desc: "What's hot right now", emoji: "🔥" },
  { href: "/latest", title: "Fresh Drops", desc: "Just added", emoji: "✨" },
  { href: "/deals", title: "Under $30", desc: "Budget picks", emoji: "💸" },
  { href: "/categories/shoes", title: "Shoes", desc: "Sneakers & more", emoji: "👟" },
  { href: "/categories/hoodies-and-pants", title: "Streetwear", desc: "Hoodies & pants", emoji: "🧥" },
  { href: "/brands", title: "Brands", desc: "Shop by label", emoji: "🏷️" },
  { href: "/categories", title: "Categories", desc: "All sections", emoji: "📂" },
  { href: "/wishlist", title: "Saved", desc: "Your wishlist", emoji: "♥" },
];

export default function BentoNav() {
  return (
    <section className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-muted">
          Explore
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="panel-shell group relative overflow-hidden rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_8px_30px_rgba(212,255,60,0.06)]"
            >
              <span className="text-2xl">{tile.emoji}</span>
              <h3 className="mt-3 font-bold text-foreground group-hover:text-accent">
                {tile.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{tile.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
