"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchTokenCatalog } from "@/lib/api/requests/tokens"
import { queryKeys } from "@/lib/api/query-keys"

const hasApiBase =
  typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

/** Public Fast Fill bundle pricing from `GET /tokens`. */
export function useTokenCatalog() {
  return useQuery({
    queryKey: queryKeys.tokensCatalog,
    queryFn: fetchTokenCatalog,
    enabled: hasApiBase,
  })
}
