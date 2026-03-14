import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ClipboardList, CheckCircle, Clock, Download, Eye } from "lucide-react"

const expressEstimateJobs = [
  { id: "2024-0891", name: "Williams Property", date: "Mar 10, 2024", status: "Processing", tokens: 1 },
  { id: "2024-0889", name: "Garcia Residence", date: "Mar 9, 2024", status: "Completed", tokens: 1 },
  { id: "2024-0886", name: "Davis Home", date: "Mar 6, 2024", status: "Completed", tokens: 1 },
]

function getStatusBadge(status: string) {
  const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ElementType }> = {
    "Completed": { variant: "default", icon: CheckCircle },
    "Processing": { variant: "secondary", icon: Clock },
  }
  const { variant, icon: Icon } = config[status] || { variant: "secondary" as const, icon: Clock }
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

export default function ExpressEstimatePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Express Estimate</h1>
          <p className="mt-1 text-muted-foreground">Create structured estimates from on-site inspection data</p>
        </div>
        <Link href="/express-estimate/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Express Estimate
          </Button>
        </Link>
      </div>

      {/* Token Balance */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available Tokens</CardTitle>
          <CardDescription>Each Express Estimate uses 1 token</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">12</span>
            <Badge variant="secondary" className="text-xs">EE tokens</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Express Estimate Jobs</CardTitle>
          <CardDescription>All your Express Estimate submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Job Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Tokens</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expressEstimateJobs.map((job) => (
                  <tr key={job.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20">
                          <ClipboardList className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">Claim #{job.id} - {job.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{job.date}</td>
                    <td className="py-4">{getStatusBadge(job.status)}</td>
                    <td className="py-4 text-sm text-muted-foreground">{job.tokens}</td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        {job.status === "Completed" && (
                          <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === "Processing" && (
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
