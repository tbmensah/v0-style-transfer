import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { clampListPageSize } from "@/lib/constants/pagination"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type { JobStatus, JobsListData, JobsListParams, JobsSearchParams } from "@/lib/types/jobs"

function appendStatusParams(search: URLSearchParams, status?: JobStatus[] | null) {
  if (!status?.length) return
  const sorted = [...status].sort()
  for (const s of sorted) {
    search.append("status", s)
  }
}

function buildJobsQuery(params: JobsListParams): string {
  const search = new URLSearchParams()
  if (params.job_type) search.set("job_type", params.job_type)
  appendStatusParams(search, params.status)
  if (params.created_from) search.set("created_from", params.created_from)
  if (params.created_to) search.set("created_to", params.created_to)
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) {
    search.set("page_size", String(clampListPageSize(params.page_size)))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

function buildJobsSearchQuery(params: JobsSearchParams): string {
  const search = new URLSearchParams()
  search.set("q", params.q.trim())
  if (params.job_type) search.set("job_type", params.job_type)
  appendStatusParams(search, params.status)
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) {
    search.set("page_size", String(clampListPageSize(params.page_size)))
  }
  return `?${search.toString()}`
}

/** Paginated jobs list. Omit `job_type` for both FF and EE. */
export async function fetchJobsList(params: JobsListParams): Promise<JobsListData> {
  const { data } = await apiClient.get<SuccessEnvelope<JobsListData>>(
    `${API_ENDPOINTS.jobsList}${buildJobsQuery(params)}`,
  )
  return unwrapSuccess(data, "No jobs data")
}

/** Job id substring search (`q` required). */
export async function fetchJobsSearch(params: JobsSearchParams): Promise<JobsListData> {
  const { data } = await apiClient.get<SuccessEnvelope<JobsListData>>(
    `${API_ENDPOINTS.jobsSearch}${buildJobsSearchQuery(params)}`,
  )
  return unwrapSuccess(data, "No jobs data")
}
