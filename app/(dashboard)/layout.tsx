"use client"

import { DashboardSidebar, SidebarProvider, useSidebar } from "@/components/dashboard-sidebar"
import { MetricsProvider } from "@/components/metrics-context"
import { MetricsPrefetch } from "@/components/metrics-prefetch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed, setMobileNavOpen } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar />
      <main
        className={cn(
          "min-h-0 transition-[padding] duration-300",
          "pl-0",
          isCollapsed ? "lg:pl-16" : "lg:pl-64",
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-foreground">AdjustAid</span>
        </header>
        <div className="min-h-screen p-8">{children}</div>
      </main>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <MetricsProvider>
        <MetricsPrefetch />
        <DashboardContent>{children}</DashboardContent>
      </MetricsProvider>
    </SidebarProvider>
  )
}
