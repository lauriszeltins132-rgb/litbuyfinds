/**
 * Shared image mirroring helpers for offline migration + spreadsheet sync.
 * Requires BLOB_READ_WRITE_TOKEN (or Vercel OIDC) to upload.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put, head } from "@vercel/blob";
import { validateCatalogUrl } from "./url-policy.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..");
export const MIRROR_MAP_PATH = path.join(
  ROOT,
  "src",
  "data",
  "image-mirror-map.json"
);
export const MIRROR_STATE_PATH = path.join(
  ROOT,
  "data",
  "image-mirror-state.json"
);

const MAX_BYTES = 8 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 18_000;
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      process.env.BLOB_STORE_ID ||
      process.env.VERCEL_OIDC_TOKEN
  );
}

export function loadMirrorMap() {
  if (!fs.existsSync(MIRROR_MAP_PATH)) {
    return { version: 1, updatedAt: null, urls: {} };
  }
  return JSON.parse(fs.readFileSync(MIRROR_MAP_PATH, "utf8"));
}

export function saveMirrorMap(map) {
  map.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(MIRROR_MAP_PATH), { recursive: true });
  fs.writeFileSync(MIRROR_MAP_PATH, JSON.stringify(map, null, 2) + "\n", "utf8");
}

export function loadMirrorState() {
  if (!fs.existsSync(MIRROR_STATE_PATH)) {
    return {
      version: 1,
      completed: {},
      failed: {},
      updatedAt: null,
    };
  }
  return JSON.parse(fs.readFileSync(MIRROR_STATE_PATH, "utf8"));
}

export function saveMirrorState(state) {
  state.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(MIRROR_STATE_PATH), { recursive: true });
  fs.writeFileSync(
    MIRROR_STATE_PATH,
    JSON.stringify(state, null, 2) + "\n",
    "utf8"
  );
}

function extFromContentType(contentType, sourceUrl) {
  const mime = (contentType || "").split(";")[0].trim().toLowerCase();
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/avif") return "avif";
  try {
    const pathname = new URL(sourceUrl).pathname;
    const match = pathname.match(/\.(jpe?g|png|webp|gif|avif)$/i);
    if (match) return match[1].toLowerCase().replace("jpeg", "jpg");
  } catch {
    /* ignore */
  }
  return "bin";
}

export function mirrorPathnameForUrl(sourceUrl) {
  const hash = createHash("sha256").update(sourceUrl).digest("hex").slice(0, 40);
  let ext = "bin";
  try {
    const pathname = new URL(sourceUrl).pathname;
    const match = pathname.match(/\.(jpe?g|png|webp|gif|avif)$/i);
    if (match) ext = match[1].toLowerCase().replace("jpeg", "jpg");
  } catch {
    /* ignore */
  }
  return `catalog-images/${hash}.${ext}`;
}

async function fetchValidatedImage(sourceUrl) {
  const validation = validateCatalogUrl(sourceUrl, "image", {
    httpsOnly: true,
    requirePath: true,
  });
  if (!validation.valid) {
    return { ok: false, reason: `allowlist:${validation.issue}` };
  }

  const target = validation.normalized;
  const response = await fetch(target, {
    headers: {
      Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      "User-Agent": "LitBuyFinds-ImageMirror/1.0",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    return { ok: false, reason: `http_${response.status}` };
  }

  // Re-validate final URL host after redirects
  try {
    const recheck = validateCatalogUrl(response.url, "image", {
      httpsOnly: true,
      requirePath: true,
    });
    if (!recheck.valid) {
      return {
        ok: false,
        reason: `redirect_host:${new URL(response.url).hostname}`,
      };
    }
  } catch {
    return { ok: false, reason: "redirect_parse" };
  }

  const contentType = response.headers.get("content-type") || "";
  const mime = contentType.split(";")[0].trim().toLowerCase();
  if (!ALLOWED_MIME.has(mime)) {
    return { ok: false, reason: `mime:${mime || "missing"}` };
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BYTES) {
    return { ok: false, reason: "too_large_header" };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength === 0) {
    return { ok: false, reason: "empty_body" };
  }
  if (buffer.byteLength > MAX_BYTES) {
    return { ok: false, reason: "too_large_body" };
  }

  return {
    ok: true,
    buffer,
    contentType: mime,
    sourceUrl: target,
    ext: extFromContentType(mime, target),
  };
}

function rememberEntry(map, sourceUrl, entry) {
  map.urls[sourceUrl] = entry;
}

/**
 * Mirror one catalog image exactly once (idempotent).
 * Pass shared `map` from mirrorMany to avoid concurrent map clobbering.
 */
export async function mirrorCatalogImage(
  sourceUrl,
  { dryRun = false, map: sharedMap = null } = {}
) {
  const validation = validateCatalogUrl(sourceUrl, "image", {
    httpsOnly: true,
    requirePath: true,
  });
  if (!validation.valid) {
    return { status: "failed", reason: `allowlist:${validation.issue}` };
  }

  const map = sharedMap ?? loadMirrorMap();
  const existing = map.urls[validation.normalized] || map.urls[sourceUrl];
  if (existing) {
    const url = typeof existing === "string" ? existing : existing.url;
    if (url) return { status: "exists", url };
  }

  const pathnameBase = mirrorPathnameForUrl(validation.normalized);

  if (dryRun) {
    return { status: "dry_run", url: pathnameBase };
  }

  if (!hasBlobCredentials()) {
    return {
      status: "failed",
      reason: "missing_BLOB_READ_WRITE_TOKEN",
    };
  }

  try {
    const existingBlob = await head(pathnameBase);
    if (existingBlob?.url) {
      rememberEntry(map, validation.normalized, {
        url: existingBlob.url,
        pathname: pathnameBase,
        contentType: existingBlob.contentType,
        bytes: existingBlob.size,
        mirroredAt: new Date().toISOString(),
      });
      if (!sharedMap) saveMirrorMap(map);
      return { status: "exists", url: existingBlob.url };
    }
  } catch {
    // missing — continue
  }

  const fetched = await fetchValidatedImage(validation.normalized);
  if (!fetched.ok) {
    return { status: "failed", reason: fetched.reason };
  }

  const pathname = `catalog-images/${createHash("sha256")
    .update(validation.normalized)
    .digest("hex")
    .slice(0, 40)}.${fetched.ext}`;

  let blob;
  try {
    blob = await put(pathname, fetched.buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: fetched.contentType,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
  } catch (error) {
    try {
      const existingBlob = await head(pathname);
      if (existingBlob?.url) {
        rememberEntry(map, validation.normalized, {
          url: existingBlob.url,
          pathname,
          contentType: existingBlob.contentType,
          bytes: existingBlob.size,
          mirroredAt: new Date().toISOString(),
        });
        if (!sharedMap) saveMirrorMap(map);
        return { status: "exists", url: existingBlob.url };
      }
    } catch {
      /* fall through */
    }
    return {
      status: "failed",
      reason: error instanceof Error ? error.message : String(error),
    };
  }

  rememberEntry(map, validation.normalized, {
    url: blob.url,
    pathname,
    contentType: fetched.contentType,
    bytes: fetched.buffer.byteLength,
    mirroredAt: new Date().toISOString(),
  });
  if (!sharedMap) saveMirrorMap(map);

  return { status: "uploaded", url: blob.url };
}

export async function mirrorMany(
  urls,
  { concurrency = 8, dryRun = false, onProgress } = {}
) {
  const state = loadMirrorState();
  const map = loadMirrorMap();
  const unique = [...new Set(urls.filter(Boolean))];
  let index = 0;
  let uploaded = 0;
  let exists = 0;
  let failed = 0;
  let skipped = 0;
  let dry = 0;
  let dirty = false;

  async function worker() {
    while (index < unique.length) {
      const current = unique[index++];
      if (state.completed[current] && map.urls[current] && !dryRun) {
        skipped += 1;
        onProgress?.({ url: current, status: "skipped" });
        continue;
      }

      let attempt = 0;
      let result;
      while (attempt < 3) {
        attempt += 1;
        try {
          result = await mirrorCatalogImage(current, { dryRun, map });
          if (
            result.status !== "failed" ||
            !/http_5|timeout|network/i.test(result.reason || "")
          ) {
            break;
          }
        } catch (error) {
          result = {
            status: "failed",
            reason: error instanceof Error ? error.message : String(error),
          };
        }
        await new Promise((r) => setTimeout(r, 400 * attempt));
      }

      if (result.status === "uploaded") {
        uploaded += 1;
        dirty = true;
        state.completed[current] = {
          url: result.url,
          at: new Date().toISOString(),
        };
        delete state.failed[current];
      } else if (result.status === "exists") {
        exists += 1;
        dirty = true;
        state.completed[current] = {
          url: result.url,
          at: new Date().toISOString(),
        };
        delete state.failed[current];
      } else if (result.status === "dry_run") {
        dry += 1;
      } else if (result.status === "skipped") {
        skipped += 1;
      } else {
        failed += 1;
        state.failed[current] = {
          reason: result.reason || "unknown",
          at: new Date().toISOString(),
        };
      }

      onProgress?.({ url: current, ...result });
      await new Promise((r) => setTimeout(r, dryRun ? 0 : 120));
    }
  }

  const workers = Array.from(
    { length: Math.max(1, Math.min(concurrency, 25)) },
    () => worker()
  );
  await Promise.all(workers);

  if (!dryRun) {
    if (dirty) saveMirrorMap(map);
    saveMirrorState(state);
  }

  return { uploaded, exists, failed, skipped, dry, total: unique.length };
}
