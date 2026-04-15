import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import {
  API_ENDPOINTS,
  apiPathFastFillJobDetails,
  apiPathFastFillJobUploadUrl,
} from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type { FastFillJobDetailsPayload, FastFillUploadInitData } from "@/lib/types/fast-fill"

/**
 * Reserves storage + returns presigned URL. Call once per file pair / job row.
 * Auth: Bearer via `apiClient`.
 */
export async function initFastFillUpload(): Promise<FastFillUploadInitData> {
  const { data } = await apiClient.get<SuccessEnvelope<FastFillUploadInitData>>(
    API_ENDPOINTS.fastFillUploadInit,
    {},
  )
  return unwrapSuccess(data, "No upload init data")
}

/**
 * Existing job (e.g. `?job_id=` but no local draft): fetch fresh upload URL + paths.
 * `GET /api/v1/jobs/ff/{job_id}/upload-url`
 */
export async function fetchFastFillJobUploadUrl(
  jobId: string,
): Promise<FastFillUploadInitData> {
  const { data } = await apiClient.get<SuccessEnvelope<FastFillUploadInitData>>(
    apiPathFastFillJobUploadUrl(jobId),
  )
  return unwrapSuccess(data, "No upload URL data")
}

/**
 * After PDF upload to `storage_path`, register keys + FF type for the job.
 * `POST /api/v1/jobs/ff/{job_id}/details`
 */
export async function submitFastFillJobDetails(
  jobId: string,
  payload: FastFillJobDetailsPayload,
): Promise<void> {
  await apiClient.post<SuccessEnvelope<unknown>>(
    apiPathFastFillJobDetails(jobId),
    payload,
  )
}
