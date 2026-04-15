/** Presigned upload slot — from draft/upload-init or `GET /jobs/ff/{job_id}/upload-url`. */
export type FastFillUploadInitData = {
  job_id: string
  upload_url: string
  storage_path: string
}

/** `POST /jobs/ff/{job_id}/details` */
export type FastFillJobDetailsPayload = {
  ff_pdf_type: string
  pdf_file_key: string
  /** ESX object key in storage when upload exists; until then client sends filename only (see API). */
  esx_file_key: string
}
