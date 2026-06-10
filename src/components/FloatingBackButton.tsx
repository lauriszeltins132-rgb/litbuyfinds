"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

function ArrowLeftIcon() {
  return (
    <svg
      className="floating-back-btn__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function FloatingBackButton() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    const hasPreviousPage = window.history.length > 1;

    if (hasPreviousPage) {
      window.history.back();
      return;
    }

    router.push("/");
  }, [router]);

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="floating-back-btn"
    >
      <ArrowLeftIcon />
    </button>
  );
}
