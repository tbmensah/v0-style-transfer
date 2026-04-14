import type { User } from "@supabase/supabase-js"

import type { AuthUser } from "@/lib/types/auth"

/** Maps Supabase auth user + `user_metadata` (e.g. `full_name`, `company` from signUp) to our UI type. */
export function mapSupabaseUser(user: User): AuthUser {
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const fullName =
    typeof meta?.full_name === "string"
      ? meta.full_name
      : typeof meta?.fullName === "string"
        ? meta.fullName
        : undefined
  const company = typeof meta?.company === "string" ? meta.company : undefined
  const avatarUrl =
    typeof meta?.avatar_url === "string"
      ? meta.avatar_url
      : typeof meta?.avatarUrl === "string"
        ? meta.avatarUrl
        : null

  return {
    id: user.id,
    email: user.email ?? "",
    fullName,
    company,
    avatarUrl,
    createdAt: user.created_at,
  }
}
