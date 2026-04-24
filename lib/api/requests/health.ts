import { unwrapSuccess } from "@/lib/api/unwrap-envelope"
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints"
import { apiClient } from "@/lib/http/api-client"
import type { SuccessEnvelope } from "@/lib/types/api-envelope"
import type { HealthResponse } from "@/lib/types/health"

/**
 * Example GET — ensure your backend exposes this route (or change the path).
 * Requires `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<SuccessEnvelope<HealthResponse>>(API_ENDPOINTS.health)
  return unwrapSuccess(data, "No health payload")
}
