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
}

export function JobsDataTable<TData>({
  columns,
  data,
  isLoading,
  emptyMessage,
  getRowId,
  tableClassName,
}: JobsDataTableProps<TData>) {
  const table = useReactTable({
    data: isLoading ? [] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(getRowId ? { getRowId } : {}),
  })

  const colCount = columns.length

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
