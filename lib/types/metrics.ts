/** `GET /metrics` — `data` payload. */
export type DashboardMetricsData = {
  fast_fill_tokens: number
  express_estimate_tokens: number
  processing: number
  needs_review: number
}

/** `GET /metrics/job-status-summary` — `data` payload. */
export type JobStatusSummaryData = {
  draft: number
  submitted: number
  processing: number
  completed: number
  failed: number
  needs_review: number
}
