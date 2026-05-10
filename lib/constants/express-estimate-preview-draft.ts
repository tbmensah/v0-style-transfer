/** sessionStorage key for validated wizard state between `/express-estimate/new` and `/express-estimate/new/preview`. */
export const EE_WIZARD_PREVIEW_DRAFT_KEY = "ee-wizard-preview-draft" as const
/** localStorage key for in-progress `/express-estimate/new` form state. */
export const EE_WIZARD_LOCAL_DRAFT_KEY = "ee-wizard-local-draft" as const

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

export function readExpressEstimateLocalDraft(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(EE_WIZARD_LOCAL_DRAFT_KEY)
  } catch {
    return null
  }
}

export function writeExpressEstimateLocalDraft(json: string): boolean {
  if (typeof window === "undefined") return false
  try {
    localStorage.setItem(EE_WIZARD_LOCAL_DRAFT_KEY, json)
    return true
  } catch {
    return false
  }
}

export function clearExpressEstimateLocalDraft(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(EE_WIZARD_LOCAL_DRAFT_KEY)
  } catch {
    // ignore
  }
}
