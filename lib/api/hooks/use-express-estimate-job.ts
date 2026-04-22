"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/lib/api/query-keys"
import { presignUploadAndConfirmEeOutput } from "@/lib/api/express-estimate-output-upload"
import {
  fetchExpressEstimateInputDownload,
  fetchExpressEstimateJobDetail,
  fetchExpressEstimateOutputDownload,
  postExpressEstimateComplete,
  postExpressEstimateInputRender,
  postExpressEstimateOutputConfirm,
  postExpressEstimateOutputUploadUrl,
  postExpressEstimateReopen,
} from "@/lib/api/requests/express-estimate-job"
import { hasApiBase } from "@/lib/environment/public-env"
import type { EeOutputConfirmBody, EeOutputUploadUrlBody } from "@/lib/types/express-estimate-job"

const POLL_MS = 5_000

export function useExpressEstimateJobDetail(
  jobId: string,
  options?: { enabled?: boolean; pollInputRender?: boolean },
) {
  const { enabled, pollInputRender } = options ?? {}
  const isEnabled = (enabled ?? true) && hasApiBase && jobId.length > 0
  return useQuery({
    queryKey: queryKeys.expressEstimateJob(jobId),
    queryFn: () => fetchExpressEstimateJobDetail(jobId),
    enabled: isEnabled,
    refetchInterval: (query) => {
      if (!pollInputRender) return false
      const d = query.state.data
      if (d == null) return POLL_MS
      if (d.has_input_render) return false
      return POLL_MS
    },
  })
}

function useInvalidateEeAndJobs() {
  const queryClient = useQueryClient()
  return async (jobId: string) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.expressEstimateJob(jobId) })
    await queryClient.invalidateQueries({ queryKey: ["api", "jobs"] })
    await queryClient.invalidateQueries({ queryKey: ["api", "ops"] })
    await queryClient.invalidateQueries({ queryKey: queryKeys.metrics })
    await queryClient.invalidateQueries({ queryKey: queryKeys.tokensLifetime })
  }
}

export function usePostExpressEstimateInputRender(jobId: string) {
  const invalidate = useInvalidateEeAndJobs()
  return useMutation({
    mutationFn: () => postExpressEstimateInputRender(jobId),
    onSuccess: () => {
      void invalidate(jobId)
    },
  })
}

export function usePostExpressEstimateOutputUploadUrl(jobId: string) {
  return useMutation({
    mutationFn: (body: EeOutputUploadUrlBody) => postExpressEstimateOutputUploadUrl(jobId, body),
  })
}

export function usePostExpressEstimateOutputConfirm(jobId: string) {
  const invalidate = useInvalidateEeAndJobs()
  return useMutation({
    mutationFn: (body: EeOutputConfirmBody) => postExpressEstimateOutputConfirm(jobId, body),
    onSuccess: () => {
      void invalidate(jobId)
    },
  })
}

export function usePostExpressEstimateComplete(jobId: string) {
  const invalidate = useInvalidateEeAndJobs()
  return useMutation({
    mutationFn: () => postExpressEstimateComplete(jobId),
    onSuccess: () => {
      void invalidate(jobId)
    },
  })
}

export function usePostExpressEstimateReopen(jobId: string) {
  const invalidate = useInvalidateEeAndJobs()
  return useMutation({
    mutationFn: () => postExpressEstimateReopen(jobId),
    onSuccess: () => {
      void invalidate(jobId)
    },
  })
}

/** Fetches a fresh signed input URL; open in new tab. */
export function useExpressEstimateInputDownload() {
  return useMutation({
    mutationFn: (id: string) => fetchExpressEstimateInputDownload(id),
  })
}

export function useExpressEstimateOutputDownload() {
  return useMutation({
    mutationFn: (id: string) => fetchExpressEstimateOutputDownload(id),
  })
}

export function useEeOutputUploadAndConfirm(jobId: string) {
  const invalidate = useInvalidateEeAndJobs()
  return useMutation({
    mutationFn: (file: File) => presignUploadAndConfirmEeOutput(jobId, file),
    onSuccess: () => {
      void invalidate(jobId)
    },
  })
}
