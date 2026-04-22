/** `GET /jobs/ee/{id}` — EE job detail (EeJobDetail). */
export type ExpressEstimateJobDetail = {
  id: string
  status: string
  has_input_render: boolean
  output_ready: boolean
  completed_at: string | null
  /** When present (e.g. project name for display). */
  original_filename?: string | null
  error_message?: string | null
  created_at?: string
  updated_at?: string | null
}

/** `GET /jobs/ee/{id}/input-download` */
export type EeInputDownloadData = {
  url: string
}

/** `POST /jobs/ee/{id}/output/upload-url` */
export type EeOutputUploadUrlData = {
  upload_url: string
  object_path: string
  /** Supabase may require appending as a query param on the PUT URL. */
  token?: string | null
}

/** `GET /jobs/ee/{id}/output/download` */
export type EeOutputDownloadData = {
  url: string
}

export type EeOutputUploadUrlBody = {
  filename: string
}

export type EeOutputConfirmBody = {
  object_path: string
}
