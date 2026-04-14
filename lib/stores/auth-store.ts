import { create } from "zustand"

import type { AuthStore } from "@/lib/types/auth"

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))
