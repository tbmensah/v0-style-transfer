import type { ApiJob } from "@/lib/types/jobs"

export function jobDisplayTitle(job: ApiJob): string {
  const name = job.original_filename?.trim()
  if (name) return name
  return `Job ${job.id.slice(0, 8)}…`
}
