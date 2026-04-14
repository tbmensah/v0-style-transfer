"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getSupabaseRedirectUrl } from "@/lib/auth/supabase-redirect"
import {
  signupDefaultValues,
  signupResolver,
  type SignupFormValues,
} from "@/lib/forms/signup"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { Zap } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()

  const form = useForm<SignupFormValues>({
    resolver: signupResolver,
    defaultValues: signupDefaultValues,
  })

  async function onSubmit(values: SignupFormValues) {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      form.setError("root", {
        message: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      })
      return
    }

    const metadata: Record<string, string> = {
      full_name: values.fullName,
    }
    const company = values.company.trim()
    if (company) {
      metadata.company = company
    }

    const emailRedirectTo = getSupabaseRedirectUrl()

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: metadata,
        ...(emailRedirectTo ? { emailRedirectTo } : {}),
      },
    })

    if (error) {
      form.setError("root", { message: error.message })
      return
    }

    form.clearErrors()
    form.reset(signupDefaultValues)

    if (data.session) {
      router.push("/login?signedUp=1")
    } else {
      router.push("/login?confirm=email")
    }
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Subtle gradient background */}
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
            <CardTitle className="text-2xl font-bold text-foreground">Create an account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Get started with 1 free token of each type
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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          autoComplete="name"
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
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Company <span className="text-muted-foreground">(Optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Your company name"
                          autoComplete="organization"
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
                      <FormLabel className="text-foreground">Password</FormLabel>
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
                      <FormLabel className="text-foreground">Confirm Password</FormLabel>
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
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(c) => field.onChange(c === true)}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal leading-relaxed text-muted-foreground">
                          By signing up, you agree to our{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full shadow-md shadow-primary/20"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
