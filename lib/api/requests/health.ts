import { apiClient } from "@/lib/http/api-client"
import type { HealthResponse } from "@/lib/types/health"

/**
 * Example GET — ensure your backend exposes this route (or change the path).
 * Requires `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>("/health")
  return data
}
