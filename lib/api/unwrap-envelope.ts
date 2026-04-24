import type { SuccessEnvelope } from "@/lib/types/api-envelope"

/** Returns `data` or throws if `data` is `null`. */
export function unwrapSuccess<T>(
  envelope: SuccessEnvelope<T>,
  emptyLabel = "No data",
): T {
  if (envelope.data === null) {
    throw new Error(envelope.message?.trim() || emptyLabel)
  }
  return envelope.data
}

/** Returns `data`, which may be `null`. */
export function unwrapSuccessOrNull<T>(
  envelope: SuccessEnvelope<T>,
): T | null {
  return envelope.data
}
