/**
 * Dev-only diagnostics for product image failures.
 * Never logs in production builds.
 */

export function logProductImageFailure(details: {
  url: string;
  attempt: number;
  reason: "error" | "timeout" | "implausible" | "exhausted";
}): void {
  if (process.env.NODE_ENV === "production") return;

  let host = "(unknown)";
  try {
    host = new URL(details.url).hostname;
  } catch {
    // keep fallback host label
  }

  // eslint-disable-next-line no-console
  console.warn("[product-image]", {
    url: details.url,
    host,
    retryCount: details.attempt,
    reason: details.reason,
  });
}
