"use client"

import { useState } from "react"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { useOpsJobsList } from "@/lib/api/hooks/use-ops-jobs-list"
import { ListPagination } from "@/components/list-pagination"
import { JobsDataTable } from "@/components/jobs/jobs-data-table"
import { backOfficeEeJobColumns } from "@/components/jobs/job-table-columns"
import { hasApiBase } from "@/lib/environment/public-env"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const BACK_OFFICE_JOBS_REFETCH_MS = 30_000

export default function BackOfficePage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error, refetch } = useOpsJobsList(
    {
      job_type: "ee",
      page,
      page_size: LIST_PAGE_SIZE,
    },
    { refetchInterval: BACK_OFFICE_JOBS_REFETCH_MS },
  )

  const items = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Back office</h1>
        <p className="mt-1 text-muted-foreground">
          Express Estimate queue (all customers, non-draft). Process inputs, upload outputs, and complete work.
        </p>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Queue</CardTitle>
          <CardDescription>Non-draft jobs across all customers (same filters as the main list)</CardDescription>
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
            <div className="space-y-0">
              <div className="overflow-x-auto rounded-xl border border-border/60 bg-gradient-to-b from-card to-muted/10">
                <JobsDataTable
                  tableClassName="w-full min-w-[36rem]"
                  gridColsClassName="grid-cols-[minmax(0,1fr)_10rem_11.5rem_7.5rem]"
                  columns={backOfficeEeJobColumns}
                  data={items}
                  isLoading={isLoading}
                  emptyMessage="No Express Estimate jobs yet."
                  getRowId={(row) => row.id}
                />
              </div>
              <ListPagination
                className="mt-6"
                page={page}
                totalItems={total}
                pageSize={LIST_PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
