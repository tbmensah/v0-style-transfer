import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import { isPublicPath } from "@/lib/auth/public-paths"

function copyCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie)
  })
  return to
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    return response
  }

  const supabase = createServerClient(url, anonKey, {
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (isPublicPath(pathname)) {
    if (
      user &&
      (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    ) {
      return copyCookies(
        response,
        NextResponse.redirect(new URL("/dashboard", request.url)),
      )
    }
    return response
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url)
    const next =
      pathname + (request.nextUrl.searchParams.toString() ? request.nextUrl.search : "")
    loginUrl.searchParams.set("next", next)
    return copyCookies(response, NextResponse.redirect(loginUrl))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
