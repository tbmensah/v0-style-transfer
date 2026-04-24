import { hasApiBase } from "@/lib/environment/public-env"

/** Dashboard-style display for numeric API metrics (tokens, counts). */
export function formatMetricCount(
  value: number | undefined,
  opts: { isError: boolean; isLoading: boolean },
): string {
  if (!hasApiBase || opts.isError) return "—"
  if (opts.isLoading) return "—"
  if (value === undefined) return "—"
  return String(value)
}
