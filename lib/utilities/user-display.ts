import type { AuthUser } from "@/lib/types/auth"

function capitalizeWord(word: string): string {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/** Title-case each word (e.g. `john DOE` → `John Doe`). */
export function formatDisplayName(name: string | undefined | null): string {
  if (!name?.trim()) return ""
  return name
    .trim()
    .split(/\s+/)
    .map(capitalizeWord)
    .join(" ")
}

/** First word of full name, else email local-part, else fallback. Always capitalized. */
export function displayFirstName(user: AuthUser | null, fallback = "there"): string {
  const fb = capitalizeWord(fallback)
  if (!user) return fb
  const name = user.fullName?.trim()
  if (name) {
    const first = name.split(/\s+/)[0]
    if (first) return capitalizeWord(first)
  }
  const local = user.email.split("@")[0] ?? ""
  if (local) {
    const segment = local.split(/[._-]/)[0] ?? local
    return capitalizeWord(segment)
  }
  return fb
}

/** Two-letter avatar from name or email. */
export function userInitials(user: AuthUser | null): string {
  if (!user) return "?"
  const name = user.fullName?.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  return user.email.slice(0, 2).toUpperCase()
}

export function formatMemberSince(iso: string | undefined): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}
