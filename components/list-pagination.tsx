"use client"

import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"
import { cn } from "@/lib/utils"
import { getTotalPages, getVisiblePageNumbers } from "@/lib/utilities/paginate"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination"

export type ListPaginationProps = {
  page: number
  totalItems: number
  pageSize?: number
  onPageChange: (page: number) => void
  className?: string
}

export function ListPagination({
  page,
  totalItems,
  pageSize = LIST_PAGE_SIZE,
  onPageChange,
  className,
}: ListPaginationProps) {
  const totalPages = getTotalPages(totalItems, pageSize)

  if (totalPages <= 1) return null

  const safePage = Math.min(Math.max(1, page), totalPages)
  const visible = getVisiblePageNumbers(safePage, totalPages)

  return (
    <Pagination className={cn(className)}>
      <PaginationContent className="flex-wrap justify-center gap-1">
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            aria-label="Previous page"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
          >
            Previous
          </Button>
        </PaginationItem>

        {visible.map((item, idx) =>
          item === "ellipsis" ? (
            <PaginationItem key={`e-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <Button
                type="button"
                variant={item === safePage ? "outline" : "ghost"}
                size="icon"
                className="size-9"
                aria-label={`Page ${item}`}
                aria-current={item === safePage ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            aria-label="Next page"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
