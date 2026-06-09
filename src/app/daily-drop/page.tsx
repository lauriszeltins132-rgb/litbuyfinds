import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import DailyDrop from "@/components/DailyDrop";
import RelatedSeoLinks from "@/components/RelatedSeoLinks";
import { COLLECTIONS } from "@/lib/collections";
import { buildPageMetadata } from "@/lib/seo";

const collection = COLLECTIONS["daily-drop"];

export const metadata: Metadata = buildPageMetadata({
  title: collection.title,
  description: collection.description,
  path: collection.href,
});

export default function DailyDropPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Daily Drop" },
        ]}
      />

      <section className="px-4 pb-2 pt-4 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {collection.badge}
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{collection.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">
            {collection.intro}
          </p>
        </div>
      </section>

      <Suspense fallback={null}>
        <DailyDrop />
      </Suspense>

      <RelatedSeoLinks />

      <section className="px-4 pb-16 pt-4 text-center sm:px-6">
        <Link href="/trending" className="text-sm font-bold text-accent hover:underline">
          Browse more trending finds →
        </Link>
      </section>
    </>
  );
}
