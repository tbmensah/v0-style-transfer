"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useRef } from "react"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import {
  useEeOutputUploadAndConfirm,
  useExpressEstimateInputDownload,
  useExpressEstimateJobDetail,
  useExpressEstimateOutputDownload,
  usePostExpressEstimateComplete,
  usePostExpressEstimateInputRender,
  usePostExpressEstimateReopen,
} from "@/lib/api/hooks/use-express-estimate-job"
import { hasApiBase } from "@/lib/environment/public-env"
import {
  downloadFileFromUrl,
  suggestedEeInputReadableFilename,
  suggestedEeOutputFilename,
} from "@/lib/utilities/job-download"
import { isAllowedEeOutputExtension } from "@/lib/api/express-estimate-output-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { JobStatusBadge } from "@/components/jobs/job-status-badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, ArrowLeft, FileDown, Upload, CheckCircle, RotateCcw, RefreshCw, ClipboardList } from "lucide-react"

const ACCEPT_EE_OUTPUT = ".md,.pdf,.txt,.docx,.xlsx"

export default function BackOfficeExpressEstimateJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = typeof params.jobId === "string" ? params.jobId : params.jobId?.[0] ?? ""
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, isError, error, refetch } = useExpressEstimateJobDetail(jobId, {
    enabled: jobId.length > 0,
    pollInputRender: true,
  })

  const inputRender = usePostExpressEstimateInputRender(jobId)
  const outputUpload = useEeOutputUploadAndConfirm(jobId)
  const complete = usePostExpressEstimateComplete(jobId)
  const reopen = usePostExpressEstimateReopen(jobId)
  const dlInput = useExpressEstimateInputDownload()
  const dlOutput = useExpressEstimateOutputDownload()

  async function onDownloadReadable() {
    if (data == null) return
    try {
      const { url } = await dlInput.mutateAsync(jobId)
      const name = suggestedEeInputReadableFilename(data.original_filename)
      await downloadFileFromUrl(url, name)
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  async function onDownloadFinal() {
    if (data == null) return
    try {
      const { url } = await dlOutput.mutateAsync(jobId)
      const name = suggestedEeOutputFilename(data.original_filename, url)
      await downloadFileFromUrl(url, name)
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  function onPickFile() {
    fileInputRef.current?.click()
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    if (!isAllowedEeOutputExtension(file.name)) {
      toast.error("Allowed types: md, pdf, txt, docx, xlsx")
      return
    }
    try {
      await outputUpload.mutateAsync(file)
      toast.success("Output uploaded and confirmed.")
    } catch (err) {
      toast.error(getApiErrorMessage(err))
    }
  }

  async function onComplete() {
    try {
      await complete.mutateAsync()
      toast.success("Job marked complete.")
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  async function onReopen() {
    try {
      await reopen.mutateAsync()
      toast.success("Job reopened.")
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  async function onRetryRender() {
    try {
      await inputRender.mutateAsync()
      toast.success("Input render retried.")
    } catch (e) {
      toast.error(getApiErrorMessage(e))
    }
  }

  if (!hasApiBase) {
    return (
      <p className="text-sm text-muted-foreground">
        Set <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_API_BASE_URL</code> to load
        this job.
      </p>
    )
  }

  if (!jobId) {
    return <p className="text-destructive">Invalid job id.</p>
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading job…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <p className="text-destructive">{getApiErrorMessage(error)}</p>
        <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
          Retry
        </Button>
        <div>
          <Button type="button" variant="link" asChild>
            <Link href="/express-estimate">Back to list</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (data == null) return null

  const isCompleted = data.status.trim().toLowerCase() === "completed"
  const completedAt = data.completed_at

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Button
          type="button"
          variant="ghost"
          className="mb-4 h-8 gap-1 px-0 text-muted-foreground"
          onClick={() => router.push("/express-estimate")}
        >
          <ArrowLeft className="h-4 w-4" />
          Express Estimate jobs
        </Button>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/20">
              <ClipboardList className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Express Estimate — back office</h1>
              <p className="text-xs text-muted-foreground">Job {jobId}</p>
            </div>
          </div>
          <JobStatusBadge status={data.status} />
        </div>
        {completedAt && (
          <p className="mt-1 text-sm text-muted-foreground">
            Completed: {new Date(completedAt).toLocaleString()}
          </p>
        )}
      </div>

      {!data.has_input_render && (
        <Alert>
          <RefreshCw className="h-4 w-4" />
          <AlertTitle>Readable copy pending</AlertTitle>
          <AlertDescription className="mt-2 flex flex-wrap items-center gap-2">
            <span>The markdown copy for operations is not ready yet.</span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="gap-1"
              disabled={inputRender.isPending}
              onClick={() => void onRetryRender()}
            >
              {inputRender.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Retry upload
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Readable input (for operator)</CardTitle>
          <CardDescription>
            Server-rendered markdown from the wizard. Not the same as the final deliverable file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={!data.has_input_render || dlInput.isPending}
            onClick={() => void onDownloadReadable()}
          >
            {dlInput.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
            Download readable
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Final output</CardTitle>
          <CardDescription>Upload the file produced offline (md, pdf, txt, docx, xlsx).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_EE_OUTPUT}
            className="hidden"
            onChange={onFileChange}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="gap-2"
              disabled={isCompleted || outputUpload.isPending}
              onClick={onPickFile}
            >
              {outputUpload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload file
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="gap-2"
              disabled={!data.output_ready || dlOutput.isPending}
              onClick={() => void onDownloadFinal()}
            >
              {dlOutput.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              Download final output
            </Button>
          </div>
          {data.output_ready && (
            <p className="text-sm text-muted-foreground">Output is registered. You can download it before marking complete.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Complete</CardTitle>
          <CardDescription>
            Mark the job done when the deliverable is finished. This consumes a token when applicable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="gap-2"
              disabled={!data.output_ready || isCompleted || complete.isPending}
              onClick={() => void onComplete()}
            >
              {complete.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Mark complete
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={!isCompleted || reopen.isPending}
              onClick={() => void onReopen()}
            >
              {reopen.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
              Reopen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
