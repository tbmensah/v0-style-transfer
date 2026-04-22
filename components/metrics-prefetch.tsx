"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { fetchDashboardMetrics, fetchJobStatusSummary } from "@/lib/api/requests/metrics"
import { fetchTokenCatalog, fetchTokenLifetime, fetchTokenPurchases } from "@/lib/api/requests/tokens"
import { queryKeys } from "@/lib/api/query-keys"
import { hasApiBase } from "@/lib/environment/public-env"

/** Warms metrics queries for dashboard / FF / EE flows. */
export function MetricsPrefetch() {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!hasApiBase) return
    void queryClient.prefetchQuery({
      queryKey: queryKeys.metrics,
      queryFn: fetchDashboardMetrics,
    })
    void queryClient.prefetchQuery({
      queryKey: queryKeys.metricsJobStatusSummary,
      queryFn: fetchJobStatusSummary,
    })
    void queryClient.prefetchQuery({
      queryKey: queryKeys.tokensCatalog,
      queryFn: fetchTokenCatalog,
    })
    void queryClient.prefetchQuery({
      queryKey: queryKeys.tokensLifetime,
      queryFn: fetchTokenLifetime,
    })
    void queryClient.prefetchQuery({
      queryKey: queryKeys.tokenPurchases({ page: 1, page_size: 20 }),
      queryFn: () => fetchTokenPurchases({ page: 1, page_size: 20 }),
    })
  }, [queryClient])

  return null
}
