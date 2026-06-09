"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CouponContextValue = {
  isOpen: boolean;
  openCoupon: () => void;
  closeCoupon: () => void;
};

const CouponContext = createContext<CouponContextValue | null>(null);
const SESSION_KEY = "litbuy-finds-offer-shown";

export function CouponProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const shown = sessionStorage.getItem(SESSION_KEY);
      if (!shown) {
        const timer = window.setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem(SESSION_KEY, "1");
        }, 1200);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setIsOpen(true), 1200);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const openCoupon = useCallback(() => setIsOpen(true), []);
  const closeCoupon = useCallback(() => setIsOpen(false), []);

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
