"use client"

import { Suspense, useMemo } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { displayFirstName } from "@/lib/utilities/user-display"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useMetricsContext } from "@/components/metrics-context"
import { formatMetricCount } from "@/lib/utilities/metrics-display"
import { useJobsList } from "@/lib/api/hooks/use-jobs-list"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { toast } from "sonner"
import { hasApiBase } from "@/lib/environment/public-env"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"
import {
  historyBrowseHref,
  stringifyHistoryUrl,
} from "@/lib/utilities/history-url-state"
import { jobDisplayTitle } from "@/lib/utilities/job-display-title"
import { formatJobTableDate } from "@/lib/utilities/format-job-table-date"
import { downloadFromApiJob } from "@/lib/utilities/job-download"
import {
  jobDownloadInteractionDisabled,
  jobIsCompleted,
  jobMatchesStatus,
} from "@/lib/utilities/job-status"
import type { ApiJob } from "@/lib/types/jobs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { Upload, ClipboardList, Coins, Clock, AlertCircle, Download, Eye } from "lucide-react"

type DashboardJobsTab = "all" | "fast-fill" | "express-estimate"

function parseDashboardJobsTab(raw: string | null): DashboardJobsTab {
  if (raw === "fast-fill" || raw === "express-estimate") return raw
  return "all"
}

function jobTypeLabel(job: ApiJob): "FF" | "EE" {
  return job.job_type === "ff" ? "FF" : "EE"
}

function filterJobsByTab(jobs: ApiJob[], tab: DashboardJobsTab): ApiJob[] {
  if (tab === "fast-fill") return jobs.filter((j) => j.job_type === "ff")
  if (tab === "express-estimate") return jobs.filter((j) => j.job_type === "ee")
  return jobs
}

function RecentJobRow({ job }: { job: ApiJob }) {
  const typeLabel = jobTypeLabel(job)
  const isFf = job.job_type === "ff"
  const title = jobDisplayTitle(job)
  const dateStr = formatJobTableDate(job.created_at)
  const completed = jobIsCompleted(job)
  const needsReview = jobMatchesStatus(job, "needs_review")

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold ring-1 ${
            isFf ? "bg-primary/20 text-primary ring-primary/20" : "bg-secondary text-foreground ring-border/60"
          }`}
        >
          {typeLabel}
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{title}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="text-sm text-muted-foreground">{dateStr}</p>
            <JobStatusBadge status={job.status} />
          </div>
        </div>
      </div>
      {(completed || needsReview) && (
        <div className="flex shrink-0 items-center gap-1 border-l border-border/60 pl-3" aria-label="Actions">
          {completed && (
            <Button
              variant="ghost"
              size="icon"
              title={jobDownloadInteractionDisabled(job) ? "Download available when completed" : "Download"}
              disabled={jobDownloadInteractionDisabled(job)}
              onClick={() => {
                void (async () => {
                  try {
                    await downloadFromApiJob(job)
                  } catch (e) {
                    toast.error(getApiErrorMessage(e))
                  }
                })()
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          {needsReview && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/history?q=${encodeURIComponent(job.id)}`} title="View in history">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function DashboardPageContent() {
  const user = useAuthStore((s) => s.user)
  const firstName = displayFirstName(user)
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()

  const jobsTab = parseDashboardJobsTab(urlSearchParams.get("tab"))

  const { dashboard: dashboardQuery, jobStatusSummary: summaryQuery } = useMetricsContext()
  const metrics = dashboardQuery.data
  const metricsLoading = dashboardQuery.isLoading
  const metricsError = dashboardQuery.isError
  const statusSummary = summaryQuery.data
  const statusSummaryLoading = summaryQuery.isLoading
  const statusSummaryError = summaryQuery.isError
  const statusSummaryErr = summaryQuery.error

  const { data, isLoading, isError, error, refetch } = useJobsList({
    page: 1,
    page_size: 5,
  })

  const items = data?.items ?? []

  const metricValue = (n: number | undefined) =>
    formatMetricCount(n, { isError: metricsError, isLoading: metricsLoading })

  const statusCountValue = (n: number | undefined) =>
    formatMetricCount(n, { isError: statusSummaryError, isLoading: statusSummaryLoading })

  const viewAllHref = historyBrowseHref(
    jobsTab === "fast-fill" ? "ff" : jobsTab === "express-estimate" ? "ee" : null,
  )

  const completedHistoryHref = (() => {
    const qs = stringifyHistoryUrl({
      q: "",
      page: 1,
      page_size: LIST_PAGE_SIZE,
      job_type: null,
      status: ["completed"],
      created_from: null,
      created_to: null,
    })
    return qs ? `/history?${qs}` : "/history"
  })()

  const readyForDownload = useMemo(() => {
    return items
      .filter((j) => jobIsCompleted(j) && j.download_url?.trim())
      .slice(0, 5)
  }, [items])

  const setJobsTab = (value: string) => {
    const nextTab = parseDashboardJobsTab(value)
    const next = new URLSearchParams(urlSearchParams.toString())
    if (nextTab === "all") {
      next.delete("tab")
    } else {
      next.set("tab", nextTab)
    }
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">{"Here's an overview of your claims estimating activity"}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fast Fill Tokens</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Upload className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-foreground">
              {metricValue(metrics?.fast_fill_tokens)}
            </div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Express Estimate Tokens</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-foreground">
              {metricValue(metrics?.express_estimate_tokens)}
            </div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-foreground">
              {metricValue(metrics?.processing)}
            </div>
            <p className="text-xs text-muted-foreground">Jobs in progress</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Review</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <AlertCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums text-foreground">
              {metricValue(metrics?.needs_review)}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>Start a new project or manage your tokens</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/fast-fill/new">
            <Button className="gap-2 shadow-md shadow-primary/20">
              <Upload className="h-4 w-4" />
              New Fast Fill Project
            </Button>
          </Link>
          <Link href="/express-estimate/new">
            <Button className="gap-2 shadow-md shadow-primary/20">
              <ClipboardList className="h-4 w-4" />
              New Express Estimate
            </Button>
          </Link>
          <Link href="/tokens">
            <Button className="gap-2 shadow-md shadow-primary/20">
              <Coins className="h-4 w-4" />
              Buy Tokens
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/80 shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Jobs</CardTitle>
              <CardDescription>Your latest claim estimating jobs</CardDescription>
            </div>
            <Link href={viewAllHref}>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
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
              <Tabs value={jobsTab} onValueChange={setJobsTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Jobs</TabsTrigger>
                  <TabsTrigger value="fast-fill">Fast Fill</TabsTrigger>
                  <TabsTrigger value="express-estimate">Express Estimate</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-0">
                  <RecentJobsList
                    jobs={filterJobsByTab(items, "all")}
                    isLoading={isLoading}
                    emptyMessage="No jobs yet."
                  />
                </TabsContent>
                <TabsContent value="fast-fill" className="mt-0">
                  <RecentJobsList
                    jobs={filterJobsByTab(items, "fast-fill")}
                    isLoading={isLoading}
                    emptyMessage="No Fast Fill jobs yet."
                  />
                </TabsContent>
                <TabsContent value="express-estimate" className="mt-0">
                  <RecentJobsList
                    jobs={filterJobsByTab(items, "express-estimate")}
                    isLoading={isLoading}
                    emptyMessage="No Express Estimate jobs yet."
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Ready for Download</CardTitle>
            <CardDescription>Completed outputs available for 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasApiBase ? (
              <p className="text-sm text-muted-foreground">
                Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to see
                downloads.
              </p>
            ) : isError ? null : readyForDownload.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed downloads yet.</p>
            ) : (
              <div className="space-y-4">
                {readyForDownload.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border/40 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{jobDisplayTitle(job)}</p>
                      <p className="text-xs text-muted-foreground">{formatJobTableDate(job.created_at)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 border-l border-border/60 pl-3" aria-label="Actions">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-primary hover:bg-primary/20"
                        title="Download"
                        disabled={jobDownloadInteractionDisabled(job)}
                        onClick={() => {
                          void (async () => {
                            try {
                              await downloadFromApiJob(job)
                            } catch (e) {
                              toast.error(getApiErrorMessage(e))
                            }
                          })()
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href={completedHistoryHref} className="mt-4 block">
              <Button variant="link" className="h-auto p-0 text-primary">
                View all completed
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Job Status Summary</CardTitle>
          <CardDescription>Overview of all your jobs by status</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasApiBase ? (
            <p className="text-sm text-muted-foreground">
              Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to load
              status counts.
            </p>
          ) : statusSummaryError ? (
            <p className="text-sm text-destructive">{getApiErrorMessage(statusSummaryErr)}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {(
                [
                  { label: "Submitted", key: "submitted" as const, color: "bg-blue-950/50" },
                  { label: "Processing", key: "processing" as const, color: "bg-yellow-950/50" },
                  { label: "Completed", key: "completed" as const, color: "bg-primary/20" },
                  { label: "Failed", key: "failed" as const, color: "bg-red-950/50" },
                  { label: "Needs Review", key: "needs_review" as const, color: "bg-orange-950/50" },
                ] as const
              ).map((status) => (
                <div
                  key={status.key}
                  className={`rounded-lg ${status.color} border border-border/40 p-4 text-center transition-colors hover:border-border/60`}
                >
                  <div className="text-2xl font-bold tabular-nums text-foreground">
                    {statusCountValue(statusSummary?.[status.key])}
                  </div>
                  <div className="text-sm text-muted-foreground">{status.label}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function RecentJobsList({
  jobs,
  isLoading,
  emptyMessage,
}: {
  jobs: ApiJob[]
  isLoading: boolean
  emptyMessage: string
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 text-sm text-muted-foreground" aria-busy="true">
        Loading…
      </div>
    )
  }
  if (jobs.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }
  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <RecentJobRow key={job.id} job={job} />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">Loading…</div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  )
}
