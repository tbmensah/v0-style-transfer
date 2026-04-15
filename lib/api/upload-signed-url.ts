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
