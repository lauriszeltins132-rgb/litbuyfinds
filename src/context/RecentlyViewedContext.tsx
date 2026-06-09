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
import { getProductById } from "@/lib/products";

const STORAGE_KEY = "litbuyfinds-recently-viewed";
const MAX_ITEMS = 12;

type RecentlyViewedContextValue = {
  items: Product[];
  addViewed: (productId: string) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(
  null
);

export function RecentlyViewedProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIds(JSON.parse(raw) as string[]);
    } catch {
      // ignore
    }
  }, []);

  const addViewed = useCallback(
    (productId: string) => {
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
    },
    []
  );

  const items = useMemo(
    () =>
      ids
        .map((id) => getProductById(id))
        .filter((product): product is Product => Boolean(product)),
    [ids]
  );

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
