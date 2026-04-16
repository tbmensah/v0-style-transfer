import type { JobStatus, JobsListParams, JobsSearchParams } from "@/lib/types/jobs"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"

function statusKey(status?: JobStatus[] | null) {
  if (!status?.length) return ""
  return [...status].sort().join(",")
}

export const queryKeys = {
  health: ["api", "health"] as const,
  me: ["api", "me"] as const,
  fastFillUploadInit: ["api", "fast-fill", "upload-init"] as const,
  jobs: (params: JobsListParams) =>
    [
      "api",
      "jobs",
      params.job_type ?? "all",
      statusKey(params.status),
      params.page ?? 1,
      params.page_size ?? LIST_PAGE_SIZE,
      params.created_from ?? "",
      params.created_to ?? "",
    ] as const,
  jobsSearch: (params: JobsSearchParams) =>
    [
      "api",
      "jobs-search",
      params.q.trim(),
      params.job_type ?? "all",
      statusKey(params.status),
      params.page ?? 1,
      params.page_size ?? LIST_PAGE_SIZE,
    ] as const,
} as const
