"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchJobsList } from "@/lib/api/requests/jobs"
import { queryKeys } from "@/lib/api/query-keys"
import { hasApiBase } from "@/lib/environment/public-env"
import type { JobsListParams } from "@/lib/types/jobs"

const JOBS_REFETCH_MS = 3600 * 1000

export type UseJobsListOptions = {
  /** When false, query does not run (e.g. History page in search mode). */
  enabled?: boolean
}

export function useJobsList(params: JobsListParams, options?: UseJobsListOptions) {
  return useQuery({
    queryKey: queryKeys.jobs(params),
    queryFn: () => fetchJobsList(params),
    enabled: hasApiBase && (options?.enabled ?? true),
    refetchInterval: JOBS_REFETCH_MS,
  })
}
