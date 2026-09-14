/**
 * Shared URL allowlist policy for spreadsheet ingest scripts (Node ESM).
 * Reads the same allowlist JSON as the Next.js runtime.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const allowlists = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "src", "data", "url-allowlists.json"),
    "utf8"
  )
);

const IMAGE_HOSTS = new Set(allowlists.imageHosts.map((h) => h.toLowerCase()));
const IMAGE_SUFFIXES = allowlists.imageHostSuffixes.map((s) => s.toLowerCase());
const QC_HOSTS = new Set(allowlists.qcHosts.map((h) => h.toLowerCase()));
const AFFILIATE_HOSTS = new Set(
  allowlists.affiliateHosts.map((h) => h.toLowerCase())
);

const BLOCKED_HOSTS = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
  "metadata",
]);

function isIpv4(host) {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
}

function isPrivateOrLocalHost(hostname) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host) return true;
  if (BLOCKED_HOSTS.has(host)) return true;
  if (host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host === "::1" || host === "[::1]" || host === "0.0.0.0") return true;

  if (isIpv4(host)) {
    const parts = host.split(".").map(Number);
    if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return true;
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 198 && (b === 18 || b === 19)) return true;
  }

  if (host.includes(":")) {
    const h = host.replace(/^\[|\]$/g, "").toLowerCase();
    if (h === "::1") return true;
    if (h.startsWith("fc") || h.startsWith("fd")) return true;
    if (h.startsWith("fe80")) return true;
  }

  return false;
}

function hostAllowed(kind, hostname) {
  const host = hostname.toLowerCase();
  if (kind === "image") {
    if (IMAGE_HOSTS.has(host)) return true;
    return IMAGE_SUFFIXES.some((suffix) => host.endsWith(suffix));
  }
  if (kind === "qc") return QC_HOSTS.has(host);
  return AFFILIATE_HOSTS.has(host);
}

function defaultPortOk(protocol, port) {
  if (!port) return true;
  if (protocol === "https:" && port === "443") return true;
  if (protocol === "http:" && port === "80") return true;
  return false;
}

export function sanitizeCatalogUrl(raw) {
  if (!raw) return "";
  let url = String(raw).trim();
  if (!url) return "";
  url = url.replace(/^['"“”‘’]+|['"“”‘’]+$/g, "");
  url = url.replace(/[，。、；]+$/g, "");
  url = url.replace(/[)"']+$/g, "");
  if (url.startsWith("//")) url = `https:${url}`;
  return url.trim();
}

export function validateCatalogUrl(raw, kind, options = {}) {
  const httpsOnly = options.httpsOnly ?? kind !== "qc";
  const requirePath = options.requirePath ?? kind === "image";
  const normalized = sanitizeCatalogUrl(raw);

  if (!normalized) {
    return { valid: false, normalized: "", issue: "empty", kind };
  }

  let parsed;
  try {
    parsed = new URL(normalized);
  } catch {
    return { valid: false, normalized, issue: "malformed", kind };
  }

  const protocol = parsed.protocol.toLowerCase();
  if (
    protocol === "javascript:" ||
    protocol === "data:" ||
    protocol === "file:" ||
    protocol === "ftp:" ||
    protocol === "blob:"
  ) {
    return { valid: false, normalized, issue: "invalid_protocol", kind };
  }
  if (httpsOnly) {
    if (protocol !== "https:") {
      return { valid: false, normalized, issue: "invalid_protocol", kind };
    }
  } else if (protocol !== "https:" && protocol !== "http:") {
    return { valid: false, normalized, issue: "invalid_protocol", kind };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, normalized, issue: "credentials", kind };
  }

  const host = parsed.hostname.toLowerCase();
  if (isPrivateOrLocalHost(host)) {
    return { valid: false, normalized, issue: "private_host", kind };
  }

  if (!defaultPortOk(protocol, parsed.port)) {
    return { valid: false, normalized, issue: "nonstandard_port", kind };
  }

  if (!hostAllowed(kind, host)) {
    return { valid: false, normalized, issue: "invalid_host", kind };
  }

  if (requirePath && (!parsed.pathname || parsed.pathname === "/")) {
    return { valid: false, normalized, issue: "suspicious_path", kind };
  }

  if (
    kind === "affiliate" &&
    !parsed.pathname.toLowerCase().includes("/product/")
  ) {
    return { valid: false, normalized, issue: "suspicious_path", kind };
  }

  return { valid: true, normalized: parsed.toString(), kind };
}

export function logRejectedUrl(kind, url, issue) {
  const preview = String(url ?? "").slice(0, 180);
  console.warn(
    `[security] rejected_${kind}_url issue=${issue} url=${preview}`
  );
}
