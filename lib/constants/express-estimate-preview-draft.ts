/** sessionStorage key for validated wizard state between `/express-estimate/new` and `/express-estimate/new/preview`. */
export const EE_WIZARD_PREVIEW_DRAFT_KEY = "ee-wizard-preview-draft" as const

export function readExpressEstimatePreviewDraft(): string | null {
  if (typeof window === "undefined") return null
  try {
    return sessionStorage.getItem(EE_WIZARD_PREVIEW_DRAFT_KEY)
  } catch {
    return null
  }
}

export function writeExpressEstimatePreviewDraft(json: string): void {
  sessionStorage.setItem(EE_WIZARD_PREVIEW_DRAFT_KEY, json)
}

export function clearExpressEstimatePreviewDraft(): void {
  try {
    sessionStorage.removeItem(EE_WIZARD_PREVIEW_DRAFT_KEY)
  } catch {
    // ignore
  }
}
