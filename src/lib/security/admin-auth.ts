import { assertCronAuthorized } from "@/lib/ai/rate-limit";

/**
 * Protects admin/diagnostic API routes.
 * Reuses CRON_SECRET bearer auth (already required in production).
 */
export function assertAdminAuthorized(request: Request): boolean {
  return assertCronAuthorized(request);
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
