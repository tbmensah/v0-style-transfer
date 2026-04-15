import type { JobsListParams } from "@/lib/types/jobs"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"

export const queryKeys = {
  health: ["api", "health"] as const,
  me: ["api", "me"] as const,
  fastFillUploadInit: ["api", "fast-fill", "upload-init"] as const,
  jobs: (params: JobsListParams) =>
    [
      "api",
      "jobs",
      params.job_type ?? "all",
      params.page ?? 1,
      params.page_size ?? LIST_PAGE_SIZE,
      params.created_from ?? "",
      params.created_to ?? "",
    ] as const,
} as const
