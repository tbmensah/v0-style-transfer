import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Upload, ClipboardList, CheckCircle, Clock, AlertCircle, XCircle, Download, Eye, Search, Filter } from "lucide-react"

const allJobs = [
  { id: "2024-0892", name: "Johnson Residence", type: "FF", date: "Mar 10, 2024", status: "Completed" },
  { id: "2024-0891", name: "Williams Property", type: "EE", date: "Mar 10, 2024", status: "Processing" },
  { id: "2024-0890", name: "Thompson House", type: "FF", date: "Mar 9, 2024", status: "Failed" },
  { id: "2024-0889", name: "Garcia Residence", type: "EE", date: "Mar 9, 2024", status: "Completed" },
  { id: "2024-0888", name: "Anderson Property", type: "FF", date: "Mar 8, 2024", status: "Needs Review" },
  { id: "2024-0887", name: "Miller Dwelling", type: "FF", date: "Mar 7, 2024", status: "Draft" },
  { id: "2024-0886", name: "Davis Home", type: "EE", date: "Mar 6, 2024", status: "Completed" },
  { id: "2024-0885", name: "Wilson Property", type: "FF", date: "Mar 5, 2024", status: "Completed" },
  { id: "2024-0884", name: "Brown Residence", type: "EE", date: "Mar 4, 2024", status: "Completed" },
  { id: "2024-0883", name: "Taylor House", type: "FF", date: "Mar 3, 2024", status: "Completed" },
]

function getStatusBadge(status: string) {
  const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ElementType }> = {
    "Completed": { variant: "default", icon: CheckCircle },
    "Processing": { variant: "secondary", icon: Clock },
    "Failed": { variant: "destructive", icon: XCircle },
    "Needs Review": { variant: "outline", icon: AlertCircle },
    "Draft": { variant: "outline", icon: Clock },
  }
  const { variant, icon: Icon } = config[status] || { variant: "secondary" as const, icon: Clock }
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Job History</h1>
        <p className="mt-1 text-muted-foreground">View and manage all your claim estimating jobs</p>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search jobs..." className="border-input bg-background pl-9" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">All Jobs</CardTitle>
          <CardDescription>Complete history of your Fast Fill and Express Estimate jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Job Name</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allJobs.map((job) => (
                  <tr key={job.id} className="group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          job.type === "FF" ? "bg-primary/10" : "bg-accent/20"
                        }`}>
                          {job.type === "FF" ? (
                            <Upload className="h-4 w-4 text-primary" />
                          ) : (
                            <ClipboardList className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <span className="font-medium text-foreground">Claim #{job.id} - {job.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline" className="text-xs">
                        {job.type === "FF" ? "Fast Fill" : "Express Estimate"}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{job.date}</td>
                    <td className="py-4">{getStatusBadge(job.status)}</td>
                    <td className="py-4">
                      <div className="flex items-center justify-end gap-2">
                        {job.status === "Completed" && (
                          <Button variant="ghost" size="icon" title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        {(job.status === "Needs Review" || job.status === "Processing") && (
                          <Button variant="ghost" size="icon" title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === "Failed" && (
                          <Button variant="ghost" size="sm">Retry</Button>
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
