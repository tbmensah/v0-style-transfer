"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchJobsSearch } from "@/lib/api/requests/jobs"
import { queryKeys } from "@/lib/api/query-keys"
import { hasApiBase } from "@/lib/environment/public-env"
import type { JobsSearchParams } from "@/lib/types/jobs"

const JOBS_REFETCH_MS = 3600 * 1000

export type UseJobsSearchOptions = {
  /** When false, query does not run (e.g. browse mode on History). */
  enabled?: boolean
}

export function useJobsSearch(params: JobsSearchParams, options?: UseJobsSearchOptions) {
  const q = params.q.trim()
  const qValid = q.length >= 1 && q.length <= 64
  return useQuery({
    queryKey: queryKeys.jobsSearch(params),
    queryFn: () => fetchJobsSearch(params),
    enabled: hasApiBase && (options?.enabled ?? true) && qValid,
    refetchInterval: JOBS_REFETCH_MS,
  })
}
