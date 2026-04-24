import { createServerClient } from "@supabase/ssr"
import { type SupabaseClient } from "@supabase/supabase-js"
import { type NextRequest, type NextResponse } from "next/server"

/**
 * Supabase server client for Route Handlers. Pass the same `response` you will
 * return (e.g. redirect) so `setAll` can set auth cookies and cache headers.
 */
export function createServerSupabaseFromRoute(
  request: NextRequest,
  response: NextResponse,
): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    return null
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      },
    },
  })
}
