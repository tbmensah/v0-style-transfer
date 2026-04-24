"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchOpsJobsList } from "@/lib/api/requests/jobs"
import { queryKeys } from "@/lib/api/query-keys"
import { hasApiBase } from "@/lib/environment/public-env"
import type { JobsListParams } from "@/lib/types/jobs"

const JOBS_REFETCH_MS = 3600 * 1000

export type UseOpsJobsListOptions = {
  enabled?: boolean
  refetchInterval?: number | false
}

/** `GET /ops/jobs` — all customers, back office only (server: `require_back_office`). */
export function useOpsJobsList(params: JobsListParams, options?: UseOpsJobsListOptions) {
  return useQuery({
    queryKey: queryKeys.opsJobs(params),
    queryFn: () => fetchOpsJobsList(params),
    enabled: hasApiBase && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval !== undefined ? options.refetchInterval : JOBS_REFETCH_MS,
  })
}
