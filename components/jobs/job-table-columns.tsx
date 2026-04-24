"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatJobTableDate } from "@/lib/utilities/format-job-table-date"
import { jobDisplayTitle } from "@/lib/utilities/job-display-title"
import { downloadFromApiJob } from "@/lib/utilities/job-download"
import { jobDownloadInteractionDisabled, jobIsCompleted, jobMatchesStatus } from "@/lib/utilities/job-status"
import type { ApiJob } from "@/lib/types/jobs"
import type { JobTableColumnMeta } from "@/components/jobs/jobs-data-table"
import { ClipboardList, Download, Eye, Upload } from "lucide-react"

const meta = (m: JobTableColumnMeta): JobTableColumnMeta => m

const backOfficeEePath = (jobId: string) => `/back-office/express-estimate/${encodeURIComponent(jobId)}`

function jobDownloadTitle(job: ApiJob): string {
  if (!jobIsCompleted(job)) {
    return job.job_type === "ee" ? "Download available when status is completed" : "Download available when completed"
  }
  if (!job.download_url?.trim()) return "No download link available"
  return job.job_type === "ee" ? "Download final output" : "Download"
}

function downloadButton(job: ApiJob, titleFn: (j: ApiJob) => string = jobDownloadTitle) {
  return (
    <Button
      variant="ghost"
      size="icon"
      title={titleFn(job)}
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
  )
}

export const fastFillJobColumns: ColumnDef<ApiJob, unknown>[] = [
  {
    id: "job",
    header: "Job",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
          <Upload className="h-4 w-4 text-primary" />
        </div>
        <span className="min-w-0 truncate font-medium text-foreground">{jobDisplayTitle(row.original)}</span>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatJobTableDate(row.original.created_at)}</span>
    ),
    meta: meta({ cellClassName: "text-muted-foreground" }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <JobStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "token_cost",
    header: "Tokens",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">{row.original.token_cost}</span>
    ),
    meta: meta({
      headerClassName: "text-center",
      cellClassName: "text-center tabular-nums text-muted-foreground",
    }),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const job = row.original
      return (
        <div className="flex items-center justify-end gap-2">
          {downloadButton(job)}
          {jobMatchesStatus(job, "queued", "processing") && (
            <Button variant="ghost" size="icon" title="View">
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {jobMatchesStatus(job, "failed", "error") && (
            <Button variant="ghost" size="sm">
              Retry
            </Button>
          )}
        </div>
      )
    },
    meta: meta({ headerClassName: "text-right", cellClassName: "text-right" }),
  },
]

/** Field Express Estimate list + history: final output download only (Process lives on back office). */
const expressEeFieldActionCell = (job: ApiJob) => (
  <div className="flex items-center justify-end">
    {downloadButton(job, jobDownloadTitle)}
  </div>
)

const backOfficeEeActionCell = (job: ApiJob) => (
  <div className="flex w-full justify-start pr-0.5">
    <Button
      asChild
      size="sm"
      className="min-w-[5.5rem] font-medium shadow-sm"
      title="Open job workspace: input, output, complete"
    >
      <Link href={backOfficeEePath(job.id)}>Process</Link>
    </Button>
  </div>
)

export const expressJobColumns: ColumnDef<ApiJob, unknown>[] = [
  {
    id: "job",
    header: "Job",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
          <ClipboardList className="h-4 w-4 text-primary" />
        </div>
        <span className="min-w-0 truncate font-medium text-foreground">{jobDisplayTitle(row.original)}</span>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatJobTableDate(row.original.created_at)}</span>
    ),
    meta: meta({ cellClassName: "text-muted-foreground" }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <JobStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "token_cost",
    header: "Tokens",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted-foreground">{row.original.token_cost}</span>
    ),
    meta: meta({
      headerClassName: "text-center",
      cellClassName: "text-center tabular-nums text-muted-foreground",
    }),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return expressEeFieldActionCell(row.original)
    },
    meta: meta({ headerClassName: "text-right", cellClassName: "text-right" }),
  },
]

/** Express Estimate operator queue: no Tokens column; actions are Process only. */
export const backOfficeEeJobColumns: ColumnDef<ApiJob, unknown>[] = [
  {
    id: "job",
    header: "Job",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3 pl-0.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-border/50">
          <ClipboardList className="h-4 w-4 text-primary" />
        </div>
        <span className="min-w-0 truncate text-sm font-medium leading-snug text-foreground">
          {jobDisplayTitle(row.original)}
        </span>
      </div>
    ),
    meta: meta({ headerClassName: "min-w-0", cellClassName: "min-w-0" }),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <time className="whitespace-nowrap text-sm text-muted-foreground" dateTime={row.original.created_at}>
        {formatJobTableDate(row.original.created_at)}
      </time>
    ),
    meta: meta({
      headerClassName: "whitespace-nowrap",
      cellClassName: "whitespace-nowrap tabular-nums text-muted-foreground",
    }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <JobStatusBadge status={row.original.status} />,
    meta: meta({ headerClassName: "min-w-0", cellClassName: "flex min-w-0 items-center" }),
  },
  {
    id: "actions",
    header: () => <div className="flex w-full text-left">Actions</div>,
    cell: ({ row }) => {
      return backOfficeEeActionCell(row.original)
    },
    meta: meta({ headerClassName: "text-left", cellClassName: "text-right" }),
  },
]

export const historyJobColumns: ColumnDef<ApiJob, unknown>[] = [
  {
    id: "job",
    header: "Job",
    cell: ({ row }) => {
      const job = row.original
      return (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
            {job.job_type === "ff" ? (
              <Upload className="h-4 w-4 text-primary" />
            ) : (
              <ClipboardList className="h-4 w-4 text-primary" />
            )}
          </div>
          <span className="min-w-0 truncate font-medium text-foreground">{jobDisplayTitle(job)}</span>
        </div>
      )
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.original.job_type === "ff" ? "Fast Fill" : "Express Estimate"}
      </Badge>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatJobTableDate(row.original.created_at)}</span>
    ),
    meta: meta({ cellClassName: "text-muted-foreground" }),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <JobStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const job = row.original
      if (job.job_type === "ee") {
        return expressEeFieldActionCell(job)
      }
      return (
        <div className="flex items-center justify-end gap-2">
          {downloadButton(job)}
          {jobMatchesStatus(job, "queued", "processing") && (
            <Button variant="ghost" size="icon" title="View">
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {jobMatchesStatus(job, "failed", "error") && (
            <Button variant="ghost" size="sm">
              Retry
            </Button>
          )}
        </div>
      )
    },
    meta: meta({ headerClassName: "text-right", cellClassName: "text-right" }),
  },
]
