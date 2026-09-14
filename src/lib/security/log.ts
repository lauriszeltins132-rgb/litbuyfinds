/**
 * Lightweight security event logging — no secrets, no full payloads.
 */
type SecurityEvent =
  | "url_rejected"
  | "image_proxy_blocked"
  | "rate_limited"
  | "malformed_api_request"
  | "admin_unauthorized";

export function logSecurityEvent(
  event: SecurityEvent,
  detail: Record<string, string | number | boolean | undefined | null> = {}
): void {
  const safe: Record<string, string | number | boolean> = { event };
  for (const [key, value] of Object.entries(detail)) {
    if (value === undefined || value === null) continue;
    if (/secret|token|password|authorization|cookie|key/i.test(key)) continue;
    if (typeof value === "string" && value.length > 240) {
      safe[key] = `${value.slice(0, 240)}…`;
    } else {
      safe[key] = value;
    }
  }
  console.warn("[security]", JSON.stringify(safe));
}
