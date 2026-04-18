import type { ExpressEstimateFormValues } from "@/lib/schemas/express-estimate-form"

/** Body for `POST /jobs/ee` — wizard JSON (camelCase). UI fields must be stripped before sending. */
export type ExpressEstimateJobPayload = ExpressEstimateFormValues

/** `data` from success envelope for EE job creation. */
export type ExpressEstimateJobCreateData = {
  job_id: string
  status: string
}
