import type { ElementType } from "react"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  ListOrdered,
  RotateCcw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STATUS_CONFIG: Record<
  string,
  { variant: "default" | "secondary" | "destructive" | "outline"; icon: ElementType }
> = {
  draft: { variant: "outline", icon: Clock },
  completed: { variant: "default", icon: CheckCircle },
  confirmed: { variant: "secondary", icon: CheckCircle },
  queued: { variant: "secondary", icon: ListOrdered },
  processing: { variant: "secondary", icon: Loader2 },
  running: { variant: "secondary", icon: Loader2 },
  pending: { variant: "secondary", icon: Clock },
  submitted: { variant: "secondary", icon: Clock },
  failed: { variant: "destructive", icon: XCircle },
  error: { variant: "destructive", icon: XCircle },
  needs_review: { variant: "outline", icon: AlertCircle },
  refunded: { variant: "outline", icon: RotateCcw },
  cancelled: { variant: "outline", icon: XCircle },
}

function formatStatusLabel(status: string): string {
  const s = status.trim()
  if (!s) return "Unknown"
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function JobStatusBadge({ status }: { status: string }) {
  const key = status.trim().toLowerCase()
  const { variant, icon: Icon } = STATUS_CONFIG[key] ?? {
    variant: "secondary" as const,
    icon: Clock,
  }
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {formatStatusLabel(status)}
    </Badge>
  )
}
