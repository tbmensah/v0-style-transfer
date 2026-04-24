import type { EeInputDownloadFormat } from "@/lib/types/express-estimate-job"

/**
 * Backend API paths, relative to `NEXT_PUBLIC_API_BASE_URL`.
 * Leading slash, no trailing slash.
 *
 * `FAST_FILL_JOB_ID_QUERY` — Next.js route query (`/fast-fill/new?…`), not HTTP path.
 */
export const FAST_FILL_JOB_ID_QUERY = "job_id" as const

export const API_ENDPOINTS = {
  health: "/health",
  me: "/me",
  /** `GET` — dashboard token balances + job bucket counts (relative to same base as `/jobs`). */
  metrics: "/metrics",
  /** `GET` — per-user job counts by UI bucket (submitted, processing, completed, failed, needs_review). */
  metricsJobStatusSummary: "/metrics/job-status-summary",
  /** `GET` — public Fast Fill token bundle catalog (USD). */
  tokensCatalog: "/tokens",
  /** `GET` — lifetime purchased + used totals (auth). */
  tokensLifetime: "/tokens/lifetime",
  /** `GET` — paginated Stripe token purchases (auth). */
  tokensPurchases: "/tokens/purchases",
  /** `POST` — stub credit tokens (dev; gated server-side). Replace with Stripe later. */
  tokensStubCredit: "/tokens/stub/credit",
  jobsList: "/jobs",
  jobsSearch: "/jobs/search",
  /** `GET` — back office: all customers, `require_back_office` (non-draft, same query params as `/jobs`). */
  opsJobsList: "/ops/jobs",
  /** `GET` — back office search, all customers (`require_back_office`). */
  opsJobsSearch: "/ops/jobs/search",
  /** `POST` — create Express Estimate job (wizard JSON → JSONB). Use with base URL that matches `GET /jobs` (often `…/api/v1` is included in `NEXT_PUBLIC_API_BASE_URL`). */
  jobsExpressEstimate: "/jobs/ee",
  fastFillUploadInit: "/jobs/ff/draft-upload",
  /** `GET` — presigned URL for FF sample/reference PDF (no job row). */
  fastFillSampleUpload: "/jobs/ff/sample-upload",
} as const

/** `GET` — refresh or resume presigned upload for an existing Fast Fill job. */
export function apiPathFastFillJobUploadUrl(jobId: string): string {
  return `/jobs/ff/${encodeURIComponent(jobId)}/upload-url`
}

/** `POST` — register PDF/ESX keys after upload. */
export function apiPathFastFillJobDetails(jobId: string): string {
  return `/jobs/ff/${encodeURIComponent(jobId)}/details`
}

const eeJob = (jobId: string) => encodeURIComponent(jobId)

/** `GET` — Express Estimate job detail. */
export function apiPathExpressEstimateJob(jobId: string): string {
  return `/jobs/ee/${eeJob(jobId)}`
}

/** `POST` — retry readable markdown upload. */
export function apiPathExpressEstimateInputRender(jobId: string): string {
  return `/jobs/ee/${eeJob(jobId)}/input-render`
}

/** `GET` — signed URL for operator-readable input (`format=excel` or omit / markdown for markdown). */
export function apiPathExpressEstimateInputDownload(jobId: string, format?: EeInputDownloadFormat): string {
  const path = `/jobs/ee/${eeJob(jobId)}/input-download`
  if (format === "excel") {
    return `${path}?format=excel`
  }
  return path
}

/** `POST` — presigned output upload URL. */
export function apiPathExpressEstimateOutputUploadUrl(jobId: string): string {
  return `/jobs/ee/${eeJob(jobId)}/output/upload-url`
}

/** `POST` — confirm output after PUT to storage. */
export function apiPathExpressEstimateOutputConfirm(jobId: string): string {
  return `/jobs/ee/${eeJob(jobId)}/output/confirm`
}

/** `GET` — signed URL for final operator output. */
export function apiPathExpressEstimateOutputDownload(jobId: string): string {
  return `/jobs/ee/${eeJob(jobId)}/output/download`
}

/** `POST` — mark job completed (checkmark). */
export function apiPathExpressEstimateComplete(jobId: string): string {
  return `/jobs/ee/${eeJob(jobId)}/complete`
}

/** `POST` — reopen completed job (undoes checkmark). */
export function apiPathExpressEstimateReopen(jobId: string): string {
  return `/jobs/ee/${eeJob(jobId)}/reopen`
}
