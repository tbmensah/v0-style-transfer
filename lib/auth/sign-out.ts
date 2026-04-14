import { useAuthStore } from "@/lib/stores/auth-store"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"

/** Ends Supabase session and clears client auth store. */
export async function signOut(): Promise<{ error: string | null }> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    useAuthStore.getState().clearUser()
    return { error: null }
  }

  const { error } = await supabase.auth.signOut()
  if (!error) {
    useAuthStore.getState().clearUser()
  }
  return { error: error?.message ?? null }
}
