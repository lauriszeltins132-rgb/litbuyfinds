"use client";

import { useEffect, useState } from "react";
import RegisterLink from "@/components/RegisterLink";
import { REGISTER_CTA_LABEL } from "@/lib/constants";

const SCROLL_THRESHOLD = 640;

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
    <div className="mobile-sticky-signup sm:hidden">
      <RegisterLink location="mobile_sticky_signup" className="mobile-sticky-signup__btn">
        {REGISTER_CTA_LABEL}
      </RegisterLink>
    </div>
  );
}
