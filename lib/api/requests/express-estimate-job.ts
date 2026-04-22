import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import {
  apiPathExpressEstimateComplete,
  apiPathExpressEstimateInputDownload,
  apiPathExpressEstimateInputRender,
  apiPathExpressEstimateJob,
  apiPathExpressEstimateOutputConfirm,
  apiPathExpressEstimateOutputDownload,
  apiPathExpressEstimateOutputUploadUrl,
  apiPathExpressEstimateReopen,
} from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type {
  EeInputDownloadData,
  EeOutputConfirmBody,
  EeOutputDownloadData,
  EeOutputUploadUrlBody,
  EeOutputUploadUrlData,
  ExpressEstimateJobDetail,
} from "@/lib/types/express-estimate-job"

export async function fetchExpressEstimateJobDetail(jobId: string): Promise<ExpressEstimateJobDetail> {
  const { data } = await apiClient.get<SuccessEnvelope<ExpressEstimateJobDetail>>(
    apiPathExpressEstimateJob(jobId),
  )
  return unwrapSuccess(data, "No Express Estimate job")
}

export async function postExpressEstimateInputRender(jobId: string): Promise<ExpressEstimateJobDetail> {
  const { data } = await apiClient.post<SuccessEnvelope<ExpressEstimateJobDetail>>(
    apiPathExpressEstimateInputRender(jobId),
    {},
  )
  return unwrapSuccess(data, "No job data")
}

export async function fetchExpressEstimateInputDownload(jobId: string): Promise<EeInputDownloadData> {
  const { data } = await apiClient.get<SuccessEnvelope<EeInputDownloadData>>(
    apiPathExpressEstimateInputDownload(jobId),
  )
  return unwrapSuccess(data, "No input download data")
}

export async function postExpressEstimateOutputUploadUrl(
  jobId: string,
  body: EeOutputUploadUrlBody,
): Promise<EeOutputUploadUrlData> {
  const { data } = await apiClient.post<SuccessEnvelope<EeOutputUploadUrlData>>(
    apiPathExpressEstimateOutputUploadUrl(jobId),
    body,
  )
  return unwrapSuccess(data, "No upload URL data")
}

export async function postExpressEstimateOutputConfirm(
  jobId: string,
  body: EeOutputConfirmBody,
): Promise<ExpressEstimateJobDetail> {
  const { data } = await apiClient.post<SuccessEnvelope<ExpressEstimateJobDetail>>(
    apiPathExpressEstimateOutputConfirm(jobId),
    body,
  )
  return unwrapSuccess(data, "No job data")
}

export async function fetchExpressEstimateOutputDownload(jobId: string): Promise<EeOutputDownloadData> {
  const { data } = await apiClient.get<SuccessEnvelope<EeOutputDownloadData>>(
    apiPathExpressEstimateOutputDownload(jobId),
  )
  return unwrapSuccess(data, "No output download data")
}

export async function postExpressEstimateComplete(jobId: string): Promise<ExpressEstimateJobDetail> {
  const { data } = await apiClient.post<SuccessEnvelope<ExpressEstimateJobDetail>>(
    apiPathExpressEstimateComplete(jobId),
    {},
  )
  return unwrapSuccess(data, "No job data")
}

export async function postExpressEstimateReopen(jobId: string): Promise<ExpressEstimateJobDetail> {
  const { data } = await apiClient.post<SuccessEnvelope<ExpressEstimateJobDetail>>(
    apiPathExpressEstimateReopen(jobId),
    {},
  )
  return unwrapSuccess(data, "No job data")
}
