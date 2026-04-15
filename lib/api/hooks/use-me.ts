"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchMe } from "@/lib/api/requests/me"
import { queryKeys } from "@/lib/api/query-keys"

const hasApiBase =
  typeof process !== "undefined" && Boolean(process.env.NEXT_PUBLIC_API_BASE_URL)

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchMe,
    enabled: hasApiBase,
  })
}
