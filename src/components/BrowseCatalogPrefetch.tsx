"use client";

import { useEffect } from "react";
import { prefetchBrowseCatalog } from "@/lib/browse-catalog";

export default function BrowseCatalogPrefetch() {
  useEffect(() => {
    void prefetchBrowseCatalog();
  }, []);

  return null;
}
