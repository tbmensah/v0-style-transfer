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
  fastFillUploadInit: "/jobs/ff/draft-upload",
} as const

/** `GET` — refresh or resume presigned upload for an existing Fast Fill job. */
export function apiPathFastFillJobUploadUrl(jobId: string): string {
  return `/jobs/ff/${encodeURIComponent(jobId)}/upload-url`
}

/** `POST` — register PDF/ESX keys after upload. */
export function apiPathFastFillJobDetails(jobId: string): string {
  return `/jobs/ff/${encodeURIComponent(jobId)}/details`
}
