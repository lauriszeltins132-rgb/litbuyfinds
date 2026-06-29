export type ImageUrlIssue =
  | "empty"
  | "malformed"
  | "invalid_protocol"
  | "invalid_host"
  | "suspicious_path";

export type ImageUrlValidation = {
  valid: boolean;
  normalized: string;
  issue?: ImageUrlIssue;
};

const ALLOWED_HOSTS = new Set([
  "i.postimg.cc",
  "postimg.cc",
  "postimages.org",
  "i.postimages.org",
  "si.geilicdn.com",
  "cbu01.alicdn.com",
  "img.alicdn.com",
  "ae01.alicdn.com",
  "sc04.alicdn.com",
  "gd4.alicdn.com",
]);

/** Strip junk characters often pasted into spreadsheet image fields. */
export function sanitizeImageUrl(raw: string | null | undefined): string {
  if (!raw) return "";

  let url = raw.trim();
  if (!url) return "";

  // Remove wrapping quotes and trailing punctuation from bad imports.
  url = url.replace(/^['"“”‘’]+|['"“”‘’]+$/g, "");
  url = url.replace(/[，。、；]+$/g, "");
  url = url.replace(/(\.(?:png|jpe?g|webp|gif)).*$/i, "$1");
  url = url.replace(/[^a-zA-Z0-9/_%.?=&-]+$/g, "");
  url = url.replace(/[)"']+$/g, "");

  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  return url.trim();
}

export function validateImageUrl(raw: string | null | undefined): ImageUrlValidation {
  const normalized = sanitizeImageUrl(raw);
  if (!normalized) {
    return { valid: false, normalized: "", issue: "empty" };
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return { valid: false, normalized, issue: "malformed" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, normalized, issue: "invalid_protocol" };
  }

  const host = parsed.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) {
    return { valid: false, normalized, issue: "invalid_host" };
  }

  if (!parsed.pathname || parsed.pathname === "/") {
    return { valid: false, normalized, issue: "suspicious_path" };
  }

  return { valid: true, normalized };
}

export function isUsableImageUrl(raw: string | null | undefined): boolean {
  return validateImageUrl(raw).valid;
}

/** Reject tiny/error placeholder responses that still decode as images. */
export function hasPlausibleImageDimensions(
  width: number,
  height: number
): boolean {
  return width >= 24 && height >= 24;
}
