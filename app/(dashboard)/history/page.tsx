"use client"

import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { useJobsList } from "@/lib/api/hooks/use-jobs-list"
import { useJobsSearch } from "@/lib/api/hooks/use-jobs-search"
import { ListPagination } from "@/components/list-pagination"
import { JobsDataTable } from "@/components/jobs/jobs-data-table"
import { historyJobColumns } from "@/components/jobs/job-table-columns"
import {
  HistoryJobFiltersSheet,
  type HistoryFilterValues,
} from "@/components/history/history-job-filters-sheet"
import { hasApiBase } from "@/lib/environment/public-env"
import { LIST_PAGE_SIZE } from "@/lib/constants/pagination"
import {
  parseHistoryUrl,
  stringifyHistoryUrl,
  type HistoryUrlState,
} from "@/lib/utilities/history-url-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Search, X } from "lucide-react"
import type { JobStatus, JobType } from "@/lib/types/jobs"

function formatStatusLabel(s: JobStatus) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatFilterDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

const defaultFilters = (): HistoryFilterValues => ({
  job_type: null,
  status: [],
  created_from: null,
  created_to: null,
})

function urlStateToFilters(h: HistoryUrlState): HistoryFilterValues {
  return {
    job_type: h.job_type,
    status: h.status,
    created_from: h.created_from,
    created_to: h.created_to,
  }
}

function HistoryPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const searchKey = urlSearchParams.toString()

  const [qInput, setQInput] = useState(() => parseHistoryUrl(urlSearchParams).q)
  const [qApplied, setQApplied] = useState(() => parseHistoryUrl(urlSearchParams).q)
  const [page, setPage] = useState(() => parseHistoryUrl(urlSearchParams).page)
  const [pageSize, setPageSize] = useState(() => parseHistoryUrl(urlSearchParams).page_size)
  const [filters, setFilters] = useState<HistoryFilterValues>(() =>
    urlStateToFilters(parseHistoryUrl(urlSearchParams)),
  )
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const next = parseHistoryUrl(new URLSearchParams(searchKey))
    setQInput(next.q)
    setQApplied(next.q)
    setPage(next.page)
    setPageSize(next.page_size)
    setFilters(urlStateToFilters(next))
  }, [searchKey])

  const replaceUrl = useCallback(
    (state: HistoryUrlState) => {
      const qs = stringifyHistoryUrl(state)
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  function buildUrlState(over: Partial<HistoryUrlState>): HistoryUrlState {
    return {
      q: over.q !== undefined ? over.q : qApplied,
      page: over.page !== undefined ? over.page : page,
      page_size: over.page_size !== undefined ? over.page_size : pageSize,
      job_type: over.job_type !== undefined ? over.job_type : filters.job_type,
      status: over.status !== undefined ? over.status : filters.status,
      created_from: over.created_from !== undefined ? over.created_from : filters.created_from,
      created_to: over.created_to !== undefined ? over.created_to : filters.created_to,
    }
  }

  const searchActive = qApplied.trim().length >= 1

  const listParams = useMemo(
    () => ({
      page,
      page_size: pageSize,
      ...(filters.job_type ? { job_type: filters.job_type } : {}),
      ...(filters.status.length > 0 ? { status: filters.status } : {}),
      ...(filters.created_from ? { created_from: filters.created_from } : {}),
      ...(filters.created_to ? { created_to: filters.created_to } : {}),
    }),
    [page, pageSize, filters],
  )

  const jobsSearchApiParams = useMemo(
    () => ({
      q: qApplied,
      page,
      page_size: pageSize,
      ...(filters.job_type ? { job_type: filters.job_type } : {}),
      ...(filters.status.length > 0 ? { status: filters.status } : {}),
      ...(filters.created_from ? { created_from: filters.created_from } : {}),
      ...(filters.created_to ? { created_to: filters.created_to } : {}),
    }),
    [page, pageSize, qApplied, filters],
  )

  const browseQuery = useJobsList(listParams, { enabled: !searchActive })
  const searchQuery = useJobsSearch(jobsSearchApiParams, { enabled: searchActive })

  const active = searchActive ? searchQuery : browseQuery
  const { data, isLoading, isError, error, refetch } = active

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const jobTypeTab =
    filters.job_type === "ff" ? "fast-fill" : filters.job_type === "ee" ? "express-estimate" : "all"

  const searchPlaceholder =
    jobTypeTab === "fast-fill"
      ? "Enter file name or job id…"
      : jobTypeTab === "express-estimate"
        ? "Enter project name or job id…"
        : "Enter job id, project name, or file name…"

  const searchAriaLabel =
    jobTypeTab === "fast-fill"
      ? "Search by file name or job id"
      : jobTypeTab === "express-estimate"
        ? "Search by project name or job id"
        : "Search by job id, project name, or file name"

  function setJobTypeFromTab(value: string) {
    const job_type: JobType | null =
      value === "fast-fill" ? "ff" : value === "express-estimate" ? "ee" : null
    setFilters((f) => ({ ...f, job_type }))
    setPage(1)
    replaceUrl(buildUrlState({ page: 1, job_type }))
  }

  type FilterChip = { id: string; label: string; onRemove: () => void }

  const filterChips: FilterChip[] = []
  if (filters.status.length > 0) {
    const labels = [...filters.status].sort().map((s) => formatStatusLabel(s))
    filterChips.push({
      id: "status",
      label: `Status: ${labels.join(", ")}`,
      onRemove: () => {
        setFilters((f) => ({ ...f, status: [] }))
        setPage(1)
        replaceUrl(buildUrlState({ page: 1, status: [] }))
      },
    })
  }
  if (filters.created_from) {
    filterChips.push({
      id: "created_from",
      label: `Created from: ${formatFilterDateTime(filters.created_from)}`,
      onRemove: () => {
        setFilters((f) => ({ ...f, created_from: null }))
        setPage(1)
        replaceUrl(buildUrlState({ page: 1, created_from: null }))
      },
    })
  }
  if (filters.created_to) {
    filterChips.push({
      id: "created_to",
      label: `Created to: ${formatFilterDateTime(filters.created_to)}`,
      onRemove: () => {
        setFilters((f) => ({ ...f, created_to: null }))
        setPage(1)
        replaceUrl(buildUrlState({ page: 1, created_to: null }))
      },
    })
  }

  const listTitle =
    filters.job_type === "ff"
      ? "Fast Fill jobs"
      : filters.job_type === "ee"
        ? "Express Estimate jobs"
        : "All jobs"

  function handleSearch() {
    const t = qInput.trim()
    if (t.length < 1) {
      toast.error("Enter at least one character of job id")
      return
    }
    if (t.length > 64) {
      toast.error("Search must be at most 64 characters")
      return
    }
    const next = buildUrlState({ q: t, page: 1 })
    setQApplied(t)
    setQInput(t)
    setPage(1)
    replaceUrl(next)
  }

  function handleClear() {
    const empty: HistoryUrlState = {
      q: "",
      page: 1,
      page_size: LIST_PAGE_SIZE,
      job_type: null,
      status: [],
      created_from: null,
      created_to: null,
    }
    setQInput("")
    setQApplied("")
    setPage(1)
    setPageSize(LIST_PAGE_SIZE)
    setFilters(defaultFilters())
    replaceUrl(empty)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Job History</h1>
        <p className="mt-1 text-muted-foreground">View and manage all your claim estimating jobs</p>
      </div>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardContent className="pt-6">
          <form
            className="flex flex-wrap items-end gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch()
            }}
          >
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="border-border/60 bg-secondary/50 pl-9"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                aria-label={searchAriaLabel}
              />
            </div>
            <Button type="submit" className="gap-2 shadow-md shadow-primary/20">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-border/60"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-border/60"
              onClick={() => setSheetOpen(true)}
            >
              <Filter className="h-4 w-4" />
              {"Status & dates"}
            </Button>
          </form>
          <Tabs value={jobTypeTab} onValueChange={setJobTypeFromTab} className="mt-4 w-full">
            <TabsList className="mb-1 w-fit">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="fast-fill">Fast Fill</TabsTrigger>
              <TabsTrigger value="express-estimate">Express Estimate</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="m-0 hidden" aria-hidden />
            <TabsContent value="fast-fill" className="m-0 hidden" aria-hidden />
            <TabsContent value="express-estimate" className="m-0 hidden" aria-hidden />
          </Tabs>
          {searchActive ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing results matching <code className="text-[0.7rem]">{qApplied}</code>. Clear search to browse with
              filters and pagination.
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              {jobTypeTab === "fast-fill"
                ? "Paginated list with optional filters. Search matches PDF file names or job ids."
                : jobTypeTab === "express-estimate"
                  ? "Paginated list with optional filters. Search matches project names or job ids."
                  : "Paginated list with optional filters. Search matches job ids, project names, or file names."}{" "}
              Filters and page stay in the URL when you refresh.
            </p>
          )}
          {filterChips.length > 0 ? (
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0" aria-label="Active filters">
              {filterChips.map((chip) => (
                <li key={chip.id}>
                  <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/30 py-1 pl-2.5 pr-1 text-xs text-foreground">
                    <span>{chip.label}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                      aria-label={`Remove filter: ${chip.label}`}
                      onClick={chip.onRemove}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>

      <HistoryJobFiltersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        applied={filters}
        onApply={(next) => {
          const nextUrl = buildUrlState({
            page: 1,
            status: next.status,
            created_from: next.created_from,
            created_to: next.created_to,
          })
          setFilters((f) => ({ ...f, ...next }))
          setPage(1)
          replaceUrl(nextUrl)
        }}
        searchActive={searchActive}
      />

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground capitalize">{listTitle}</CardTitle>
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
                emptyMessage={searchActive ? "No jobs match this search." : "No jobs yet."}
                getRowId={(row) => row.id}
              />
              <ListPagination
                className="mt-6"
                page={page}
                totalItems={total}
                pageSize={pageSize}
                onPageSizeChange={(sz) => {
                  setPage(1)
                  setPageSize(sz)
                  replaceUrl(buildUrlState({ page: 1, page_size: sz }))
                }}
                onPageChange={(p) => {
                  setPage(p)
                  replaceUrl(buildUrlState({ page: p }))
                }}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">Loading…</div>
      }
    >
      <HistoryPageContent />
    </Suspense>
  )
}
