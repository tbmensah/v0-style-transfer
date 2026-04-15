"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatJobTableDate } from "@/lib/utilities/format-job-table-date"
import { jobDisplayTitle } from "@/lib/utilities/job-display-title"
import { openJobDownloadUrl } from "@/lib/utilities/job-download"
import {
  jobDownloadInteractionDisabled,
  jobIsCompleted,
  jobMatchesStatus,
} from "@/lib/utilities/job-status"
import type { ApiJob } from "@/lib/types/jobs"
import type { JobTableColumnMeta } from "@/components/jobs/jobs-data-table"
import {
  ClipboardList,
  Download,
  Edit,
  Eye,
  Trash2,
  Upload,
} from "lucide-react"

const meta = (m: JobTableColumnMeta): JobTableColumnMeta => m

function jobDownloadTitle(job: ApiJob): string {
  if (!jobIsCompleted(job)) return "Download available when completed"
  if (!job.download_url?.trim()) return "No download link available"
  return "Download"
}

function downloadButton(job: ApiJob) {
  return (
    <Button
      variant="ghost"
      size="icon"
      title={jobDownloadTitle(job)}
      disabled={jobDownloadInteractionDisabled(job)}
      onClick={() => {
        const u = job.download_url?.trim()
        if (u) openJobDownloadUrl(u)
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
          {jobMatchesStatus(job, "draft") && (
            <>
              <Button variant="ghost" size="icon" title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Delete"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
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
      const job = row.original
      return (
        <div className="flex items-center justify-end gap-2">
          {downloadButton(job)}
          {jobMatchesStatus(job, "queued", "processing") && (
            <Button variant="ghost" size="icon" title="View">
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    },
    meta: meta({ headerClassName: "text-right", cellClassName: "text-right" }),
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
