import { postExpressEstimateOutputConfirm, postExpressEstimateOutputUploadUrl } from "@/lib/api/requests/express-estimate-job"
import { applySignedUploadToken, uploadFileToSignedUrl } from "@/lib/api/upload-signed-url"
import type { EeOutputUploadUrlData } from "@/lib/types/express-estimate-job"

const EE_OUTPUT_EXT = new Set(["md", "pdf", "txt", "docx", "xlsx"])

export function isAllowedEeOutputExtension(filename: string): boolean {
  const i = filename.lastIndexOf(".")
  if (i < 0) return false
  return EE_OUTPUT_EXT.has(filename.slice(i + 1).toLowerCase())
}

export async function putEeOutputToSignedUrl(
  file: File,
  uploadData: EeOutputUploadUrlData,
): Promise<void> {
  const url = applySignedUploadToken(uploadData.upload_url, uploadData.token)
  await uploadFileToSignedUrl(file, url)
}

/**
 * Presign → PUT to Supabase → confirm. If PUT fails, do not confirm; caller can request a new URL.
 */
export async function presignUploadAndConfirmEeOutput(jobId: string, file: File): Promise<void> {
  if (!isAllowedEeOutputExtension(file.name)) {
    throw new Error("File type must be one of: md, pdf, txt, docx, xlsx")
  }
  const upload = await postExpressEstimateOutputUploadUrl(jobId, { filename: file.name })
  try {
    await putEeOutputToSignedUrl(file, upload)
  } catch (e) {
    throw e
  }
  await postExpressEstimateOutputConfirm(jobId, { object_path: upload.object_path })
}
