import deadData from "@/data/dead-image-urls.json";

type DeadImageManifest = {
  urls: string[];
};

const manifest = deadData as DeadImageManifest;
const deadSet = new Set(manifest.urls ?? []);

export function isDeadImageUrl(url: string): boolean {
  if (!url) return true;
  return deadSet.has(url);
}
