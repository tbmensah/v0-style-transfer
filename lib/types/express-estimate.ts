import type { ExpressEstimateFormValues } from "@/lib/schemas/express-estimate-form"

/** Body for `POST /jobs/ee` — wizard JSON (camelCase). UI fields must be stripped before sending. */
export type ExpressEstimateJobPayload = ExpressEstimateFormValues

/** `data` from success envelope for EE job creation. */
export type ExpressEstimateJobCreateData = {
  job_id: string
  status: string
  /** When false, server markdown upload failed; use input-render retry or poll until has_input_render. */
  input_render_ready?: boolean
}
