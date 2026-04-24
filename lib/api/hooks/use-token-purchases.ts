"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchTokenPurchases } from "@/lib/api/requests/tokens"
import { queryKeys } from "@/lib/api/query-keys"
import { hasApiBase } from "@/lib/environment/public-env"
import type { TokenPurchasesParams } from "@/lib/types/tokens"

export function useTokenPurchases(params: TokenPurchasesParams) {
  return useQuery({
    queryKey: queryKeys.tokenPurchases(params),
    queryFn: () => fetchTokenPurchases(params),
    enabled: hasApiBase,
  })
}
