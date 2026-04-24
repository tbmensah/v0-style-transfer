import type { FastFillUploadInitData } from "@/lib/types/fast-fill"

const PREFIX = "fast-fill:draft:"

function key(jobId: string) {
  return `${PREFIX}${jobId}`
}

/** Read a persisted draft; `null` if missing, corrupt, or job id mismatch. */
export function getFastFillDraft(jobId: string): FastFillUploadInitData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(key(jobId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as FastFillUploadInitData
    if (!parsed?.job_id || parsed.job_id !== jobId) return null
    return parsed
  } catch {
    return null
  }
}

export function setFastFillDraft(data: FastFillUploadInitData): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(key(data.job_id), JSON.stringify(data))
}

export function removeFastFillDraft(jobId: string): void {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(key(jobId))
}
