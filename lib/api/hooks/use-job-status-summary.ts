"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchJobStatusSummary } from "@/lib/api/requests/metrics"
import { queryKeys } from "@/lib/api/query-keys"

const hasApiBase =
  typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

export function useJobStatusSummary() {
  return useQuery({
    queryKey: queryKeys.metricsJobStatusSummary,
    queryFn: fetchJobStatusSummary,
    enabled: hasApiBase,
  })
}
