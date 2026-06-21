"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/lib/types";
import { trackProductContext } from "@/lib/analytics-events";
import AgentSelectorModal from "./AgentSelectorModal";

type ProductBuyButtonProps = {
  product: Product;
  context: string;
  className: string;
  children?: ReactNode;
};

export default function ProductBuyButton({
  product,
  context,
  className,
  children = "Buy",
}: ProductBuyButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <AgentSelectorModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
        onContinue={(agentId) =>
          trackProductContext("buy_click", product, `${context}_${agentId}`)
        }
      />
    </>
  );
}
