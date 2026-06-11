import manifest from "@/data/bright-bg-manifest.json";

export type BrightBgTreatment = "none" | "matte" | "vignette";

type BrightBgManifest = {
  urls: Record<string, BrightBgTreatment>;
};

const catalog = manifest as BrightBgManifest;

export function getCatalogBrightBgTreatment(url: string): BrightBgTreatment {
  return catalog.urls[url] ?? "none";
}
