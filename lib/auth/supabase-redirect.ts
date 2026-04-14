/**
 * URL Supabase redirects to after email confirmation, magic links, OAuth, etc.
 * Set `NEXT_PUBLIC_SUPABASE_REDIRECT_URL` to the full URL (must match an entry in
 * Supabase Dashboard → Authentication → URL Configuration → Redirect URLs).
 */
export function getSupabaseRedirectUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL?.trim()
  if (fromEnv) return fromEnv
  if (typeof window !== "undefined") {
    return `${window.location.origin}/login`
  }
  return ""
}
