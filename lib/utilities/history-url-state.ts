import { JOB_STATUS_VALUES, type JobStatus, type JobType } from "@/lib/types/jobs"

const STATUS_SET = new Set<string>(JOB_STATUS_VALUES)

export type HistoryUrlState = {
  q: string
  page: number
  job_type: JobType | null
  status: JobStatus[]
  created_from: string | null
  created_to: string | null
}

export function parseHistoryUrl(searchParams: URLSearchParams): HistoryUrlState {
  const q = (searchParams.get("q") ?? "").trim().slice(0, 64)
  const pageRaw = searchParams.get("page")
  const page = Math.max(1, Math.floor(Number(pageRaw)) || 1)

  const jt = searchParams.get("job_type")
  const job_type: JobType | null = jt === "ee" || jt === "ff" ? jt : null

  const statusRaw = searchParams.get("status")
  const status: JobStatus[] = statusRaw
    ? statusRaw
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is JobStatus => STATUS_SET.has(s))
    : []

  const created_from = searchParams.get("created_from")?.trim() || null
  const created_to = searchParams.get("created_to")?.trim() || null

  return { q, page, job_type, status, created_from, created_to }
}

/** Build query string; omit defaults to keep URLs short. */
export function stringifyHistoryUrl(s: HistoryUrlState): string {
  const p = new URLSearchParams()
  if (s.q) p.set("q", s.q)
  if (s.page > 1) p.set("page", String(s.page))
  if (s.job_type) p.set("job_type", s.job_type)
  if (s.status.length) p.set("status", [...s.status].sort().join(","))
  if (s.created_from) p.set("created_from", s.created_from)
  if (s.created_to) p.set("created_to", s.created_to)
  return p.toString()
}
