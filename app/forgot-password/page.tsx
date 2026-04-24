"use client"

import Link from "next/link"
import { useState } from "react"
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
import {
  forgotPasswordDefaultValues,
  forgotPasswordResolver,
  type ForgotPasswordFormValues,
} from "@/lib/forms/forgot-password"
import { getAuthConfirmRedirectUrl, getAppOrigin } from "@/lib/auth/supabase-redirect"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { Zap, Mail, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const form = useForm<ForgotPasswordFormValues>({
    resolver: forgotPasswordResolver,
    defaultValues: forgotPasswordDefaultValues,
  })

  async function onSubmit(values: ForgotPasswordFormValues) {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      form.setError("root", {
        message: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      })
      return
    }

    const origin = getAppOrigin()
    if (!origin) {
      form.setError("root", {
        message: "Set NEXT_PUBLIC_APP_URL to your site base (e.g. http://localhost:3000) for password reset links, or open this app from a browser.",
      })
      return
    }

    const redirectTo = getAuthConfirmRedirectUrl()
    if (!redirectTo) {
      form.setError("root", {
        message: "Could not build reset link. Set NEXT_PUBLIC_APP_URL.",
      })
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo,
    })

    if (error) {
      form.setError("root", { message: error.message })
      return
    }

    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        {submitted ? (
          <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Check your email</CardTitle>
              <CardDescription className="text-muted-foreground">
                If that address is registered, we sent a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild variant="secondary" className="w-full">
                <Link href="/login">Back to log in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <Link href="/" className="mx-auto mb-4 flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-2xl font-semibold tracking-tight text-foreground">AdjustAid</span>
              </Link>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Forgot password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email. We will send a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {form.formState.errors.root ? (
                    <p className="text-destructive text-sm" role="alert">
                      {form.formState.errors.root.message}
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
                  <Button
                    type="submit"
                    className="w-full shadow-md shadow-primary/20"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Sending…" : "Send reset link"}
                  </Button>
                </form>
              </Form>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Back to log in
                </Link>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
