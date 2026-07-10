"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "litbuyfinds-recently-viewed";
const MAX_ITEMS = 12;

type RecentlyViewedSnapshot = Pick<
  Product,
  | "id"
  | "product_name"
  | "category"
  | "category_slug"
  | "sheet"
  | "price"
  | "image"
  | "affiliate_link"
  | "qc_link"
  | "group"
>;

type RecentlyViewedContextValue = {
  items: Product[];
  addViewed: (product: RecentlyViewedSnapshot) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(
  null
);

function snapshotToProduct(snapshot: RecentlyViewedSnapshot): Product {
  return {
    id: snapshot.id,
    product_name: snapshot.product_name,
    category: snapshot.category,
    category_slug: snapshot.category_slug,
    sheet: snapshot.sheet,
    price: snapshot.price,
    image: snapshot.image,
    affiliate_link: snapshot.affiliate_link,
    qc_link: snapshot.qc_link,
    group: snapshot.group,
  };
}

export function RecentlyViewedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const snapshots = JSON.parse(raw) as RecentlyViewedSnapshot[];
      setItems(
        snapshots
          .map(snapshotToProduct)
          .filter((product) => Boolean(product.id && product.image))
      );
    } catch {
      // ignore
    }
  }, []);

  const addViewed = useCallback((product: RecentlyViewedSnapshot) => {
    setItems((current) => {
      const nextSnapshots = [
        product,
        ...current
          .filter((item) => item.id !== product.id)
          .map(
            (item): RecentlyViewedSnapshot => ({
              id: item.id,
              product_name: item.product_name,
              category: item.category,
              category_slug: item.category_slug,
              sheet: item.sheet,
              price: item.price,
              image: item.image,
              affiliate_link: item.affiliate_link,
              qc_link: item.qc_link,
              group: item.group,
            })
          ),
      ].slice(0, MAX_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSnapshots));
      } catch {
        // ignore
      }

      return nextSnapshots.map(snapshotToProduct);
    });
  }, []);

  const value = useMemo(
    () => ({ items, addViewed }),
    [items, addViewed]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  }
  return context;
}
