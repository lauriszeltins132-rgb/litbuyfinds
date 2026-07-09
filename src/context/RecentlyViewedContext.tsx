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

type RecentlyViewedContextValue = {
  items: Product[];
  addViewed: (productId: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(
  null
);

type ProductLookup = (id: string) => Product | undefined;

let productLookupPromise: Promise<ProductLookup> | null = null;

function loadProductLookup(): Promise<ProductLookup> {
  if (!productLookupPromise) {
    productLookupPromise = import("@/lib/products").then((mod) =>
      mod.getProductById.bind(mod)
    );
  }
  return productLookupPromise;
}

export function RecentlyViewedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (ids.length === 0) {
      setItems([]);
      return;
    }

    let cancelled = false;
    void loadProductLookup().then((lookup) => {
      if (cancelled) return;
      setItems(
        ids
          .map((id) => lookup(id))
          .filter((product): product is Product => Boolean(product))
      );
    });

    return () => {
      cancelled = true;
    };
  }, [ids]);

  const addViewed = useCallback((productId: string) => {
    setIds((current) => {
      const next = [productId, ...current.filter((id) => id !== productId)].slice(
        0,
        MAX_ITEMS
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
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
