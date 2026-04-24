"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { formatMemberSince, userInitials } from "@/lib/utilities/user-display"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { AlertTriangle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import {
  changePasswordDefaultValues,
  changePasswordResolver,
  type ChangePasswordFormValues,
} from "@/lib/forms/change-password"

export default function AccountPage() {
  const user = useAuthStore((s) => s.user)

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    company: "",
  })

  const form = useForm<ChangePasswordFormValues>({
    resolver: changePasswordResolver,
    defaultValues: changePasswordDefaultValues,
  })

  useEffect(() => {
    if (!user) return
    setProfileData({
      fullName: user.fullName ?? "",
      email: user.email,
      company: user.company ?? "",
    })
  }, [user])

  async function onChangePasswordSubmit(values: ChangePasswordFormValues) {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      form.setError("root", {
        message: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      })
      return
    }
    if (!user?.email) {
      form.setError("root", { message: "Not signed in." })
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: values.currentPassword,
    })
    if (signInError) {
      form.setError("root", { message: "Current password is incorrect." })
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.newPassword,
    })
    if (updateError) {
      form.setError("root", { message: updateError.message })
      return
    }

    toast.success("Password updated.", { id: "account-pw" })
    form.reset(changePasswordDefaultValues)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile and account preferences</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">
                  Full Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData((p) => ({ ...p, fullName: e.target.value }))
                  }
                  className="border-border/60 bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData((p) => ({ ...p, email: e.target.value }))}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">Company Name</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData((p) => ({ ...p, company: e.target.value }))}
                  className="border-border/60 bg-secondary/50"
                />
              </div>
              <Button className="shadow-md shadow-primary/20">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onChangePasswordSubmit)}
                  className="space-y-4"
                >
                  {form.formState.errors.root ? (
                    <p className="text-destructive text-sm" role="alert">
                      {form.formState.errors.root.message}
                    </p>
                  ) : null}
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Current password</FormLabel>
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
                    className="shadow-md shadow-primary/20"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Updating…" : "Update Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-destructive/40 bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary ring-2 ring-primary/20">
                  {userInitials(user)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{profileData.fullName}</p>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                </div>
              </div>
              <div className="space-y-2 border-t border-border/60 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">{profileData.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Company:</span>
                  <span className="text-foreground">{profileData.company}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="text-foreground">{formatMemberSince(user?.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/80 shadow-md">
            <CardHeader>
              <CardTitle className="text-foreground">Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Individual Account</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Single-user access for independent adjusters and estimators
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
