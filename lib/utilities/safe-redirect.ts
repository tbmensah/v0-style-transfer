/** Relative in-app path only — blocks open redirects. */
export function safeAppPath(
  next: string | null | undefined,
  fallback = "/dashboard",
): string {
  if (next == null || typeof next !== "string") return fallback
  const trimmed = next.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback
  if (trimmed.includes("://") || trimmed.includes("\\")) return fallback
  return trimmed
}
