import {
  isPrivateOrBlockedHost,
  sanitizeCatalogUrl,
  validateCatalogUrl,
} from "@/lib/security/url-policy";
import allowlists from "@/data/url-allowlists.json";

export type ImageUrlIssue =
  | "empty"
  | "malformed"
  | "invalid_protocol"
  | "invalid_host"
  | "suspicious_path"
  | "credentials"
  | "private_host"
  | "nonstandard_port";

export type ImageUrlValidation = {
  valid: boolean;
  normalized: string;
  issue?: ImageUrlIssue;
};

const ALLOWED_HOSTS = new Set(
  allowlists.imageHosts.map((host) => host.toLowerCase())
);

/** Same-origin static assets for curated rails (not spreadsheet-sourced). */
const LOCAL_STATIC_IMAGE_PATH =
  /^\/sellers-collaboration\/[a-zA-Z0-9._-]+\.(?:jpe?g|png|webp)$/i;

/** Strip junk characters often pasted into spreadsheet image fields. */
export function sanitizeImageUrl(raw: string | null | undefined): string {
  if (!raw) return "";

  let url = sanitizeCatalogUrl(raw);
  if (!url) return "";

  // Keep extension-focused cleanup used by catalog imports.
  url = url.replace(/(\.(?:png|jpe?g|webp|gif)).*$/i, "$1");
  url = url.replace(/[^a-zA-Z0-9/_%.?=&-]+$/g, "");
  url = url.replace(/[)"']+$/g, "");

  return url.trim();
}

export function validateImageUrl(raw: string | null | undefined): ImageUrlValidation {
  const normalized = sanitizeImageUrl(raw);
  if (!normalized) {
    return { valid: false, normalized: "", issue: "empty" };
  }

  if (LOCAL_STATIC_IMAGE_PATH.test(normalized)) {
    return { valid: true, normalized };
  }

  const result = validateCatalogUrl(normalized, "image", {
    httpsOnly: false,
    requirePath: true,
  });

  if (!result.valid) {
    return {
      valid: false,
      normalized: result.normalized || normalized,
      issue: (result.issue as ImageUrlIssue) ?? "malformed",
    };
  }

  // Extra guard: reject credentialed / private hosts even if allowlist matched oddly.
  try {
    const parsed = new URL(result.normalized);
    if (parsed.username || parsed.password) {
      return { valid: false, normalized, issue: "credentials" };
    }
    if (isPrivateOrBlockedHost(parsed.hostname)) {
      return { valid: false, normalized, issue: "private_host" };
    }
  } catch {
    return { valid: false, normalized, issue: "malformed" };
  }

  return { valid: true, normalized: result.normalized };
}

export function isUsableImageUrl(raw: string | null | undefined): boolean {
  return validateImageUrl(raw).valid;
}

export function getAllowedImageHosts(): string[] {
  return [...ALLOWED_HOSTS];
}

/** Reject tiny/error placeholder responses that still decode as images. */
export function hasPlausibleImageDimensions(
  width: number,
  height: number
): boolean {
  return width >= 24 && height >= 24;
}
