const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * Run `task` for each item in parallel (`Promise.allSettled`). Retry only items that
 * rejected, up to `maxAttempts` rounds (first round + retries).
 */
export async function parallelWithRetry<T>(
  items: readonly T[],
  task: (item: T) => Promise<void>,
  options?: { maxAttempts?: number; delayMs?: number },
): Promise<void> {
  const maxAttempts = options?.maxAttempts ?? 3
  const delayMs = options?.delayMs ?? 400
  let pending = [...items]
  let attempt = 0

  while (pending.length > 0 && attempt < maxAttempts) {
    attempt++
    const results = await Promise.allSettled(pending.map((item) => task(item)))
    const failed: T[] = []
    results.forEach((r, i) => {
      if (r.status === "rejected") failed.push(pending[i]!)
    })
    pending = failed
    if (pending.length === 0) return
    if (attempt < maxAttempts) await sleep(delayMs)
  }

  throw new Error(
    `${pending.length} job(s) still failed after ${maxAttempts} attempt(s).`,
  )
}
