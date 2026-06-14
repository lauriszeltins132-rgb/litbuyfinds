"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ConversionContextValue = {
  uniqueProductViews: number;
  recordProductView: (productId: string) => void;
  dismissNudge: (key: string) => void;
  isNudgeDismissed: (key: string) => boolean;
};

const ConversionContext = createContext<ConversionContextValue | null>(null);

const SESSION_VIEWS_KEY = "litbuy-session-product-views";

function readViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(SESSION_VIEWS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeViewedIds(ids: string[]) {
  sessionStorage.setItem(SESSION_VIEWS_KEY, JSON.stringify(ids));
}

export function ConversionProvider({ children }: { children: React.ReactNode }) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setViewedIds(readViewedIds());
    setHydrated(true);
  }, []);

  const recordProductView = useCallback((productId: string) => {
    setViewedIds((prev) => {
      if (prev.includes(productId)) return prev;
      const next = [...prev, productId];
      writeViewedIds(next);
      return next;
    });
  }, []);

  const dismissNudge = useCallback((key: string) => {
    setDismissed((prev) => ({ ...prev, [key]: true }));
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // ignore
    }
  }, []);

  const isNudgeDismissed = useCallback(
    (key: string) => {
      if (dismissed[key]) return true;
      if (typeof window === "undefined") return false;
      return sessionStorage.getItem(key) === "1";
    },
    [dismissed]
  );

  const value = useMemo(
    () => ({
      uniqueProductViews: hydrated ? viewedIds.length : 0,
      recordProductView,
      dismissNudge,
      isNudgeDismissed,
    }),
    [hydrated, viewedIds.length, recordProductView, dismissNudge, isNudgeDismissed]
  );

  return (
    <ConversionContext.Provider value={value}>{children}</ConversionContext.Provider>
  );
}

export function useConversion() {
  const context = useContext(ConversionContext);
  if (!context) {
    throw new Error("useConversion must be used within ConversionProvider");
  }
  return context;
}
