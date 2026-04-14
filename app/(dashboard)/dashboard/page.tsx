"use client"

import Link from "next/link"
import { displayFirstName } from "@/lib/utilities/user-display"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ClipboardList, Coins, CheckCircle, Clock, AlertCircle, XCircle, Download, Eye } from "lucide-react"

const recentJobs = [
  { id: "2024-0892", name: "Johnson Residence", type: "FF", date: "Mar 10, 2024", status: "Completed" },
  { id: "2024-0891", name: "Williams Property", type: "EE", date: "Mar 10, 2024", status: "Processing" },
  { id: "2024-0890", name: "Thompson House", type: "FF", date: "Mar 9, 2024", status: "Failed" },
  { id: "2024-0889", name: "Garcia Residence", type: "EE", date: "Mar 9, 2024", status: "Completed" },
  { id: "2024-0888", name: "Anderson Property", type: "FF", date: "Mar 8, 2024", status: "Needs Review" },
]

const completedDownloads = [
  { id: "2024-0892", name: "Johnson Residence", date: "Mar 10, 2024" },
  { id: "2024-0889", name: "Garcia Residence", date: "Mar 9, 2024" },
  { id: "2024-0886", name: "Davis Home", date: "Mar 6, 2024" },
]

function getStatusBadge(status: string) {
  const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ElementType }> = {
    "Completed": { variant: "default", icon: CheckCircle },
    "Processing": { variant: "secondary", icon: Clock },
    "Failed": { variant: "destructive", icon: XCircle },
    "Needs Review": { variant: "outline", icon: AlertCircle },
  }
  const { variant, icon: Icon } = config[status] || { variant: "secondary" as const, icon: Clock }
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const firstName = displayFirstName(user)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">{"Here's an overview of your claims estimating activity"}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fast Fill Tokens</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Upload className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Express Estimate Tokens</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Jobs in progress</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Review</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <AlertCircle className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>Start a new project or manage your tokens</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/fast-fill/new">
            <Button className="gap-2 shadow-md shadow-primary/20">
              <Upload className="h-4 w-4" />
              New Fast Fill Project
            </Button>
          </Link>
          <Link href="/express-estimate/new">
            <Button className="gap-2 shadow-md shadow-primary/20">
              <ClipboardList className="h-4 w-4" />
              New Express Estimate
            </Button>
          </Link>
          <Link href="/tokens">
            <Button className="gap-2 shadow-md shadow-primary/20">
              <Coins className="h-4 w-4" />
              Buy Tokens
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Jobs & Downloads */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Jobs */}
        <Card className="border-border/60 bg-card/80 shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Jobs</CardTitle>
              <CardDescription>Your latest claim estimating jobs</CardDescription>
            </div>
            <Link href="/history">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Jobs</TabsTrigger>
                <TabsTrigger value="fast-fill">Fast Fill</TabsTrigger>
                <TabsTrigger value="express-estimate">Express Estimate</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-4">
                  {recentJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ring-1 ${
                          job.type === "FF" ? "bg-primary/20 text-primary ring-primary/20" : "bg-secondary text-foreground ring-border/60"
                        }`}>
                          {job.type}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Claim #{job.id} - {job.name}</p>
                          <p className="text-sm text-muted-foreground">{job.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(job.status)}
                        {job.status === "Completed" && (
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === "Needs Review" && (
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="fast-fill">
                <div className="space-y-4">
                  {recentJobs.filter(job => job.type === "FF").map((job) => (
                    <div key={job.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ring-1 bg-primary/20 text-primary ring-primary/20">
                          {job.type}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Claim #{job.id} - {job.name}</p>
                          <p className="text-sm text-muted-foreground">{job.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(job.status)}
                        {job.status === "Completed" && (
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === "Needs Review" && (
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="express-estimate">
                <div className="space-y-4">
                  {recentJobs.filter(job => job.type === "EE").map((job) => (
                    <div key={job.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/50 p-4 transition-colors hover:bg-secondary/70">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ring-1 bg-secondary text-foreground ring-border/60">
                          {job.type}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Claim #{job.id} - {job.name}</p>
                          <p className="text-sm text-muted-foreground">{job.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(job.status)}
                        {job.status === "Completed" && (
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === "Needs Review" && (
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Ready for Download */}
        <Card className="border-border/60 bg-card/80 shadow-md">
          <CardHeader>
            <CardTitle className="text-foreground">Ready for Download</CardTitle>
            <CardDescription>Completed outputs available for 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedDownloads.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">Claim #{item.id} - {item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/20">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Link href="/history?status=completed" className="mt-4 block">
              <Button variant="link" className="h-auto p-0 text-primary">
                View all completed
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Job Status Summary */}
      <Card className="border-border/60 bg-card/80 shadow-md">
        <CardHeader>
          <CardTitle className="text-foreground">Job Status Summary</CardTitle>
          <CardDescription>Overview of all your jobs by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Draft", count: 1, color: "bg-secondary/60" },
              { label: "Submitted", count: 1, color: "bg-blue-950/50" },
              { label: "Processing", count: 1, color: "bg-yellow-950/50" },
              { label: "Completed", count: 3, color: "bg-primary/20" },
              { label: "Failed", count: 1, color: "bg-red-950/50" },
              { label: "Needs Review", count: 1, color: "bg-orange-950/50" },
            ].map((status) => (
              <div key={status.label} className={`rounded-lg ${status.color} border border-border/40 p-4 text-center transition-colors hover:border-border/60`}>
                <div className="text-2xl font-bold text-foreground">{status.count}</div>
                <div className="text-sm text-muted-foreground">{status.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
