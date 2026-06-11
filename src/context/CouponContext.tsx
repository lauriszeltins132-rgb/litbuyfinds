"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type CouponContextValue = {
  isOpen: boolean;
  openCoupon: () => void;
  closeCoupon: () => void;
};

const CouponContext = createContext<CouponContextValue | null>(null);
const DISMISS_KEY = "litbuy-finds-offer-dismissed";
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000;

function isDismissedRecently(): boolean {
  try {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) return false;
    const dismissedAt = Number(dismissed);
    if (!Number.isFinite(dismissedAt)) return false;
    return Date.now() - dismissedAt < DISMISS_MS;
  } catch {
    return false;
  }
}

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCoupon = useCallback(() => {
    if (isDismissedRecently()) return;
    setIsOpen(true);
  }, []);

  const closeCoupon = useCallback(() => {
    setIsOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo(
    () => ({ isOpen, openCoupon, closeCoupon }),
    [isOpen, openCoupon, closeCoupon]
  );

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
}

export function useCoupon() {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within CouponProvider");
  }
  return context;
}
