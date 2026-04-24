"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { safeAppPath } from "@/lib/utilities/safe-redirect"
import {
  loginDefaultValues,
  loginResolver,
  type LoginFormValues,
} from "@/lib/forms/login"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Zap, Mail, CheckCircle2 } from "lucide-react"

function LoginPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const signedUpParam = searchParams.get("signedUp") === "1"
  const confirmEmail = searchParams.get("confirm") === "email"
  // If both are present, show the account-created dialog first, then the email-confirm one after the URL is updated
  const [signedUpOpen, setSignedUpOpen] = useState(signedUpParam)
  const [emailConfirmOpen, setEmailConfirmOpen] = useState(confirmEmail && !signedUpParam)

  useEffect(() => {
    setSignedUpOpen(signedUpParam)
  }, [signedUpParam])

  useEffect(() => {
    setEmailConfirmOpen(confirmEmail && !signedUpParam)
  }, [confirmEmail, signedUpParam])

  const onEmailDialogOpenChange = useCallback(
    (open: boolean) => {
      setEmailConfirmOpen(open)
      if (!open) {
        const p = new URLSearchParams(searchParams.toString())
        p.delete("confirm")
        const q = p.toString()
        router.replace(q ? `${pathname}?${q}` : pathname)
      }
    },
    [pathname, router, searchParams],
  )

  const onSignedUpDialogOpenChange = useCallback(
    (open: boolean) => {
      setSignedUpOpen(open)
      if (!open) {
        const p = new URLSearchParams(searchParams.toString())
        p.delete("signedUp")
        const q = p.toString()
        router.replace(q ? `${pathname}?${q}` : pathname)
      }
    },
    [pathname, router, searchParams],
  )
  const form = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: loginDefaultValues,
  })

  async function onSubmit(values: LoginFormValues) {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      form.setError("root", {
        message: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      })
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      form.setError("root", { message: error.message })
      return
    }

    const destination = safeAppPath(searchParams.get("next"))
    router.push(destination)
    router.refresh()
  }

  const rootError = form.formState.errors.root
  const showRootErrorInForm = Boolean(rootError) && !emailConfirmOpen

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <Dialog open={signedUpOpen} onOpenChange={onSignedUpDialogOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <DialogTitle className="text-center">Account created</DialogTitle>
              <DialogDescription className="text-center text-base">
                Sign in with your email and password.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" className="w-full" onClick={() => onSignedUpDialogOpenChange(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={emailConfirmOpen} onOpenChange={onEmailDialogOpenChange} modal={false}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <DialogTitle className="text-center">Confirm your email</DialogTitle>
              <DialogDescription className="text-center text-base">
                Check your email for a confirmation link, then sign in below.
              </DialogDescription>
            </DialogHeader>
            {rootError ? (
              <p className="text-destructive text-sm text-center" role="alert">
                {rootError.message}
              </p>
            ) : null}
            <DialogFooter>
              <Button type="button" className="w-full" onClick={() => onEmailDialogOpenChange(false)}>
                Got it
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mx-auto mb-4 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold tracking-tight text-foreground">AdjustAid</span>
            </Link>
            <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {showRootErrorInForm ? (
                  <p className="text-destructive text-sm" role="alert">
                    {rootError?.message}
                  </p>
                ) : null}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="name@email.com"
                          autoComplete="email"
                          className="border-border/60 bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-foreground">Password</FormLabel>
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="current-password"
                          className="border-border/60 bg-secondary/50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full shadow-md shadow-primary/20"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing in…" : "Log in"}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LoginPageFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-sm">
          <CardContent className="pt-8 pb-8">
            <p className="text-center text-muted-foreground text-sm">Loading…</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
