export type JobType = "ee" | "ff"

/** API lifecycle statuses (lowercase). */
export type JobStatus =
  | "draft"
  | "confirmed"
  | "queued"
  | "processing"
  | "completed"
  | "failed"
  | "refunded"

/** Single row from `GET /jobs`. */
export type ApiJob = {
  id: string
  job_type: JobType
  status: string
  original_filename: string | null
  created_at: string
  updated_at: string | null
  completed_at: string | null
  error_message: string | null
  ff_pdf_type: string | null
  token_cost: number
  /** Present when the API exposes a download link (may be omitted on some rows). */
  download_url?: string | null
}

export type JobsListData = {
  items: ApiJob[]
  total: number
  page: number
  page_size: number
}

export type JobsListParams = {
  job_type?: JobType | null
  /** Repeat `status` query param per value. */
  status?: JobStatus[] | null
  created_from?: string | null
  created_to?: string | null
  /** Filter rows with a non-empty output file key. */
  has_output?: boolean | null
  page?: number
  page_size?: number
}

/** `GET /jobs/search` — `q` required (1–64 chars). */
export type JobsSearchParams = {
  q: string
  job_type?: JobType | null
  status?: JobStatus[] | null
  created_from?: string | null
  created_to?: string | null
  page?: number
  page_size?: number
}

export const JOB_STATUS_VALUES: readonly JobStatus[] = [
  "draft",
  "confirmed",
  "queued",
  "processing",
  "completed",
  "failed",
  "refunded",
] as const
