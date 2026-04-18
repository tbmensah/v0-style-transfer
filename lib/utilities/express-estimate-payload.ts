import type {
  ExpressEstimateFormValues,
  ExpressEstimatePageValues,
} from "@/lib/schemas/express-estimate-form"
import type { ExpressEstimateJobPayload } from "@/lib/types/express-estimate"

/**
 * Recursively drop empty strings, false booleans, empty arrays, and empty objects
 * so the wire JSON matches sparse API examples. Preserves `0` for numeric counts.
 */
function pruneDeep(value: unknown): unknown {
  if (value === undefined || value === null) return undefined
  if (typeof value === "string") {
    return value.trim() === "" ? undefined : value
  }
  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value
  }
  if (typeof value === "boolean") {
    return value === false ? undefined : true
  }
  if (Array.isArray(value)) {
    const pruned = value
      .map((item) => pruneDeep(item))
      .filter((item) => item !== undefined)
    return pruned.length === 0 ? undefined : pruned
  }
  if (typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const p = pruneDeep(v)
      if (p !== undefined) out[k] = p
    }
    return Object.keys(out).length === 0 ? undefined : out
  }
  return value
}

/**
 * Sparse payload for `POST /jobs/ee` — only keys with meaningful values remain.
 */
export function pruneExpressEstimatePayload(
  body: ExpressEstimateFormValues,
): ExpressEstimateJobPayload {
  const pruned = pruneDeep(body) as ExpressEstimateFormValues | undefined
  if (!pruned || typeof pruned !== "object") {
    return {
      projectDetails: {
        projectName: body.projectDetails.projectName,
        claimNumber: body.projectDetails.claimNumber,
      },
    } as ExpressEstimateJobPayload
  }
  const pd = pruned.projectDetails ?? body.projectDetails
  return {
    ...pruned,
    projectDetails: {
      ...pd,
      projectName: body.projectDetails.projectName.trim(),
      claimNumber: body.projectDetails.claimNumber.trim(),
    },
  } as ExpressEstimateJobPayload
}

/** Strip UI-only fields and prune for API. Caller should run after form validation. */
export function toExpressEstimateJobPayload(
  values: ExpressEstimatePageValues,
): ExpressEstimateJobPayload {
  const { activeTab: _a, isSaved: _s, ...wizard } = values
  void _a
  void _s
  return pruneExpressEstimatePayload(wizard as ExpressEstimateFormValues)
}
