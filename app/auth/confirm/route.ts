import { type EmailOtpType } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseFromRoute } from "@/lib/supabase/server"
import { safeAppPath } from "@/lib/utilities/safe-redirect"

const DEFAULT_NEXT = "/reset-password"
const ERR_PATH = "/auth/auth-code-error"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const nextParam = searchParams.get("next")

  const nextPath = safeAppPath(nextParam, DEFAULT_NEXT)
  const redirectTo = new URL(nextPath, request.url)
  const redirectResponse = NextResponse.redirect(redirectTo)
  const supabase = createServerSupabaseFromRoute(request, redirectResponse)

  if (!supabase) {
    return NextResponse.redirect(new URL(ERR_PATH, request.url))
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(
        new URL(`${ERR_PATH}?message=${encodeURIComponent(error.message)}`, origin)
      )
    }
    return redirectResponse
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) {
      return NextResponse.redirect(
        new URL(`${ERR_PATH}?message=${encodeURIComponent(error.message)}`, origin)
      )
    }
    return redirectResponse
  }

  return NextResponse.redirect(new URL(ERR_PATH, origin))
}