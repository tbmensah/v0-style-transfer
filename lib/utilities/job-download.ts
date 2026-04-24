import type { ApiJob } from "@/lib/types/jobs"

const INVALID_FILENAME_CHARS = /[/\\?*:|"<>]/g

export function sanitizeDownloadFilename(name: string, maxLen = 180): string {
  const t = name.replace(INVALID_FILENAME_CHARS, "_").replace(/\s+/g, " ").trim()
  return t.slice(0, maxLen) || "download"
}

function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) return null
  const m = /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header)
  if (!m) return null
  let v = m[1].replace(/^"|"$/g, "")
  try {
    v = decodeURIComponent(v)
  } catch {
    // keep
  }
  return v.trim() || null
}

function filenameFromUrlPath(url: string): string | null {
  try {
    const p = new URL(url).pathname
    const seg = p.split("/").filter(Boolean).pop()
    if (seg) return decodeURIComponent(seg)
  } catch {
    return null
  }
  return null
}

function pickExtensionFrom(filename: string | null | undefined): string | null {
  if (!filename) return null
  const m = filename.match(/(\.[a-z0-9][a-z0-9+.-]*)$/i)
  return m ? m[1] : null
}

function triggerBrowserDownload(blob: Blob, filename: string) {
  const a = document.createElement("a")
  const objectUrl = URL.createObjectURL(blob)
  a.href = objectUrl
  a.download = filename
  a.rel = "noopener"
  a.click()
  URL.revokeObjectURL(objectUrl)
}

/**
 * Fetches a URL (e.g. signed GET) and saves a file locally instead of opening a new tab.
 * Suggested name order: `suggestedFilename` (e.g. `original_filename` from the API) when valid,
 * then `Content-Disposition`, then the last path segment of the URL.
 */
export async function downloadFileFromUrl(
  url: string,
  suggestedFilename?: string | null,
): Promise<void> {
  const u = url.trim()
  if (!u) return

  const res = await fetch(u, { mode: "cors" })
  if (!res.ok) {
    const t = await res.text().catch(() => "")
    throw new Error(
      t
        ? `Download failed (${res.status}): ${t.slice(0, 200)}`
        : `Download failed (${res.status})`,
    )
  }

  const blob = await res.blob()
  const fromHeader = parseContentDispositionFilename(res.headers.get("Content-Disposition"))
  const fromUrl = filenameFromUrlPath(u)
  const suggested = suggestedFilename?.trim()
    ? sanitizeDownloadFilename(suggestedFilename.trim())
    : null

  let name: string
  if (suggested) {
    name = suggested
    if (!/\.[a-z0-9][a-z0-9+.-]*$/i.test(name)) {
      const ext = pickExtensionFrom(fromHeader) ?? pickExtensionFrom(fromUrl)
      if (ext) name = `${name}${ext}`
    }
  } else if (fromHeader) {
    name = sanitizeDownloadFilename(fromHeader)
  } else if (fromUrl) {
    name = sanitizeDownloadFilename(fromUrl)
  } else {
    name = "download"
  }

  triggerBrowserDownload(blob, name)
}

/** `GET /jobs` row: `download_url` with `original_filename` as save name. */
export async function downloadFromApiJob(job: ApiJob): Promise<void> {
  const u = job.download_url?.trim()
  if (!u) return
  const suggested = job.original_filename?.trim() ?? null
  await downloadFileFromUrl(u, suggested)
}

/** EE readable markdown: prefer `original_filename` stem + `.md`. */
export function suggestedEeInputReadableFilename(originalFilename: string | null | undefined): string {
  if (!originalFilename?.trim()) return "payload.md"
  const base = sanitizeDownloadFilename(originalFilename.trim())
  if (base.toLowerCase().endsWith(".md")) return base
  const stem = base.replace(/\.[^.]+$/i, "")
  return `${stem || "estimate"}.md`
}

/** EE readable Excel export: stem from `original_filename` + `.xlsx`. */
export function suggestedEeInputExcelFilename(originalFilename: string | null | undefined): string {
  if (!originalFilename?.trim()) return "payload.xlsx"
  const base = sanitizeDownloadFilename(originalFilename.trim())
  if (base.toLowerCase().endsWith(".xlsx")) return base
  const stem = base.replace(/\.[^.]+$/i, "")
  return `${stem || "estimate"}.xlsx`
}

/** EE final artifact: prefer `original_filename`; add extension from URL/headers when missing. */
export function suggestedEeOutputFilename(
  originalFilename: string | null | undefined,
  responseUrl: string,
): string {
  const suggested = originalFilename?.trim()
    ? sanitizeDownloadFilename(originalFilename.trim())
    : null
  if (suggested && pickExtensionFrom(suggested)) {
    return suggested
  }
  if (suggested) {
    const fromUrl = filenameFromUrlPath(responseUrl)
    const ext = pickExtensionFrom(fromUrl)
    if (ext) return `${suggested}${ext}`
  }
  const fromUrl = filenameFromUrlPath(responseUrl)
  if (fromUrl) return sanitizeDownloadFilename(fromUrl)
  return "download"
}

