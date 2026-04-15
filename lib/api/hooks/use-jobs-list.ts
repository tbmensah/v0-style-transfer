"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchJobsList } from "@/lib/api/requests/jobs"
import { queryKeys } from "@/lib/api/query-keys"
import { hasApiBase } from "@/lib/environment/public-env"
import type { JobsListParams } from "@/lib/types/jobs"

const JOBS_REFETCH_MS = 3600

export function useJobsList(params: JobsListParams) {
  return useQuery({
    queryKey: queryKeys.jobs(params),
    queryFn: () => fetchJobsList(params),
    enabled: hasApiBase,
    refetchInterval: JOBS_REFETCH_MS,
  })
}
