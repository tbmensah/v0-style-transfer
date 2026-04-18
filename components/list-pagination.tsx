"use client"

import {
  LIST_PAGE_SIZE,
  LIST_PAGE_SIZE_OPTIONS,
} from "@/lib/constants/pagination"
import { cn } from "@/lib/utils"
import { getTotalPages } from "@/lib/utilities/paginate"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export type ListPaginationProps = {
  page: number
  totalItems: number
  pageSize?: number
  /** When set, shows "Rows per page" control (e.g. history table). */
  pageSizeOptions?: readonly number[]
  onPageSizeChange?: (pageSize: number) => void
  onPageChange: (page: number) => void
  className?: string
}

export function ListPagination({
  page,
  totalItems,
  pageSize = LIST_PAGE_SIZE,
  pageSizeOptions = LIST_PAGE_SIZE_OPTIONS,
  onPageSizeChange,
  onPageChange,
  className,
}: ListPaginationProps) {
  const rawPageCount = totalItems <= 0 ? 0 : getTotalPages(totalItems, pageSize)
  const totalPagesUi = totalItems <= 0 ? 1 : Math.max(1, rawPageCount)
  const showBar = onPageSizeChange || rawPageCount > 1

  if (!showBar) return null

  const safePage = Math.min(Math.max(1, page), totalPagesUi)
  const atFirst = safePage <= 1
  const atLast = safePage >= totalPagesUi

  const pageSizeRow = onPageSizeChange ? (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Rows per page</span>
      <Select
        value={String(pageSize)}
        onValueChange={(v) => {
          onPageSizeChange(Number(v))
        }}
      >
        <SelectTrigger size="sm" className="w-[4.5rem]" aria-label="Rows per page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((n) => (
            <SelectItem key={n} value={String(n)}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : null

  const nav = (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <p className="text-sm text-muted-foreground tabular-nums">
        Page {safePage} of {totalPagesUi}
      </p>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="First page"
          disabled={atFirst}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Previous page"
          disabled={atFirst}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Next page"
          disabled={atLast}
          onClick={() => onPageChange(safePage + 1)}
        >
          <ChevronRight className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Last page"
          disabled={atLast}
          onClick={() => onPageChange(totalPagesUi)}
        >
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div
      className={cn(
        "flex w-full flex-wrap items-center gap-x-6 gap-y-3",
        pageSizeRow ? "justify-between" : "justify-end",
        className,
      )}
    >
      {pageSizeRow}
      {nav}
    </div>
  )
}
