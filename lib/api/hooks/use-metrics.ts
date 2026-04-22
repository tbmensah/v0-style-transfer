"use client"

import { useQueries } from "@tanstack/react-query"
import { fetchDashboardMetrics, fetchJobStatusSummary } from "@/lib/api/requests/metrics"
import { fetchTokenLifetime } from "@/lib/api/requests/tokens"
import { queryKeys } from "@/lib/api/query-keys"

const hasApiBase =
  typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

/**
 * Combined dashboard metrics: `GET /metrics`, `GET /metrics/job-status-summary`, `GET /tokens/lifetime`.
 * Shares React Query cache with `useDashboardMetrics` / `useJobStatusSummary`.
 * UI under dashboard should use `useMetricsContext` from `@/components/metrics-context` (single provider).
 */
export function useMetrics() {
  const [dashboard, summary, tokenLifetime] = useQueries({
    queries: [
      {
        queryKey: queryKeys.metrics,
        queryFn: fetchDashboardMetrics,
        enabled: hasApiBase,
      },
      {
        queryKey: queryKeys.metricsJobStatusSummary,
        queryFn: fetchJobStatusSummary,
        enabled: hasApiBase,
      },
      {
        queryKey: queryKeys.tokensLifetime,
        queryFn: fetchTokenLifetime,
        enabled: hasApiBase,
      },
    ],
  })

  return {
    dashboard,
    jobStatusSummary: summary,
    tokenLifetime,
    refetchAll: () =>
      Promise.all([dashboard.refetch(), summary.refetch(), tokenLifetime.refetch()]),
  }
}
