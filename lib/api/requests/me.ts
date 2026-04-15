import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type { MeResponse } from "@/lib/types/me"

/**
 * Current user from your API. Uses `apiClient` → `Authorization: Bearer <access_token>`
 * from Supabase session (see `SupabaseAuthProvider` + `apiClient` interceptor).
 */
export async function fetchMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<SuccessEnvelope<MeResponse>>(API_ENDPOINTS.me)
  return unwrapSuccess(data, "No profile in response")
}
