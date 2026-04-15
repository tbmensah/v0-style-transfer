"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo } from "react"
import {
  fetchFastFillJobUploadUrl,
  initFastFillUpload,
} from "@/lib/api/requests/fast-fill"
import { queryKeys } from "@/lib/api/query-keys"
import { FAST_FILL_JOB_ID_QUERY } from "@/lib/constants/api-endpoints"
import {
  getFastFillDraft,
  removeFastFillDraft,
  setFastFillDraft,
} from "@/lib/utilities/fast-fill-draft-storage"

const hasApiBase =
  typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

type DraftFetchMode = "idle" | "init" | "upload-url"

/**
 * First Fast Fill row: one draft per URL `job_id`, stable across reloads.
 * - Local `sessionStorage` + `?job_id=` → no network.
 * - `?job_id=` without storage → `GET …/jobs/ff/{id}/upload-url` (resume / refresh URL).
 * - No `job_id` → `POST` upload-init, then persist + set `job_id` in the URL.
 */
export function useFastFillUploadInit() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const jobIdFromUrl = searchParams.get(FAST_FILL_JOB_ID_QUERY)

  const storedDraft = useMemo(
    () => (jobIdFromUrl ? getFastFillDraft(jobIdFromUrl) : null),
    [jobIdFromUrl],
  )

  const draftResolved = Boolean(
    jobIdFromUrl && storedDraft && storedDraft.job_id === jobIdFromUrl,
  )

  const mode = useMemo<DraftFetchMode>(() => {
    if (draftResolved) return "idle"
    if (jobIdFromUrl) return "upload-url"
    return "init"
  }, [draftResolved, jobIdFromUrl])

  const shouldFetch = hasApiBase && mode !== "idle"

  const query = useQuery({
    queryKey: [...queryKeys.fastFillUploadInit, jobIdFromUrl ?? "new", mode],
    queryFn: async () => {
      if (mode === "upload-url") {
        if (!jobIdFromUrl) throw new Error("Missing job id")
        return fetchFastFillJobUploadUrl(jobIdFromUrl)
      }
      return initFastFillUpload()
    },
    enabled: shouldFetch,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })

  const searchParamsKey = searchParams.toString()

  useEffect(() => {
    if (!query.isSuccess || !query.data || mode === "idle") return
    const params = new URLSearchParams(searchParamsKey)
    if (params.get(FAST_FILL_JOB_ID_QUERY) === query.data.job_id) {
      setFastFillDraft(query.data)
      return
    }

    setFastFillDraft(query.data)
    params.set(FAST_FILL_JOB_ID_QUERY, query.data.job_id)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [
    query.isSuccess,
    query.data,
    mode,
    pathname,
    router,
    searchParamsKey,
  ])

  const data = draftResolved ? storedDraft : query.data ?? null

  const resetDraft = useCallback(() => {
    const id = new URLSearchParams(searchParamsKey).get(FAST_FILL_JOB_ID_QUERY)
    if (id) removeFastFillDraft(id)

    const params = new URLSearchParams(searchParamsKey)
    params.delete(FAST_FILL_JOB_ID_QUERY)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })

    void queryClient.invalidateQueries({ queryKey: queryKeys.fastFillUploadInit })
  }, [pathname, queryClient, router, searchParamsKey])

  return {
    data,
    isLoading: shouldFetch ? query.isPending : false,
    error: shouldFetch ? query.error : null,
    isError: shouldFetch ? query.isError : false,
    resetDraft,
  }
}
