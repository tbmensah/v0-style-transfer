import { signOut } from "@/lib/auth/sign-out"
import { isPublicPath } from "@/lib/auth/public-paths"
import type { ApiErrorBody } from "@/lib/types/api-envelope"

/** Backend codes meaning the credential/app session is dead — force re-login. */
export const APP_SESSION_EXPIRED_CODE = "app_session_expired" as const
export const UNAUTHORIZED_CODE = "unauthorized" as const

const SESSION_EXPIRED_CODES: readonly string[] = [
  APP_SESSION_EXPIRED_CODE,
  UNAUTHORIZED_CODE,
]

let handlingUnauthorized = false

export function isAppSessionExpiredError(data: unknown): boolean {
  if (data == null || typeof data !== "object") return false
  const body = data as ApiErrorBody
  const code = body.error?.code
  return typeof code === "string" && SESSION_EXPIRED_CODES.includes(code)
}

/**
 * Single-flight: sign out and hard-redirect to login so React Query / in-flight
 * requests do not stack multiple logout flows.
 */
export async function handleAppSessionExpired(): Promise<void> {
  if (typeof window === "undefined") return
  if (handlingUnauthorized) return
  handlingUnauthorized = true

  const pathname = window.location.pathname
  const search = window.location.search
  const loginUrl = new URL("/login", window.location.origin)

  if (!isPublicPath(pathname)) {
    loginUrl.searchParams.set("next", pathname + search)
  }

  try {
    await signOut()
  } finally {
    window.location.replace(loginUrl.toString())
  }
}
