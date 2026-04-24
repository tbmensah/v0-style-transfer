import type { JobStatus, JobsListParams, JobsSearchParams } from "@/lib/types/jobs"
import type { TokenPurchaseStatus, TokenPurchasesParams } from "@/lib/types/tokens"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"

const TOKEN_PURCHASES_PAGE_DEFAULT = 20

function purchaseStatusKey(status?: TokenPurchaseStatus[] | null) {
  if (!status?.length) return ""
  return [...status].sort().join(",")
}

function statusKey(status?: JobStatus[] | null) {
  if (!status?.length) return ""
  return [...status].sort().join(",")
}

export const queryKeys = {
  health: ["api", "health"] as const,
  me: ["api", "me"] as const,
  metrics: ["api", "metrics"] as const,
  /** Invalidated with `metrics` via shared `["api", "metrics"]` prefix. */
  metricsJobStatusSummary: ["api", "metrics", "job-status-summary"] as const,
  tokensCatalog: ["api", "tokens", "catalog"] as const,
  tokensLifetime: ["api", "tokens", "lifetime"] as const,
  tokenPurchases: (params: TokenPurchasesParams) =>
    [
      "api",
      "tokens",
      "purchases",
      params.token_type ?? "all",
      purchaseStatusKey(params.status),
      params.created_from ?? "",
      params.created_to ?? "",
      params.page ?? 1,
      params.page_size ?? TOKEN_PURCHASES_PAGE_DEFAULT,
    ] as const,
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
      params.has_output == null ? "" : String(params.has_output),
    ] as const,
  /** Back office: `GET /ops/jobs` (all customers). */
  opsJobs: (params: JobsListParams) =>
    [
      "api",
      "ops",
      "jobs",
      params.job_type ?? "all",
      statusKey(params.status),
      params.page ?? 1,
      params.page_size ?? LIST_PAGE_SIZE,
      params.created_from ?? "",
      params.created_to ?? "",
      params.has_output == null ? "" : String(params.has_output),
    ] as const,
  expressEstimateJob: (jobId: string) => ["api", "jobs", "ee", jobId] as const,
  /** Back office: `GET /ops/jobs/search`. */
  opsJobsSearch: (params: JobsSearchParams) =>
    [
      "api",
      "ops",
      "jobs-search",
      params.q.trim(),
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
      params.created_from ?? "",
      params.created_to ?? "",
    ] as const,
} as const
