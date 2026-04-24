import { isAxiosError, type AxiosError } from "axios"

import type { ApiErrorBody } from "@/lib/types/api-envelope"

/** Shown when axios hits `timeout` (e.g. 30s) or equivalent — avoids raw "timeout of 30000ms exceeded". */
const USER_TIMEOUT_MESSAGE =
  "Request timed out before the server finished. The service may be busy or unreachable. Check your connection and try again."

const USER_NETWORK_MESSAGE =
  "Could not reach the API. Check your internet connection and try again."

const USER_FORBIDDEN_MESSAGE = "You do not have permissions to access this resource."

function isAxiosTimeout(error: AxiosError): boolean {
  const msg = error.message ?? ""
  if (error.code === "ETIMEDOUT") return true
  if (error.code === "ECONNABORTED" && /timeout/i.test(msg)) return true
  return /timeout of \d+ms exceeded/i.test(msg)
}

function isAxiosNetworkFailure(error: AxiosError): boolean {
  if (error.response != null) return false
  const msg = error.message ?? ""
  if (error.code === "ERR_NETWORK") return true
  return msg === "Network Error"
}

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
    if (isAxiosTimeout(error)) return USER_TIMEOUT_MESSAGE
    if (isAxiosNetworkFailure(error)) return USER_NETWORK_MESSAGE
    if (error.response?.status === 403) return USER_FORBIDDEN_MESSAGE
    const data = error.response?.data as ApiErrorBody | undefined
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message.trim()
    }
    const detailStr = formatFastApiDetail(data?.detail)
    if (detailStr) return detailStr
    if (error.message) return error.message
  }
  if (error instanceof Error) {
    if (/timeout of \d+ms exceeded/i.test(error.message)) return USER_TIMEOUT_MESSAGE
    return error.message
  }
  return "Request failed"
}
