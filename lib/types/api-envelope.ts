/**
 * Standard API success body: `{ message, data }`.
 * `data` matches `dict[str, Any]` → `Record<string, unknown>` when untyped.
 */
export type SuccessEnvelope<T> = {
  /** Server default is often `"OK"`. */
  message?: string
  data: T | null
}

/** `SuccessEnvelope[dict[str, Any]]` — arbitrary JSON object payload. */
export type SuccessEnvelopeLoose = SuccessEnvelope<Record<string, unknown>>

/** `SuccessEnvelope[dict[str, str]]` — string map payload. */
export type SuccessEnvelopeStringMap = SuccessEnvelope<Record<string, string>>

/** Common error JSON from API (shape varies — extend as needed). */
export type ApiErrorBody = Record<string, unknown> & {
  message?: string
  detail?: string
}
