import type { ApiJob } from "@/lib/types/jobs"

export function jobMatchesStatus(job: ApiJob, ...keys: string[]) {
  return keys.includes(job.status.trim().toLowerCase())
}

export function jobIsCompleted(job: ApiJob) {
  return jobMatchesStatus(job, "completed")
}

/** Download control: enabled only when status is completed and a URL exists. */
export function jobDownloadInteractionDisabled(job: ApiJob) {
  if (!jobIsCompleted(job)) return true
  return !job.download_url?.trim()
}
