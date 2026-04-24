"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
  resetPasswordDefaultValues,
  resetPasswordResolver,
  type ResetPasswordFormValues,
} from "@/lib/forms/reset-password"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { KeyRound, Zap } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const form = useForm<ResetPasswordFormValues>({
    resolver: resetPasswordResolver,
    defaultValues: resetPasswordDefaultValues,
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      form.setError("root", {
        message: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      })
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      form.setError("root", {
        message: "No active session. Use the link from your email, or request a new reset on the forgot-password page.",
      })
      return
    }

    const { error } = await supabase.auth.updateUser({ password: values.newPassword })
    if (error) {
      form.setError("root", { message: error.message })
      return
    }

    toast.success("Password updated. You can sign in with your new password.", {
      id: "reset-pw",
    })
    form.reset()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <Link href="/" className="mx-auto mb-4 flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold tracking-tight text-foreground">AdjustAid</span>
            </Link>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <KeyRound className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Set new password</CardTitle>
            <CardDescription className="text-muted-foreground">Choose a strong password for your account.</CardDescription>
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
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">New password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Confirm new password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoComplete="new-password"
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
                  {form.formState.isSubmitting ? "Saving…" : "Update password"}
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
      </div>
    </div>
  )
}
