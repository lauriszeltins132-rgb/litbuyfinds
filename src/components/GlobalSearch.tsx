"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import ControlButton from "@/components/ui/ControlButton";
import TextInput from "@/components/ui/TextInput";

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5"
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

export default function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/?q=${encodeURIComponent(trimmed)}#browse`);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search finds"
        className="control-btn control-btn-ghost !min-h-0 !p-2"
      >
        <SearchIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-[180] flex items-start justify-center p-4 pt-24">
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="modal-enter panel-shell relative w-full max-w-xl rounded-3xl border border-border-strong p-5"
          >
            <p className="mb-4 text-sm font-bold text-foreground">Search finds</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <TextInput
                id="global-search"
                value={query}
                onChange={setQuery}
                placeholder="Search sneakers, brands, categories..."
                type="search"
                icon={<SearchIcon />}
              />
              <ControlButton type="submit" variant="primary" className="w-full sm:w-auto">
                Search
              </ControlButton>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
