import { isAxiosError } from "axios"

import type { ApiErrorBody } from "@/lib/types/api-envelope"

/** Pull `message` / `detail` from error JSON body when present. */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message.trim()
    }
    if (typeof data?.detail === "string" && data.detail.trim()) {
      return data.detail.trim()
    }
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return "Request failed"
}
