import axios, { type AxiosError, isAxiosError } from "axios"
import axiosRetry, { exponentialDelay, isNetworkOrIdempotentRequestError } from "axios-retry"

/** Resolves the current Supabase JWT for `Authorization: Bearer …` on each request. */
export type AccessTokenGetter = () => Promise<string | null>

let getAccessToken: AccessTokenGetter = async () => null

/**
 * Wire this once you have a Supabase client (browser or server):
 *
 * ```ts
 * setApiAccessTokenGetter(async () => {
 *   const { data: { session } } = await supabase.auth.getSession()
 *   return session?.access_token ?? null
 * })
 * ```
 *
 * Supabase refreshes sessions in the background; each request asks for the latest token.
 * Avoid baking a stale token into the axios instance.
 */
export function setApiAccessTokenGetter(fn: AccessTokenGetter) {
  getAccessToken = fn
}

const baseURL =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : ""

export const apiClient = axios.create({
  baseURL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
})

axiosRetry(apiClient, {
  retries: 3,
  shouldResetTimeout: true,
  retryDelay: exponentialDelay,
  retryCondition: (error: AxiosError) => {
    if (!isAxiosError(error)) return false
    const status = error.response?.status

    // Auth / authorization: do not retry here (handle refresh or sign-out in app code)
    if (status === 401 || status === 403) return false

    if (status === 429) return true
    if (status === 408) return true
    if (status !== undefined && status >= 500) return true

    return isNetworkOrIdempotentRequestError(error)
  },
})

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
