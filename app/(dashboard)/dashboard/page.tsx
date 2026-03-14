import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Sarah</h1>
        <p className="mt-1 text-muted-foreground">{"Here's an overview of your claims estimating activity"}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fast Fill Tokens</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Express Estimate Tokens</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12</div>
            <p className="text-xs text-muted-foreground">Available for use</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Processing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Jobs in progress</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Needs Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription>Start a new project or manage your tokens</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link href="/fast-fill/new">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              New Fast Fill Project
            </Button>
          </Link>
          <Link href="/express-estimate/new">
            <Button variant="outline" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              New Express Estimate
            </Button>
          </Link>
          <Link href="/tokens">
            <Button variant="outline" className="gap-2">
              <Coins className="h-4 w-4" />
              Buy Tokens
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Jobs & Downloads */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Jobs */}
        <Card className="border-border bg-card lg:col-span-2">
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
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold ${
                      job.type === "FF" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"
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
          </CardContent>
        </Card>

        {/* Ready for Download */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Ready for Download</CardTitle>
            <CardDescription>Completed outputs available for 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedDownloads.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Claim #{item.id} - {item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Button variant="ghost" size="icon">
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
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Job Status Summary</CardTitle>
          <CardDescription>Overview of all your jobs by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Draft", count: 1, color: "bg-muted" },
              { label: "Submitted", count: 1, color: "bg-blue-100 dark:bg-blue-900/30" },
              { label: "Processing", count: 1, color: "bg-yellow-100 dark:bg-yellow-900/30" },
              { label: "Completed", count: 3, color: "bg-green-100 dark:bg-green-900/30" },
              { label: "Failed", count: 1, color: "bg-red-100 dark:bg-red-900/30" },
              { label: "Needs Review", count: 1, color: "bg-orange-100 dark:bg-orange-900/30" },
            ].map((status) => (
              <div key={status.label} className={`rounded-lg ${status.color} p-4 text-center`}>
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
