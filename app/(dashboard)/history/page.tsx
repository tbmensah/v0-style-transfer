"use client"

import { useState } from "react"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { useJobsList } from "@/lib/api/hooks/use-jobs-list"
import { ListPagination } from "@/components/list-pagination"
import { JobsDataTable } from "@/components/jobs/jobs-data-table"
import { historyJobColumns } from "@/components/jobs/job-table-columns"
import { hasApiBase } from "@/lib/environment/public-env"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

export default function HistoryPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error, refetch } = useJobsList({
    page,
    page_size: LIST_PAGE_SIZE,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Job History</h1>
        <p className="mt-1 text-muted-foreground">View and manage all your claim estimating jobs</p>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search jobs…" className="border-border/60 bg-secondary/50 pl-9" disabled />
            </div>
            <Button variant="outline" className="gap-2 border-border/60" type="button" disabled>
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Search and date filters will use the API when wired. List uses server pagination (
            <code className="text-[0.7rem]">page</code>, <code className="text-[0.7rem]">page_size</code>).
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">All Jobs</CardTitle>
          <CardDescription>Fast Fill and Express Estimate jobs from your account</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasApiBase ? (
            <p className="text-sm text-muted-foreground">
              Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to load
              jobs from the API.
            </p>
          ) : isError ? (
            <div className="space-y-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm text-destructive">{getApiErrorMessage(error)}</p>
              <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <JobsDataTable
                columns={historyJobColumns}
                data={items}
                isLoading={isLoading}
                emptyMessage="No jobs yet."
                getRowId={(row) => row.id}
              />
              <ListPagination
                className="mt-6"
                page={page}
                totalItems={total}
                pageSize={LIST_PAGE_SIZE}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
