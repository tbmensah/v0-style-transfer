/** Open presigned or API download URL in a new tab. */
export function openJobDownloadUrl(url: string) {
  const u = url.trim()
  if (!u) return
  window.open(u, "_blank", "noopener,noreferrer")
}
