/**
 * Some Supabase signed upload responses include a separate `token` to append as a query
 * parameter on the PUT URL (see Supabase Storage signed upload docs).
 */
export function applySignedUploadToken(uploadUrl: string, token?: string | null): string {
  if (!token?.trim()) return uploadUrl
  const u = new URL(uploadUrl)
  u.searchParams.set("token", token.trim())
  return u.toString()
}

/**
 * Upload file to Supabase (or S3-compatible) presigned URL.
 * Do not use `apiClient` — different origin, no Bearer to your API.
 */
export async function uploadFileToSignedUrl(
  file: File,
  uploadUrl: string,
  options?: { method?: "PUT" | "POST" },
): Promise<void> {
  const method = options?.method ?? "PUT"
  const contentType = file.type || "application/octet-stream"

  const res = await fetch(uploadUrl, {
    method,
    body: file,
    headers: {
      "Content-Type": contentType,
    },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `Upload failed (${res.status})${text ? `: ${text.slice(0, 200)}` : ""}`,
    )
  }
}
