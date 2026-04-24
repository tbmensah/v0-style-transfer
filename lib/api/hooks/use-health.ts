"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchHealth } from "@/lib/api/requests/health"
import { queryKeys } from "@/lib/api/query-keys"

const hasApiBase =
  typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

export function useHealth() {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: fetchHealth,
    enabled: hasApiBase,
  })
}
