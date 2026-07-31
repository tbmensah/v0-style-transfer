import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"

/** Shared in-flight stamp so login page + SIGNED_IN listener do not double-POST. */
let inFlight: Promise<void> | null = null

/**
 * Establishes the backend app session after a fresh Supabase `SIGNED_IN`.
 * Uses `apiClient` → `Authorization: Bearer <access_token>`.
 */
export async function startAppSession(): Promise<void> {
  if (inFlight) return inFlight

  inFlight = apiClient
    .post<SuccessEnvelope<Record<string, unknown> | null>>(API_ENDPOINTS.sessionStart)
    .then(() => undefined)
    .finally(() => {
      inFlight = null
    })

  return inFlight
}
