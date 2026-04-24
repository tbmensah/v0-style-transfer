"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Suspense } from "react"

function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const raw = searchParams.get("message")
  const message = raw
    ? (() => {
        try {
          return decodeURIComponent(raw)
        } catch {
          return raw
        }
      })()
    : null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" aria-hidden />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Link invalid or expired</CardTitle>
            <CardDescription className="text-muted-foreground text-center">
              This sign-in or reset link could not be used. Request a new password reset if you are resetting your
              password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {message ? (
              <p className="text-center text-sm text-destructive" role="alert">
                {message}
              </p>
            ) : null}
            <Button asChild className="w-full">
              <Link href="/forgot-password">Try again</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-medium text-primary hover:underline">
                Back to log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-1 items-center justify-center text-muted-foreground">Loading…</div>
      }
    >
      <AuthCodeErrorContent />
    </Suspense>
  )
}
