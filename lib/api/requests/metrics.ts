import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type { DashboardMetricsData, JobStatusSummaryData } from "@/lib/types/metrics"

/**
 * Dashboard metrics (tokens + job buckets). `GET /metrics`
 * Auth: Bearer via `apiClient`.
 */
export async function fetchDashboardMetrics(): Promise<DashboardMetricsData> {
  const { data } = await apiClient.get<SuccessEnvelope<DashboardMetricsData>>(API_ENDPOINTS.metrics)
  return unwrapSuccess(data, "No metrics data")
}

/**
 * Per-user job status counts for dashboard summary. `GET /metrics/job-status-summary`
 * Auth: Bearer via `apiClient`.
 */
export async function fetchJobStatusSummary(): Promise<JobStatusSummaryData> {
  const { data } = await apiClient.get<SuccessEnvelope<JobStatusSummaryData>>(
    API_ENDPOINTS.metricsJobStatusSummary,
  )
  return unwrapSuccess(data, "No job status summary data")
}
