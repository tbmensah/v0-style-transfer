"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export default function AccountPage() {
  const [profileData, setProfileData] = useState({
    fullName: "Sarah Mitchell",
    email: "sarah.mitchell@insuranceco.com",
    company: "Mitchell Insurance Services",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile and account preferences</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Information */}
          <Card className="border-border bg-card">
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
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="border-input bg-background"
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
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">Company Name</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  className="border-input bg-background"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-foreground">
                  Current Password<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-foreground">
                  New Password<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="border-input bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm New Password<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="border-input bg-background"
                />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50 bg-card">
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Summary */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  SM
                </div>
                <div>
                  <p className="font-semibold text-foreground">{profileData.fullName}</p>
                  <p className="text-sm text-muted-foreground">{profileData.email}</p>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
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
                  <span className="text-foreground">Jan 15, 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Type */}
          <Card className="border-border bg-card">
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
