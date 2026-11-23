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
  source: string;
  openCoupon: (source?: string) => boolean;
  openCouponForce: (source?: string) => void;
  closeCoupon: (reason?: string) => void;
};

const CouponContext = createContext<CouponContextValue | null>(null);
const DISMISS_KEY = "litbuy-finds-offer-dismissed";
const SESSION_KEY = "litbuy-offer-popup-session";
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

function markSessionShown() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // ignore
  }
}

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState("engagement");

  const openCoupon = useCallback((nextSource = "engagement") => {
    if (isDismissedRecently()) return false;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
    } catch {
      // ignore
    }
    markSessionShown();
    setSource(nextSource);
    setIsOpen(true);
    return true;
  }, []);

  const openCouponForce = useCallback((nextSource = "manual_header") => {
    markSessionShown();
    setSource(nextSource);
    setIsOpen(true);
  }, []);

  const closeCoupon = useCallback((_reason?: string) => {
    setIsOpen(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo(
    () => ({ isOpen, source, openCoupon, openCouponForce, closeCoupon }),
    [isOpen, source, openCoupon, openCouponForce, closeCoupon]
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
