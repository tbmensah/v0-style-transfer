"use client"

import { useState } from "react"
import Link from "next/link"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { useJobsList } from "@/lib/api/hooks/use-jobs-list"
import { ListPagination } from "@/components/list-pagination"
import { JobsDataTable } from "@/components/jobs/jobs-data-table"
import { fastFillJobColumns } from "@/components/jobs/job-table-columns"
import { useMetricsContext } from "@/components/metrics-context"
import { hasApiBase } from "@/lib/environment/public-env"
import { formatMetricCount } from "@/lib/utilities/metrics-display"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"

export default function FastFillPage() {
  const [page, setPage] = useState(1)
  const { dashboard: dashboardMetrics } = useMetricsContext()
  const ffDisplay = formatMetricCount(dashboardMetrics.data?.fast_fill_tokens, {
    isError: dashboardMetrics.isError,
    isLoading: dashboardMetrics.isLoading,
  })
  const { data, isLoading, isError, error, refetch } = useJobsList({
    job_type: "ff",
    page,
    page_size: LIST_PAGE_SIZE,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fast Fill</h1>
          <p className="mt-1 text-muted-foreground">Upload PDF + ESX pairs and receive prelim-ready ESX outputs</p>
        </div>
        <Link href="/fast-fill/new">
          <Button className="gap-2 shadow-md shadow-primary/20">
            <Plus className="h-4 w-4" />
            New Fast Fill Project
          </Button>
        </Link>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available Tokens</CardTitle>
          <CardDescription>Each Fast Fill job uses tokens per your account balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold tabular-nums text-foreground">{ffDisplay}</span>
            <Badge variant="secondary" className="text-xs">
              FF tokens
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Fast Fill Jobs</CardTitle>
          <CardDescription>All your Fast Fill submissions</CardDescription>
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
                columns={fastFillJobColumns}
                data={items}
                isLoading={isLoading}
                emptyMessage="No Fast Fill jobs yet. Create one to get started."
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
