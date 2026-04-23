"use client"

import type { ExpressEstimatePageValues } from "@/lib/schemas/express-estimate-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

type Props = {
  values: ExpressEstimatePageValues
}

type RoomRow = NonNullable<ExpressEstimatePageValues["rooms"]>[number]

function humanizeKey(key: string): string {
  const spaced = key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .trim()
  if (!spaced) return key
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bLf\b/gi, "LF").replace(/\bSf\b/gi, "SF")
}

function isEmptyValue(v: unknown): boolean {
  if (v === null || v === undefined) return true
  if (typeof v === "string") {
    const t = v.trim()
    return t === "" || t === "__none__"
  }
  if (typeof v === "boolean") return false
  if (typeof v === "number") return Number.isNaN(v)
  if (Array.isArray(v)) return v.length === 0 || v.every(isEmptyValue)
  if (typeof v === "object") {
    return Object.values(v as Record<string, unknown>).every(isEmptyValue)
  }
  return true
}

/** One-line list of which top-level blocks have data (for collapsed preview). */
function summarizeTopLevelSections(data: unknown): string {
  if (!data || typeof data !== "object" || isEmptyValue(data)) {
    return "Nothing filled in for this section."
  }
  const entries = Object.entries(data as Record<string, unknown>).filter(([, v]) => !isEmptyValue(v))
  if (entries.length === 0) return "Nothing filled in for this section."
  const labels = entries.map(([k]) => humanizeKey(k))
  const shown = labels.slice(0, 5)
  const extra = labels.length > 5 ? ` +${labels.length - 5} more` : ""
  return `${shown.join(" · ")}${extra}. Expand to see every field.`
}

function roomImportantSummary(room: RoomRow): string {
  const parts: string[] = []
  if (room.nfipCleaning?.enabled) parts.push("NFIP cleaning")
  if (room.flooring?.enabled) parts.push("Flooring")
  if (room.trim?.enabled) parts.push("Trim")
  if (room.wallCovering?.enabled) parts.push("Walls")
  if (room.electrical?.enabled) parts.push("Electrical")
  const win =
    room.windows?.filter((w: (typeof room.windows)[number]) => !isEmptyValue(w))?.length ?? 0
  if (win > 0) parts.push(`${win} window${win === 1 ? "" : "s"}`)
  const dr =
    room.doors?.filter((d: (typeof room.doors)[number]) => !isEmptyValue(d))?.length ?? 0
  if (dr > 0) parts.push(`${dr} door${dr === 1 ? "" : "s"}`)
  if (room.vanity?.enabled) parts.push("Vanity")
  if (room.toilet?.enabled) parts.push("Toilet")
  if (room.shower?.enabled) parts.push("Shower/tub")
  if (room.cabinets?.enabled) parts.push("Cabinets")
  if (room.countertop?.enabled) parts.push("Countertop")
  if (room.plumbing && Object.values(room.plumbing).some((v) => v === true || (typeof v === "object" && v && !isEmptyValue(v)))) {
    parts.push("Plumbing")
  }
  if (room.appliances?.enabled) parts.push("Appliances")
  if (parts.length === 0) return "No trade checklists expanded — open for full checklist."
  return parts.join(" · ")
}

function summarizeNestedObject(obj: Record<string, unknown>): string {
  const labels = Object.entries(obj)
    .filter(([, v]) => !isEmptyValue(v))
    .map(([k]) => humanizeKey(k))
  if (labels.length === 0) return "—"
  const shown = labels.slice(0, 4)
  const extra = labels.length > 4 ? ` +${labels.length - 4}` : ""
  return `${shown.join(" · ")}${extra}`
}

function summarizeNestedArray(arr: unknown[]): string {
  const filled = arr.filter((i) => !isEmptyValue(i)).length
  if (filled === 0) return "—"
  return `${filled} ${filled === 1 ? "entry" : "entries"}`
}

function CollapsibleField({
  label,
  summary,
  children,
  defaultOpen = false,
}: {
  label: string
  summary: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-md border border-border/40 bg-muted/20">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start gap-2 px-2.5 py-2 text-left text-sm hover:bg-muted/40"
          >
            {open ? (
              <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            ) : (
              <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <span className="min-w-0 flex-1">
              <span className="font-medium text-foreground">{label}</span>
              {!open ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">{summary}</span>
              ) : null}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border/40 px-2.5 pb-3 pt-2">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

/** Renders any wizard object/array as labeled lines. Nested objects/arrays render collapsed. */
function PreviewFields({ data, depth = 0 }: { data: unknown; depth?: number }) {
  if (depth > 16) {
    return <p className="text-xs text-muted-foreground">…</p>
  }
  if (data === null || data === undefined) return null

  if (typeof data === "string") {
    const t = data.trim()
    if (!t || t === "__none__") return null
    return <span className="text-foreground">{t}</span>
  }

  if (typeof data === "number") {
    return <span className="tabular-nums text-foreground">{String(data)}</span>
  }

  if (typeof data === "boolean") {
    return <span className="text-foreground">{data ? "Yes" : "No"}</span>
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return null
    return (
      <div className="space-y-2">
        {data.map((item, i) => {
          if (isEmptyValue(item)) return null
          const label = depth === 0 ? `Row ${i + 1}` : `Entry ${i + 1}`
          const summary =
            typeof item === "object" && item !== null && !Array.isArray(item)
              ? summarizeNestedObject(item as Record<string, unknown>)
              : ""
          return (
            <CollapsibleField key={i} label={label} summary={summary}>
              <PreviewFields data={item} depth={depth + 1} />
            </CollapsibleField>
          )
        })}
      </div>
    )
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>).filter(([, val]) => !isEmptyValue(val))
    if (entries.length === 0) return null

    return (
      <dl className="space-y-2 text-sm">
        {entries.map(([key, val]) => {
          const label = humanizeKey(key)
          if (typeof val === "object" && val !== null && !Array.isArray(val)) {
            return (
              <CollapsibleField
                key={key}
                label={label}
                summary={summarizeNestedObject(val as Record<string, unknown>)}
              >
                <PreviewFields data={val} depth={depth + 1} />
              </CollapsibleField>
            )
          }
          if (Array.isArray(val)) {
            return (
              <CollapsibleField key={key} label={label} summary={summarizeNestedArray(val)}>
                <PreviewFields data={val} depth={depth + 1} />
              </CollapsibleField>
            )
          }
          return (
            <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
              <dt className="min-w-0 shrink-0 text-muted-foreground sm:w-[11rem]">{label}</dt>
              <dd className="min-w-0 font-medium text-foreground">
                <PreviewFields data={val} depth={depth + 1} />
              </dd>
            </div>
          )
        })}
      </dl>
    )
  }

  return null
}

function CollapsiblePreviewBlock({
  title,
  description,
  summary,
  emptyHint,
  hasContent,
  children,
}: {
  title: string
  description: string
  summary: string
  emptyHint: string
  hasContent: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  if (!hasContent) {
    return (
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60 bg-card/80 shadow-md">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="space-y-2 pb-3">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-start gap-2 rounded-md text-left outline-none ring-offset-background hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {open ? (
                <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              ) : (
                <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span className="min-w-0 flex-1 space-y-1">
                <span className="block text-lg font-semibold leading-tight text-foreground">{title}</span>
                <span className="block text-sm text-muted-foreground">{description}</span>
              </span>
            </button>
          </CollapsibleTrigger>
          {!open ? (
            <p className="pl-6 text-sm leading-relaxed text-muted-foreground">{summary}</p>
          ) : null}
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="border-t border-border/60 pt-4">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function ProjectOtherDetailsCollapsible({ values }: { values: ExpressEstimatePageValues }) {
  const [open, setOpen] = useState(false)
  const pd = values.projectDetails
  const summaryParts = [
    pd.propertyType?.trim() ? "Property type" : null,
    pd.adjusterName?.trim() ? "Adjuster" : null,
    pd.notes?.trim() ? "Notes" : null,
  ].filter(Boolean)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-border/60 bg-muted/20">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-start gap-2 px-3 py-3 text-left text-sm hover:bg-muted/40"
          >
            {open ? (
              <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            ) : (
              <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <span className="min-w-0 flex-1">
              <span className="font-medium text-foreground">More project details</span>
              {!open ? (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {summaryParts.length > 0
                    ? `${summaryParts.join(" · ")}. Tap to expand.`
                    : "Property type, adjuster, and notes. Tap to expand."}
                </span>
              ) : null}
            </span>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="space-y-2.5 border-t border-border/60 px-3 pb-4 pt-3">
            {pd.propertyType?.trim() ? (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <dt className="shrink-0 text-muted-foreground sm:w-[11rem]">Property type</dt>
                <dd className="text-foreground">{pd.propertyType}</dd>
              </div>
            ) : null}
            {pd.adjusterName?.trim() ? (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <dt className="shrink-0 text-muted-foreground sm:w-[11rem]">Adjuster name</dt>
                <dd className="text-foreground">{pd.adjusterName}</dd>
              </div>
            ) : null}
            {pd.notes?.trim() ? (
              <div className="space-y-1">
                <dt className="text-muted-foreground">Notes</dt>
                <dd>
                  <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-foreground">{pd.notes}</p>
                </dd>
              </div>
            ) : null}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function RoomPreviewCard({ room }: { room: RoomRow }) {
  const [open, setOpen] = useState(false)
  const title = room.name?.trim() || "Untitled space"
  const subtitle = room.type ? room.type.replace(/-/g, " ") : ""
  const { id: _id, name: _name, type: _type, sqft: _sqft, ...roomDetails } = room
  const summary = roomImportantSummary(room)
  const hasDetails = !isEmptyValue(roomDetails)

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-border/60 bg-card/50">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full flex-col gap-1 px-3 py-3 text-left text-sm hover:bg-muted/40"
          >
            <span className="flex min-w-0 items-center gap-2">
              {open ? <ChevronDown className="h-4 w-4 shrink-0 opacity-70" /> : <ChevronRight className="h-4 w-4 shrink-0 opacity-70" />}
              <span className="font-medium text-foreground">{title}</span>
              {subtitle ? <span className="text-muted-foreground capitalize">({subtitle})</span> : null}
              {room.sqft?.trim() ? (
                <span className="text-xs text-muted-foreground tabular-nums">· {room.sqft} sq ft</span>
              ) : null}
            </span>
            {!open ? (
              <p className="pl-6 text-xs leading-snug text-muted-foreground">{summary}</p>
            ) : null}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border/60 px-3 pb-4 pt-1">
            {hasDetails ? (
              <PreviewFields data={roomDetails} depth={0} />
            ) : (
              <p className="py-2 text-sm text-muted-foreground">No extra details for this space.</p>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export function ExpressEstimatePreviewSummary({ values }: Props) {
  const pd = values.projectDetails
  const rooms = values.rooms ?? []
  const exterior = values.exterior
  const foundation = values.foundation

  const hasOtherProject =
    Boolean(pd.propertyType?.trim()) ||
    Boolean(pd.adjusterName?.trim()) ||
    Boolean(pd.notes?.trim())

  return (
    <div className="space-y-6">
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle>Project details</CardTitle>
          <CardDescription>Name, claim, and where the inspection took place</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <dl className="space-y-2.5">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 text-muted-foreground sm:w-[11rem]">Project name</dt>
              <dd className="font-medium text-foreground">{pd.projectName}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 text-muted-foreground sm:w-[11rem]">Claim number</dt>
              <dd className="font-medium text-foreground">{pd.claimNumber}</dd>
            </div>
            {pd.propertyAddress?.trim() ? (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <dt className="shrink-0 text-muted-foreground sm:w-[11rem]">Property address</dt>
                <dd className="text-foreground">{pd.propertyAddress}</dd>
              </div>
            ) : null}
            {pd.inspectionDate?.trim() ? (
              <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
                <dt className="shrink-0 text-muted-foreground sm:w-[11rem]">Inspection date</dt>
                <dd className="text-foreground">{pd.inspectionDate}</dd>
              </div>
            ) : null}
            <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 text-muted-foreground sm:w-[11rem]">Pre-FIRM</dt>
              <dd className="font-medium text-foreground">{pd.preFirm ? "Yes" : "No"}</dd>
            </div>
          </dl>

          {hasOtherProject ? <ProjectOtherDetailsCollapsible values={values} /> : null}
        </CardContent>
      </Card>

      <CollapsiblePreviewBlock
        title="Exterior"
        description="Pressure washing, dumpster, HVAC, electrical, and finishes"
        summary={summarizeTopLevelSections(exterior)}
        emptyHint="No exterior details were filled in."
        hasContent={Boolean(exterior && !isEmptyValue(exterior))}
      >
        <PreviewFields data={exterior} depth={0} />
      </CollapsiblePreviewBlock>

      <CollapsiblePreviewBlock
        title="Foundation"
        description="Crawlspace, basement, insulation, mechanical, and related items"
        summary={summarizeTopLevelSections(foundation)}
        emptyHint="No foundation details were filled in."
        hasContent={Boolean(foundation && !isEmptyValue(foundation))}
      >
        <PreviewFields data={foundation} depth={0} />
      </CollapsiblePreviewBlock>

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle>Rooms and spaces ({rooms.length})</CardTitle>
          <CardDescription>
            Each row shows the basics; open a room to see the full checklist (flooring, windows, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {rooms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rooms were added.</p>
          ) : (
            rooms.map((r: RoomRow) => <RoomPreviewCard key={r.id} room={r} />)
          )}
        </CardContent>
      </Card>
    </div>
  )
}
