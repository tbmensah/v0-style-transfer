"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  expressEstimatePageSchema,
  type ExpressEstimatePageValues,
} from "@/lib/schemas/express-estimate-form"
import {
  clearExpressEstimatePreviewDraft,
  readExpressEstimatePreviewDraft,
} from "@/lib/constants/express-estimate-preview-draft"
import { createExpressEstimateJob } from "@/lib/api/requests/express-estimate"
import { getApiErrorMessage } from "@/lib/api/parse-api-error"
import { hasApiBase } from "@/lib/environment/public-env"
import { toExpressEstimateJobPayload } from "@/lib/utilities/express-estimate-payload"
import { queryKeys } from "@/lib/api/query-keys"
import { ExpressEstimatePreviewSummary } from "@/components/express-estimate/express-estimate-preview-summary"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, Pencil } from "lucide-react"

export default function ExpressEstimatePreviewPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [values, setValues] = useState<ExpressEstimatePageValues | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const raw = readExpressEstimatePreviewDraft()
    if (!raw) {
      router.replace("/express-estimate/new")
      return
    }
    try {
      const parsed = expressEstimatePageSchema.safeParse(JSON.parse(raw))
      if (!parsed.success) {
        setLoadError("Saved draft is invalid or out of date. Return to the wizard to continue.")
        return
      }
      setValues(parsed.data)
    } catch {
      router.replace("/express-estimate/new")
    }
  }, [router])

  const createJob = useMutation({
    mutationFn: createExpressEstimateJob,
  })

  function onSubmit() {
    if (values == null) return
    if (!hasApiBase) {
      toast.error("Set NEXT_PUBLIC_API_BASE_URL in .env.local to submit to the API.", { id: "ee-submit" })
      return
    }
    const payload = toExpressEstimateJobPayload(values)
    createJob.mutate(payload, {
      onSuccess: () => {
        clearExpressEstimatePreviewDraft()
        toast.success("Express Estimate created.", { id: "ee-submit" })
        void queryClient.invalidateQueries({ queryKey: ["api", "jobs"] })
        void queryClient.invalidateQueries({ queryKey: ["api", "ops"] })
        void queryClient.invalidateQueries({ queryKey: queryKeys.metrics })
        void queryClient.invalidateQueries({ queryKey: queryKeys.tokensLifetime })
        router.push("/express-estimate")
      },
      onError: (e) => {
        toast.error(getApiErrorMessage(e), { id: "ee-submit" })
      },
    })
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <p className="text-sm text-destructive">{loadError}</p>
        <Button asChild variant="outline">
          <Link href="/express-estimate/new">Back to wizard</Link>
        </Button>
      </div>
    )
  }

  if (values == null) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading preview…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Button variant="ghost" className="mb-4 h-8 gap-1 px-0 text-muted-foreground" asChild>
          <Link href="/express-estimate/new">
            <ArrowLeft className="h-4 w-4" />
            Back to edit
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Review Express Estimate</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm project details and scope before submitting. You can return to the wizard without losing data.
        </p>
      </div>

      <ExpressEstimatePreviewSummary values={values} />

      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle>Submit</CardTitle>
          <CardDescription>Creates the job and uses one Express Estimate token when applicable.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            type="button"
            className="gap-2 shadow-md shadow-primary/20"
            disabled={createJob.isPending}
            onClick={() => void onSubmit()}
          >
            {createJob.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit & generate ESX"
            )}
          </Button>
          <Button type="button" variant="outline" className="gap-2" asChild disabled={createJob.isPending}>
            <Link href="/express-estimate/new">
              <Pencil className="h-4 w-4" />
              Edit wizard
            </Link>
          </Button>
          <Button type="button" variant="ghost" asChild disabled={createJob.isPending}>
            <Link href="/express-estimate">Cancel</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
