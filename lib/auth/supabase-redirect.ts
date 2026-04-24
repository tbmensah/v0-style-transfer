/**
 * URL Supabase redirects to after email confirmation, magic links, OAuth, etc.
 * Set `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` to the full URL (must match an entry in
 * Supabase Dashboard → Authentication → URL Configuration → Redirect URLs).
 */
export function getAppOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, "")
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return ""
}

export function getSupabaseRedirectUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL?.trim()
  if (fromEnv) return fromEnv
  if (typeof window !== "undefined") {
    return `${window.location.origin}/login`
  }
  return ""
}

/**
 * Full `redirectTo` for `resetPasswordForEmail` — user lands on
 * `/auth/confirm?token_hash=...&type=recovery&next=...` (Supabase + template).
 * Must be listed in Dashboard → Auth → URL Configuration → Redirect URLs.
 * @param afterConfirmPath in-app path after OTP verify (default `/reset-password`)
 */
export function getAuthConfirmRedirectUrl(
  afterConfirmPath = "/reset-password",
): string {
  const origin = getAppOrigin()
  if (!origin) return ""
  const u = new URL("/auth/confirm", origin)
  u.searchParams.set("next", afterConfirmPath)
  return u.toString()
}
