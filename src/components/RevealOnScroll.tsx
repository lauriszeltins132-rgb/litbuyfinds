"use client";

import type { ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type RevealOnScrollProps = {
  children: ReactNode;
  className?: string;
};

export default function RevealOnScroll({
  children,
  className = "",
}: RevealOnScrollProps) {
  const { ref, inView } = useInView({ rootMargin: "0px 0px -6% 0px" });

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${inView ? "reveal-on-scroll--visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
