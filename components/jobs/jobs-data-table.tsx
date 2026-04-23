"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type JobTableColumnMeta = {
  headerClassName?: string
  cellClassName?: string
}

type JobsDataTableProps<TData> = {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  isLoading?: boolean
  emptyMessage: string
  getRowId?: (originalRow: TData, index: number) => string
  tableClassName?: string
  /**
   * When set, renders as a CSS grid (fixed column template) with table ARIA roles instead of `<table>`.
   * Pass a Tailwind `grid-cols-[…]` class, e.g. `grid-cols-[minmax(0,1fr)_10rem_11rem_7.5rem]`.
   */
  gridColsClassName?: string
}

export function JobsDataTable<TData>({
  columns,
  data,
  isLoading,
  emptyMessage,
  getRowId,
  tableClassName,
  gridColsClassName,
}: JobsDataTableProps<TData>) {
  const table = useReactTable({
    data: isLoading ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(getRowId ? { getRowId } : {}),
  })

  const colCount = columns.length

  if (gridColsClassName) {
    const rowGrid = cn("grid items-center gap-x-4", gridColsClassName)

    return (
      <div className={cn("text-sm", tableClassName)} role="table" aria-label="Jobs list">
        <div role="rowgroup">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              role="row"
              className={cn(rowGrid, "border-b border-border/60 px-3 py-3")}
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as JobTableColumnMeta | undefined
                return (
                  <div
                    key={header.id}
                    role="columnheader"
                    className={cn("min-w-0 text-left font-medium text-muted-foreground", meta?.headerClassName)}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div role="rowgroup">
          {isLoading ? (
            <div
              role="row"
              className={cn(rowGrid, "border-b border-border/60 px-3 py-12 text-center text-muted-foreground")}
            >
              <div role="cell" className="col-span-full flex flex-col items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin opacity-70" aria-hidden />
                <span className="mt-2 block text-sm">Loading jobs…</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div
              role="row"
              className={cn(rowGrid, "border-b border-border/60 px-3 py-10 text-center text-sm text-muted-foreground")}
            >
              <div role="cell" className="col-span-full">
                {emptyMessage}
              </div>
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <div
                key={row.id}
                role="row"
                className={cn(
                  rowGrid,
                  "group border-b border-border/60 px-3 py-4 transition-colors hover:bg-secondary/30 data-[state=selected]:bg-secondary/30",
                )}
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as JobTableColumnMeta | undefined
                  return (
                    <div key={cell.id} role="cell" className={cn("min-w-0", meta?.cellClassName)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <Table className={cn("border-collapse", tableClassName)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-border/60 hover:bg-transparent">
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta as JobTableColumnMeta | undefined
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    "h-auto px-3 py-3 text-muted-foreground",
                    meta?.headerClassName,
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colCount} className="px-3 py-12 text-center text-muted-foreground">
              <Loader2 className="mx-auto h-6 w-6 animate-spin opacity-70" aria-hidden />
              <span className="mt-2 block text-sm">Loading jobs…</span>
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colCount} className="px-3 py-10 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="group border-border/60 hover:bg-secondary/30 data-[state=selected]:bg-secondary/30"
            >
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as JobTableColumnMeta | undefined
                return (
                  <TableCell
                    key={cell.id}
                    className={cn("px-3 py-4", meta?.cellClassName)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
