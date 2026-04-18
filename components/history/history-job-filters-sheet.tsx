"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { datetimeLocalToIso, isoToDatetimeLocal } from "@/lib/utilities/datetime-local-iso"
import { JOB_STATUS_VALUES, type JobStatus, type JobType } from "@/lib/types/jobs"

export type HistoryFilterValues = {
  job_type: JobType | null
  status: JobStatus[]
  created_from: string | null
  created_to: string | null
}

type Draft = {
  status: JobStatus[]
  createdFromLocal: string
  createdToLocal: string
}

/** Status + date filters only; job type is controlled on the history page (tabs). */
export type HistorySheetFilterResult = Pick<HistoryFilterValues, "status" | "created_from" | "created_to">

function toDraft(f: HistoryFilterValues): Draft {
  return {
    status: [...f.status],
    createdFromLocal: isoToDatetimeLocal(f.created_from),
    createdToLocal: isoToDatetimeLocal(f.created_to),
  }
}

function toApplied(d: Draft): HistorySheetFilterResult {
  return {
    status: d.status,
    created_from: datetimeLocalToIso(d.createdFromLocal) ?? null,
    created_to: datetimeLocalToIso(d.createdToLocal) ?? null,
  }
}

function formatStatusLabel(s: JobStatus) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  applied: HistoryFilterValues
  onApply: (next: HistorySheetFilterResult) => void
  searchActive: boolean
}

export function HistoryJobFiltersSheet({
  open,
  onOpenChange,
  applied,
  onApply,
  searchActive,
}: Props) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(applied))

  useEffect(() => {
    if (open) setDraft(toDraft(applied))
  }, [open, applied])

  const toggleStatus = (s: JobStatus) => {
    setDraft((d) => ({
      ...d,
      status: d.status.includes(s) ? d.status.filter((x) => x !== s) : [...d.status, s],
    }))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Apply status and created date range. Use the job type tabs on the page for Fast Fill vs Express
            Estimate.{" "}
            {searchActive ? (
              <span className="text-amber-600 dark:text-amber-500">
                Date range applies to browse (all jobs) only, not ID search.
              </span>
            ) : null}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4">
          <div className="space-y-3">
            <Label className="text-foreground">Status</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {JOB_STATUS_VALUES.map((s) => (
                <label
                  key={s}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm hover:bg-secondary/50",
                    draft.status.includes(s) && "border-primary/40 bg-primary/5",
                  )}
                >
                  <Checkbox
                    checked={draft.status.includes(s)}
                    onCheckedChange={() => toggleStatus(s)}
                  />
                  <span>{formatStatusLabel(s)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-foreground">Created from</Label>
            <input
              type="datetime-local"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={draft.createdFromLocal}
              onChange={(e) => setDraft((d) => ({ ...d, createdFromLocal: e.target.value }))}
            />
            <Label className="text-foreground">Created to</Label>
            <input
              type="datetime-local"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={draft.createdToLocal}
              onChange={(e) => setDraft((d) => ({ ...d, createdToLocal: e.target.value }))}
            />
          </div>
        </div>

        <SheetFooter className="border-t border-border/60">
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => {
              onApply(toApplied(draft))
              onOpenChange(false)
            }}
          >
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
