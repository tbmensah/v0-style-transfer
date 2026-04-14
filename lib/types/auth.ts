/**
 * UI-facing user shape. Session and tokens are owned by Supabase (`getSession`, persisted in localStorage).
 * Sync into this store from `onAuthStateChange` when you need global app state beyond Supabase.
 */

export type AuthUser = {
  id: string
  email: string
  fullName?: string
  company?: string
  avatarUrl?: string | null
  /** ISO timestamp from Supabase `user.created_at` */
  createdAt?: string
}

export type AuthState = {
  user: AuthUser | null
}

export type AuthStore = AuthState & {
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
}
