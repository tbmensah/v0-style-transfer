import { isAxiosError } from "axios"

import type { ApiErrorBody } from "@/lib/types/api-envelope"

type FastApiValidationItem = {
  msg?: string
  type?: string
  loc?: unknown
}

function formatFastApiDetail(detail: unknown): string | null {
  if (typeof detail === "string" && detail.trim()) {
    return detail.trim()
  }
  if (!Array.isArray(detail) || detail.length === 0) return null
  const parts: string[] = []
  for (const item of detail) {
    if (typeof item === "object" && item !== null && "msg" in item) {
      const row = item as FastApiValidationItem
      if (typeof row.msg === "string" && row.msg.trim()) {
        const loc = Array.isArray(row.loc) ? row.loc.filter((x) => typeof x === "string").join(".") : ""
        parts.push(loc ? `${loc}: ${row.msg.trim()}` : row.msg.trim())
      }
    }
  }
  if (parts.length === 0) return null
  return parts.slice(0, 5).join("; ")
}

/** Pull `message` / `detail` from error JSON body when present. */
export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message.trim()
    }
    const detailStr = formatFastApiDetail(data?.detail)
    if (detailStr) return detailStr
    if (error.message) return error.message
  }
  if (error instanceof Error) return error.message
  return "Request failed"
}
