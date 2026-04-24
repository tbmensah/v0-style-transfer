/** Default page size for dashboard list tables. */
export const LIST_PAGE_SIZE = 10

/** API allows up to this many items per page (search route clamps to this). */
export const LIST_PAGE_SIZE_MAX = 100

/** Presets for history / list "rows per page" dropdown. */
export const LIST_PAGE_SIZE_OPTIONS = [10, 20, 40, 50] as const

export function clampListPageSize(n: number): number {
  const x = Math.floor(n)
  if (!Number.isFinite(x) || x < 1) return LIST_PAGE_SIZE
  return Math.min(LIST_PAGE_SIZE_MAX, x)
}

/** Snap clamped size to a dropdown option (handles legacy URLs e.g. `page_size=25`). */
export function normalizeListPageSizeOption(n: number): number {
  const c = clampListPageSize(n)
  if (LIST_PAGE_SIZE_OPTIONS.some((o) => o === c)) return c
  return LIST_PAGE_SIZE_OPTIONS.reduce(
    (best, o) => (Math.abs(o - c) < Math.abs(best - c) ? o : best),
    LIST_PAGE_SIZE_OPTIONS[0],
  )
}
