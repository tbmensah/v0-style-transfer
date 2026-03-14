import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, CheckCircle, Clock, AlertCircle, XCircle, Download, Eye, Edit, Trash2 } from "lucide-react"

const fastFillJobs = [
  { id: "2024-0892", name: "Johnson Residence", date: "Mar 10, 2024", status: "Completed", tokens: 1 },
  { id: "2024-0890", name: "Thompson House", date: "Mar 9, 2024", status: "Failed", tokens: 1 },
  { id: "2024-0888", name: "Anderson Property", date: "Mar 8, 2024", status: "Needs Review", tokens: 1 },
  { id: "2024-0887", name: "Miller Dwelling", date: "Mar 7, 2024", status: "Draft", tokens: 0 },
  { id: "2024-0885", name: "Wilson Property", date: "Mar 5, 2024", status: "Submitted", tokens: 1 },
]

function getStatusBadge(status: string) {
  const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ElementType }> = {
    "Completed": { variant: "default", icon: CheckCircle },
    "Processing": { variant: "secondary", icon: Clock },
    "Submitted": { variant: "secondary", icon: Clock },
    "Failed": { variant: "destructive", icon: XCircle },
    "Needs Review": { variant: "outline", icon: AlertCircle },
    "Draft": { variant: "outline", icon: Edit },
  }
  const { variant, icon: Icon } = config[status] || { variant: "secondary" as const, icon: Clock }
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

export default function FastFillPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Fast Fill</h1>
          <p className="mt-1 text-muted-foreground">Upload PDF + ESX pairs and receive prelim-ready ESX outputs</p>
        </div>
        <Link href="/fast-fill/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Fast Fill Project
          </Button>
        </Link>
      </div>

      {/* Token Balance */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Available Tokens</CardTitle>
          <CardDescription>Each Fast Fill job uses 1 token</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-foreground">24</span>
            <Badge variant="secondary" className="text-xs">FF tokens</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Fast Fill Jobs</CardTitle>
          <CardDescription>All your Fast Fill submissions</CardDescription>
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
                {fastFillJobs.map((job) => (
                  <tr key={job.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Upload className="h-4 w-4 text-primary" />
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
                        {job.status === "Needs Review" && (
                          <Button variant="ghost" size="icon" title="Review">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === "Draft" && (
                          <>
                            <Button variant="ghost" size="icon" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Delete" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {job.status === "Failed" && (
                          <Button variant="ghost" size="sm">
                            Retry
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
