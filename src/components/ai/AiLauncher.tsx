"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";

const AiPanel = dynamic(() => import("@/components/ai/AiPanel"), {
  ssr: false,
});

export default function AiLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        className="ai-launcher-fab"
        aria-label="Open LitBuy AI"
      >
        LitBuy AI
      </button>
      <AiPanel
        open={open}
        onClose={() => setOpen(false)}
        entryPoint="floating"
        returnFocusRef={buttonRef}
      />
    </>
  );
}
