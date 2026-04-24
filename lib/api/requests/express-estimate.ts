import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type {
  ExpressEstimateJobCreateData,
  ExpressEstimateJobPayload,
} from "@/lib/types/express-estimate"

/**
 * Create an Express Estimate job. `POST /jobs/ee`
 * Auth: Bearer via `apiClient`.
 */
export async function createExpressEstimateJob(
  payload: ExpressEstimateJobPayload,
): Promise<ExpressEstimateJobCreateData> {
  const { data } = await apiClient.post<SuccessEnvelope<ExpressEstimateJobCreateData>>(
    API_ENDPOINTS.jobsExpressEstimate,
    payload,
  )
  return unwrapSuccess(data, "No job data")
}
