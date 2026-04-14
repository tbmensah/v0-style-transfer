"use client"

import { useLayoutEffect, type ReactNode } from "react"
import { mapSupabaseUser } from "@/lib/auth/map-supabase-user"
import { setApiAccessTokenGetter } from "@/lib/http/api-client"
import { useAuthStore } from "@/lib/stores/auth-store"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

/**
 * Keeps axios `apiClient` Authorization header in sync with Supabase session,
 * and mirrors the current user into `useAuthStore` (tokens stay in Supabase).
 */
export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setApiAccessTokenGetter(async () => null)
      useAuthStore.getState().clearUser()
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[SupabaseAuthProvider] Supabase env missing — API requests have no Bearer token. Copy .env.example to .env.local.",
        )
      }
      return
    }

    const client = supabase

    setApiAccessTokenGetter(async () => {
      const {
        data: { session },
      } = await client.auth.getSession()
      return session?.access_token ?? null
    })

    function syncUserFromSession() {
      void client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          useAuthStore.getState().setUser(mapSupabaseUser(session.user))
        } else {
          useAuthStore.getState().clearUser()
        }
      })
    }

    syncUserFromSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        useAuthStore.getState().setUser(mapSupabaseUser(session.user))
      } else {
        useAuthStore.getState().clearUser()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return children
}
