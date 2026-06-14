"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import TextInput from "@/components/ui/TextInput";

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push("/#browse");
      return;
    }
    router.push(`/?q=${encodeURIComponent(trimmed)}#browse`);
  }

  return (
    <form onSubmit={handleSubmit} className="hero-search mx-auto w-full max-w-[700px]">
      <div className="hero-search__inner">
        <TextInput
          id="hero-search"
          value={query}
          onChange={setQuery}
          placeholder="Search Nike, Moncler, Jordan, bags, jackets..."
          type="search"
          icon={<SearchIcon className="h-5 w-5 text-muted" />}
          className="hero-search__input"
        />
        <button type="submit" className="hero-search__submit">
          Search finds
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted sm:text-xs">
        Verified links · QC references · Updated daily
      </p>
    </form>
  );
}
