import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"

export function getTotalPages(totalItems: number, pageSize = LIST_PAGE_SIZE): number {
  if (totalItems <= 0) return 0
  return Math.ceil(totalItems / pageSize)
}

export function slicePage<T>(items: readonly T[], page: number, pageSize = LIST_PAGE_SIZE): T[] {
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * pageSize
  return items.slice(start, start + pageSize)
}

/** Page numbers and ellipsis markers for compact pagination UI. */
export function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 0) return []
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i >= 1 && i <= totalPages) pages.add(i)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const out: (number | "ellipsis")[] = []
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!
    if (i > 0 && n - sorted[i - 1]! > 1) out.push("ellipsis")
    out.push(n)
  }
  return out
}
