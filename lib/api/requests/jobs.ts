import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type { JobsListData, JobsListParams } from "@/lib/types/jobs"

function buildJobsQuery(params: JobsListParams): string {
  const search = new URLSearchParams()
  if (params.job_type) search.set("job_type", params.job_type)
  if (params.created_from) search.set("created_from", params.created_from)
  if (params.created_to) search.set("created_to", params.created_to)
  if (params.page != null) search.set("page", String(params.page))
  if (params.page_size != null) search.set("page_size", String(params.page_size))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

/** Paginated jobs list. Omit `job_type` for both FF and EE. */
export async function fetchJobsList(params: JobsListParams): Promise<JobsListData> {
  const { data } = await apiClient.get<SuccessEnvelope<JobsListData>>(
    `${API_ENDPOINTS.jobsList}${buildJobsQuery(params)}`,
  )
  return unwrapSuccess(data, "No jobs data")
}
