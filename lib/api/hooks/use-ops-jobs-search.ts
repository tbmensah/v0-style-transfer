"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchOpsJobsSearch } from "@/lib/api/requests/jobs"
import { queryKeys } from "@/lib/api/query-keys"
import { hasApiBase } from "@/lib/environment/public-env"
import type { JobsSearchParams } from "@/lib/types/jobs"

const JOBS_REFETCH_MS = 3600 * 1000

export type UseOpsJobsSearchOptions = {
  enabled?: boolean
}

/** `GET /ops/jobs/search` — all customers, back office only. */
export function useOpsJobsSearch(params: JobsSearchParams, options?: UseOpsJobsSearchOptions) {
  const q = params.q.trim()
  const qValid = q.length >= 1 && q.length <= 64
  return useQuery({
    queryKey: queryKeys.opsJobsSearch(params),
    queryFn: () => fetchOpsJobsSearch(params),
    enabled: hasApiBase && (options?.enabled ?? true) && qValid,
    refetchInterval: JOBS_REFETCH_MS,
  })
}
