"use client";

import { useEffect, useState } from "react";
import RegisterLink from "@/components/RegisterLink";

const SCROLL_THRESHOLD = 480;

export default function MobileStickySignup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-14 z-[45] px-3 sm:hidden">
      <RegisterLink
        location="mobile_sticky_signup"
        className="pointer-events-auto mx-auto flex max-w-sm items-center justify-center rounded-full border border-accent/35 bg-background/95 px-5 py-2.5 text-xs font-black text-accent shadow-lg backdrop-blur-md"
      >
        Start with LitBuy
      </RegisterLink>
    </div>
  );
}
