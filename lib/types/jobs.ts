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
  created_from?: string | null
  created_to?: string | null
  page?: number
  page_size?: number
}
