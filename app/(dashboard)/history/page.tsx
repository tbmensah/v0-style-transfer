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
import { Search, Filter } from "lucide-react"
import type { JobStatus } from "@/lib/types/jobs"

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
  const [filters, setFilters] = useState<HistoryFilterValues>(() =>
    urlStateToFilters(parseHistoryUrl(urlSearchParams)),
  )
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const next = parseHistoryUrl(new URLSearchParams(searchKey))
    setQInput(next.q)
    setQApplied(next.q)
    setPage(next.page)
    setFilters(urlStateToFilters(next))
  }, [searchKey])

  const replaceUrl = useCallback(
    (state: HistoryUrlState) => {
      const qs = stringifyHistoryUrl(state)
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  const searchActive = qApplied.trim().length >= 1

  const listParams = useMemo(
    () => ({
      page,
      page_size: LIST_PAGE_SIZE,
      ...(filters.job_type ? { job_type: filters.job_type } : {}),
      ...(filters.status.length > 0 ? { status: filters.status } : {}),
      ...(filters.created_from ? { created_from: filters.created_from } : {}),
      ...(filters.created_to ? { created_to: filters.created_to } : {}),
    }),
    [page, filters],
  )

  const jobsSearchApiParams = useMemo(
    () => ({
      q: qApplied,
      page,
      page_size: LIST_PAGE_SIZE,
      ...(filters.job_type ? { job_type: filters.job_type } : {}),
      ...(filters.status.length > 0 ? { status: filters.status } : {}),
    }),
    [page, qApplied, filters.job_type, filters.status],
  )

  const browseQuery = useJobsList(listParams, { enabled: !searchActive })
  const searchQuery = useJobsSearch(jobsSearchApiParams, { enabled: searchActive })

  const active = searchActive ? searchQuery : browseQuery
  const { data, isLoading, isError, error, refetch } = active

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const activeFilterChips = useMemo(() => {
    const chips: string[] = []
    if (page > 1) {
      chips.push(`Page: ${page}`)
    }
    if (filters.job_type === "ff") {
      chips.push("Type: Fast Fill")
    } else if (filters.job_type === "ee") {
      chips.push("Type: Express Estimate")
    }
    if (filters.status.length > 0) {
      const labels = [...filters.status].sort().map((s) => formatStatusLabel(s))
      chips.push(`Status: ${labels.join(", ")}`)
    }
    if (filters.created_from) {
      chips.push(`Created from: ${formatFilterDateTime(filters.created_from)}`)
    }
    if (filters.created_to) {
      chips.push(`Created to: ${formatFilterDateTime(filters.created_to)}`)
    }
    return chips
  }, [qApplied, page, filters])

  function buildUrlState(over: Partial<HistoryUrlState>): HistoryUrlState {
    return {
      q: over.q !== undefined ? over.q : qApplied,
      page: over.page !== undefined ? over.page : page,
      job_type: over.job_type !== undefined ? over.job_type : filters.job_type,
      status: over.status !== undefined ? over.status : filters.status,
      created_from: over.created_from !== undefined ? over.created_from : filters.created_from,
      created_to: over.created_to !== undefined ? over.created_to : filters.created_to,
    }
  }

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
      job_type: null,
      status: [],
      created_from: null,
      created_to: null,
    }
    setQInput("")
    setQApplied("")
    setPage(1)
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
                placeholder="Job id fragment (UUID substring)…"
                className="border-border/60 bg-secondary/50 pl-9"
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                aria-label="Search by job id fragment"
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
              Filters
            </Button>
          </form>
          {searchActive ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Showing search results for id containing <code className="text-[0.7rem]">{qApplied}</code>. Date
              filters apply when you clear search and browse all jobs.
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Paginated list with optional filters. Use Search after entering part of a job UUID. Filters and page
              stay in the URL when you refresh.
            </p>
          )}
          {activeFilterChips.length > 0 ? (
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0" aria-label="Active filters">
              {activeFilterChips.map((label) => (
                <li
                  key={label}
                  className="rounded-md border border-border/60 bg-secondary/30 px-2.5 py-1 text-xs text-foreground"
                >
                  {label}
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
            job_type: next.job_type,
            status: next.status,
            created_from: next.created_from,
            created_to: next.created_to,
          })
          setFilters(next)
          setPage(1)
          replaceUrl(nextUrl)
        }}
        searchActive={searchActive}
      />

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
                emptyMessage={searchActive ? "No jobs match this search." : "No jobs yet."}
                getRowId={(row) => row.id}
              />
              <ListPagination
                className="mt-6"
                page={page}
                totalItems={total}
                pageSize={LIST_PAGE_SIZE}
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
